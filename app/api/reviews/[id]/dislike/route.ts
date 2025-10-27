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

  // Check if user already disliked
  const existingDislike = await prisma.dislike.findUnique({
    where: {
      userId_reviewId: {
        userId,
        reviewId,
      },
    },
  })
  if (existingDislike) {
    return NextResponse.json({ error: "Already disliked" }, { status: 400 })
  }

  // Create dislike and increment counter
  await prisma.$transaction([
    prisma.dislike.create({
      data: { userId, reviewId },
    }),
    prisma.review.update({
      where: { id: reviewId },
      data: { dislikes: { increment: 1 } },
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

  // Check if dislike exists
  const existingDislike = await prisma.dislike.findUnique({
    where: {
      userId_reviewId: {
        userId,
        reviewId,
      },
    },
  })
  if (!existingDislike) {
    return NextResponse.json({ error: "Not disliked yet" }, { status: 400 })
  }

  // Delete dislike and decrement counter
  await prisma.$transaction([
    prisma.dislike.delete({
      where: {
        userId_reviewId: {
          userId,
          reviewId,
        },
      },
    }),
    prisma.review.update({
      where: { id: reviewId },
      data: { dislikes: { decrement: 1 } },
    }),
  ])

  return NextResponse.json({ ok: true })
}
