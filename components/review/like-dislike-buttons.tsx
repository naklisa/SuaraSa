"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type Props = {
  reviewId: string
  initialLikes: number
  initialDislikes: number
  userLikeStatus?: "like" | "dislike" | null
  currentUserId: string | null
  disabled?: boolean
}

export default function LikeDislikeButtons({
  reviewId,
  initialLikes,
  initialDislikes,
  userLikeStatus,
  currentUserId,
  disabled = false,
}: Props) {
  const [likes, setLikes] = React.useState(initialLikes)
  const [dislikes, setDislikes] = React.useState(initialDislikes)
  const [userStatus, setUserStatus] = React.useState<"like" | "dislike" | null>(userLikeStatus || null)
  const [loading, setLoading] = React.useState<"like" | "dislike" | null>(null)

  const isDisabled = disabled || !currentUserId || loading !== null

  const handleLike = async () => {
    if (isDisabled) return

    const newStatus = userStatus === "like" ? null : "like"
    setLoading("like")

    try {
      if (userStatus === "like") {
        // Unlike
        const res = await fetch(`/api/reviews/${reviewId}/like`, {
          method: "DELETE",
        })
        if (!res.ok) throw new Error("Failed to unlike")
        setLikes(prev => prev - 1)
        setUserStatus(null)
      } else {
        // Like (remove dislike if exists)
        if (userStatus === "dislike") {
          const res = await fetch(`/api/reviews/${reviewId}/dislike`, {
            method: "DELETE",
          })
          if (!res.ok) throw new Error("Failed to remove dislike")
          setDislikes(prev => prev - 1)
        }

        const res = await fetch(`/api/reviews/${reviewId}/like`, {
          method: "POST",
        })
        if (!res.ok) throw new Error("Failed to like")
        setLikes(prev => prev + 1)
        setUserStatus("like")
      }
    } catch (error) {
      toast.error("Failed to update like status")
      console.error(error)
    } finally {
      setLoading(null)
    }
  }

  const handleDislike = async () => {
    if (isDisabled) return

    const newStatus = userStatus === "dislike" ? null : "dislike"
    setLoading("dislike")

    try {
      if (userStatus === "dislike") {
        // Undislike
        const res = await fetch(`/api/reviews/${reviewId}/dislike`, {
          method: "DELETE",
        })
        if (!res.ok) throw new Error("Failed to undislike")
        setDislikes(prev => prev - 1)
        setUserStatus(null)
      } else {
        // Dislike (remove like if exists)
        if (userStatus === "like") {
          const res = await fetch(`/api/reviews/${reviewId}/like`, {
            method: "DELETE",
          })
          if (!res.ok) throw new Error("Failed to remove like")
          setLikes(prev => prev - 1)
        }

        const res = await fetch(`/api/reviews/${reviewId}/dislike`, {
          method: "POST",
        })
        if (!res.ok) throw new Error("Failed to dislike")
        setDislikes(prev => prev + 1)
        setUserStatus("dislike")
      }
    } catch (error) {
      toast.error("Failed to update dislike status")
      console.error(error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={isDisabled}
        className={cn(
          "flex items-center gap-2 transition-colors",
          userStatus === "like" && "text-blue-600 bg-blue-50 hover:bg-blue-100",
          loading === "like" && "opacity-50"
        )}
      >
        <ThumbsUp className="w-4 h-4" />
        <span className="text-sm font-medium">{likes}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleDislike}
        disabled={isDisabled}
        className={cn(
          "flex items-center gap-2 transition-colors",
          userStatus === "dislike" && "text-red-600 bg-red-50 hover:bg-red-100",
          loading === "dislike" && "opacity-50"
        )}
      >
        <ThumbsDown className="w-4 h-4" />
        <span className="text-sm font-medium">{dislikes}</span>
      </Button>
    </div>
  )
}
