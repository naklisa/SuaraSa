// components/comment/comment-form.tsx
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type Props = Readonly<{
  reviewId: string
  disabled?: boolean
}>

const BODY_MAX = 500

export default function CommentForm({
  reviewId,
  disabled = false,
}: Props): React.ReactElement {
  const [body, setBody] = React.useState<string>("")
  const [loading, setLoading] = React.useState<boolean>(false)

  const canSubmit =
    !disabled &&
    !loading &&
    body.trim().length > 0 &&
    body.length <= BODY_MAX

  const handleSubmit = React.useCallback<React.FormEventHandler<HTMLFormElement>>(
    async (e) => {
      e.preventDefault()
      if (!canSubmit) return
      setLoading(true)
      try {
        const res = await fetch(`/api/reviews/${reviewId}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body }),
        })
        if (!res.ok) {
          let msg = "Failed to post comment"
          try {
            const j = (await res.json()) as { error?: string }
            if (j?.error) msg = j.error
          } catch {
            // ignore parse error
          }
          throw new Error(msg)
        }

        // created comment from server
        const { comment } = (await res.json()) as { comment: unknown }
        // fire custom event
        window.dispatchEvent(new CustomEvent("comment:created", { detail: comment }))

        // reset form
        setBody("")

        toast.success("Comment posted successfully")
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to post comment"
        toast.error(message)
      } finally {
        setLoading(false)
      }
    },
    [body, canSubmit, reviewId]
  )

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("space-y-3 p-3 rounded-lg border bg-card/50")}
      aria-busy={loading}
    >
      <Textarea
        value={body}
        onChange={(e) => setBody(e.currentTarget.value)}
        placeholder="Add a comment..."
        className="min-h-20 resize-none"
        disabled={disabled || loading}
        maxLength={BODY_MAX + 200}
      />
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "text-xs",
            body.length > BODY_MAX ? "text-destructive" : "text-muted-foreground"
          )}
          aria-live="polite"
        >
          {body.length}/{BODY_MAX}
        </div>
        <Button
          type="submit"
          disabled={!canSubmit}
          size="sm"
          className="bg-primary hover:bg-primary/90"
        >
          {loading ? (
            <>
              <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Posting...
            </>
          ) : (
            "Post Comment"
          )}
        </Button>
      </div>
    </form>
  )
}
