import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUserId } from "@/lib/requireUser"

export const dynamic = "force-dynamic"

export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const userId = await requireUserId()
  const { id: reviewId } = await ctx.params

  // Check if review exists
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true },
  })
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 })
  }

  // Check if user already liked
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_reviewId: {
        userId,
        reviewId,
      },
    },
  })
  if (existingLike) {
    return NextResponse.json({ error: "Already liked" }, { status: 400 })
  }

  // Create like and increment counter
  await prisma.$transaction([
    prisma.like.create({
      data: { userId, reviewId },
    }),
    prisma.review.update({
      where: { id: reviewId },
      data: { likes: { increment: 1 } },
    }),
  ])

  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const userId = await requireUserId()
  const { id: reviewId } = await ctx.params

  // Check if review exists
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true },
  })
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 })
  }

  // Check if like exists
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_reviewId: {
        userId,
        reviewId,
      },
    },
  })
  if (!existingLike) {
    return NextResponse.json({ error: "Not liked yet" }, { status: 400 })
  }

  // Delete like and decrement counter
  await prisma.$transaction([
    prisma.like.delete({
      where: {
        userId_reviewId: {
          userId,
          reviewId,
        },
      },
    }),
    prisma.review.update({
      where: { id: reviewId },
      data: { likes: { decrement: 1 } },
    }),
  ])

  return NextResponse.json({ ok: true })
}
