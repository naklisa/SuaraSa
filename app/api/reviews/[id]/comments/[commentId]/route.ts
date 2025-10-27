import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUserId } from "@/lib/requireUser"

export const dynamic = "force-dynamic"

type PatchBody = {
  body?: string
}

const BODY_MAX = 500

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string; commentId: string }> }
) {
  const userId = await requireUserId()
  const { id: reviewId, commentId } = await ctx.params

  const payload = (await req.json()) as PatchBody

  const exists = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { authorId: true, reviewId: true },
  })
  if (!exists) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (exists.authorId !== userId || exists.reviewId !== reviewId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const data: PatchBody = {}
  if (typeof payload.body !== "undefined") {
    const b = String(payload.body ?? "").trim()
    if (b.length === 0 || b.length > BODY_MAX) {
      return NextResponse.json({ error: "Invalid body length" }, { status: 400 })
    }
    data.body = b
  }

  const comment = await prisma.comment.update({
    where: { id: commentId },
    data,
    include: { author: true },
  })

  return NextResponse.json({ comment })
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string; commentId: string }> }
) {
  const userId = await requireUserId()
  const { id: reviewId, commentId } = await ctx.params

  const exists = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { authorId: true, reviewId: true },
  })
  if (!exists) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (exists.authorId !== userId || exists.reviewId !== reviewId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await prisma.comment.delete({ where: { id: commentId } })
  return NextResponse.json({ ok: true })
}
