import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { requireUserId } from "@/lib/requireUser"

export const dynamic = "force-dynamic"

const BODY_MAX = 500

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id: reviewId } = await ctx.params
  const url = new URL(req.url)
  const limitParam = url.searchParams.get("limit")
  const cursorId = url.searchParams.get("cursor")

  // Check if review exists
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true },
  })
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 })
  }

  const limit = Math.max(1, Math.min(Number(limitParam) || 10, 50))
  const take = limit + 1

  const [itemsPlusOne] = await Promise.all([
    prisma.comment.findMany({
      where: { reviewId },
      include: { author: true },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      ...(cursorId ? { cursor: { id: cursorId }, skip: 1 } : {}),
      take,
    }),
  ])

  let nextCursor: string | null = null
  let items = itemsPlusOne
  if (itemsPlusOne.length > limit) {
    const nextItem = itemsPlusOne[itemsPlusOne.length - 1]
    nextCursor = nextItem.id
    items = itemsPlusOne.slice(0, limit)
  }

  return NextResponse.json({
    items,
    nextCursor,
  })
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const userId = await requireUserId()
  const { id: reviewId } = await ctx.params
  const { body } = await req.json()

  // Check if review exists
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true },
  })
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 })
  }

  const b = String(body ?? "").trim()
  if (b.length === 0 || b.length > BODY_MAX) {
    return NextResponse.json({ error: "Invalid body length" }, { status: 400 })
  }

  const comment = await prisma.comment.create({
    data: { reviewId, body: b, authorId: userId },
    include: { author: true },
  })

  return NextResponse.json({ comment })
}
