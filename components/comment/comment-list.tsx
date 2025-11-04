// components/comment/comment-list.tsx
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, X, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import Image from "next/image"

type Author = {
  id: string
  displayName?: string | null
  name?: string | null
  email?: string | null
  image?: string | null
}

type Comment = {
  id: string
  body: string
  createdAt: string | Date
  authorId: string
  author: Author
  reviewId: string
}

const BODY_MAX = 500

export default function CommentList({
  reviewId,
  initialItems,
  initialNextCursor,
  pageSize = 10,
  currentUserId,
}: {
  reviewId: string
  initialItems: Comment[]
  initialNextCursor: string | null
  pageSize?: number
  currentUserId: string | null
}) {
  const [items, setItems] = React.useState<Comment[]>(
    initialItems.map((c) => ({ ...c, createdAt: String(c.createdAt) }))
  )
  const [nextCursor, setNextCursor] = React.useState<string | null>(initialNextCursor)
  const [loading, setLoading] = React.useState(false)

  // 🔁 IMPORTANT: resync when props change
  React.useEffect(() => {
    setItems(initialItems.map((c) => ({ ...c, createdAt: String(c.createdAt) })))
    setNextCursor(initialNextCursor)
  }, [initialItems, initialNextCursor])

  // Fetch comments on mount
  React.useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/reviews/${reviewId}/comments?limit=${pageSize}`, { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to fetch comments")
        const json = await res.json()
        setItems(json.items.map((c: Comment) => ({ ...c, createdAt: String(c.createdAt) })))
        setNextCursor(json.nextCursor)
      } catch (error) {
        console.error("Error fetching comments:", error)
      }
    }
    fetchComments()
  }, [reviewId, pageSize])

  // 🔔 Listen for newly-created comment
  React.useEffect(() => {
    const onCreated = (e: Event) => {
      const ce = e as CustomEvent<Comment>
      const comment = ce.detail
      if (!comment || comment.reviewId !== reviewId) return
      setItems((prev) => {
        if (prev.some((x) => x.id === comment.id)) return prev
        const normalized = { ...comment, createdAt: String(comment.createdAt) }
        return [...prev, normalized]
      })
    }
    window.addEventListener("comment:created", onCreated as EventListener)
    return () => window.removeEventListener("comment:created", onCreated as EventListener)
  }, [reviewId])

  // edit dialog state
  const [editing, setEditing] = React.useState<Comment | null>(null)
  const [editBody, setEditBody] = React.useState("")
  const [saving, setSaving] = React.useState(false)

  // delete dialog state
  const [deleteTarget, setDeleteTarget] = React.useState<Comment | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  const dirty = editing && editBody !== editing.body
  const overLimit = editBody.length > BODY_MAX
  const canSave = !!dirty && !saving && !!editBody.trim() && !overLimit

  const startEdit = (c: Comment) => {
    setEditing(c)
    setEditBody(c.body)
  }

  const saveEdit = async () => {
    if (!editing || !canSave) return
    try {
      setSaving(true)
      const payload = { body: editBody }
      const res = await fetch(`/api/reviews/${reviewId}/comments/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        toast.error("Failed to update comment")
        return
      }
      const json = (await res.json()) as { comment: Comment }
      setItems((prev) =>
        prev.map((it) =>
          it.id === editing.id ? { ...json.comment, createdAt: String(json.comment.createdAt) } : it
        )
      )
      toast.success("Comment updated")
      setEditing(null)
    } catch {
      toast.error("Failed to update comment")
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      const res = await fetch(`/api/reviews/${reviewId}/comments/${deleteTarget.id}`, { method: "DELETE" })
      if (!res.ok) {
        toast.error("Failed to delete comment")
        return
      }
      setItems((prev) => prev.filter((c) => c.id !== deleteTarget.id))
      toast.success("Comment deleted")
      setDeleteTarget(null)
    } catch {
      toast.error("Failed to delete comment")
    } finally {
      setDeleting(false)
    }
  }

  const loadMore = async () => {
    if (!nextCursor || loading) return
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: String(pageSize),
        cursor: nextCursor,
      })
      const res = await fetch(`/api/reviews/${reviewId}/comments?${params.toString()}`, { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load more")
      const json = (await res.json()) as { items: Comment[]; nextCursor: string | null }
      setItems((prev) => [
        ...prev,
        ...json.items.map((c) => ({ ...c, createdAt: String(c.createdAt) })),
      ])
      setNextCursor(json.nextCursor)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No comments yet.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((c) => {
        const name = c.author?.displayName || c.author?.name || "User"
        const initial = (name?.[0] || "U").toUpperCase()
        const createdIso = new Date(c.createdAt).toISOString()
        const mine = currentUserId && c.authorId === currentUserId

        return (
          <div
            key={c.id}
            className="flex gap-3 p-3 rounded-lg bg-muted/50"
          >
            {/* Avatar */}
            {c.author?.image ? (
              <Image
                src={c.author.image}
                alt={name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                {initial}
              </div>
            )}

            {/* Body */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs">
                <Link
                  href={`/user/${c.authorId}`}
                  className="font-medium truncate hover:underline hover:text-primary transition-colors"
                >
                  {name}
                </Link>
                <span className="text-muted-foreground">•</span>
                <time dateTime={createdIso} className="text-muted-foreground">
                  {new Date(c.createdAt).toLocaleString(undefined, {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </time>
              </div>

              <p className="mt-1 text-sm whitespace-pre-wrap leading-relaxed">
                {c.body}
              </p>
            </div>

            {/* Actions */}
            {mine && (
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => startEdit(c)}
                  aria-label="Edit comment"
                  title="Edit"
                >
                  <Pencil className="w-3 h-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-destructive"
                  onClick={() => setDeleteTarget(c)}
                  aria-label="Delete comment"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        )
      })}

      {nextCursor && (
        <div className="pt-2">
          <Button
            onClick={loadMore}
            disabled={loading}
            size="sm"
            variant="outline"
          >
            {loading ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Loading…
              </>
            ) : (
              "Load more"
            )}
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit comment</DialogTitle>
            <DialogDescription>Update your comment.</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Textarea
              placeholder="Your comment..."
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className="min-h-20"
              maxLength={BODY_MAX + 200}
            />
            <div
              className={cn(
                "text-xs",
                overLimit ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {editBody.length}/{BODY_MAX} {overLimit ? "(over the recommended length)" : ""}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditing(null)}>
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button onClick={saveEdit} disabled={!canSave}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1" /> Save
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this comment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Your comment will be permanently removed.
              {deleteTarget?.body ? (
                <span className="block mt-2 text-foreground italic">
                  “{deleteTarget.body.length > 60 ? `${deleteTarget.body.slice(0, 60)}…` : deleteTarget.body}”
                </span>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting…
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
