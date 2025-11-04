// components/review/review-list.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, X, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Stars } from "@/components/home/stars";
import Link from "next/link";
import Image from "next/image";
import LikeDislikeButtons from "@/components/review/like-dislike-buttons";
import CommentList from "@/components/comment/comment-list";
import CommentForm from "@/components/comment/comment-form";

// Formatter stabil: bahasa Indonesia + zona waktu Jakarta (mencegah hydration mismatch)
const DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
});

type Author = {
  id: string;
  displayName?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type Review = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  createdAt: string | Date;
  authorId: string;
  author: Author;
  trackId: string;
  likes: number;
  dislikes: number;
};

const BODY_MAX = 800;

export default function ReviewsList({
  trackId,
  initialItems,
  initialNextCursor,
  pageSize = 10,
  currentUserId,
}: {
  trackId: string;
  initialItems: Review[];
  initialNextCursor: string | null;
  pageSize?: number;
  currentUserId: string | null;
}) {
  const [items, setItems] = React.useState<Review[]>(
    initialItems.map((r) => ({ ...r, createdAt: String(r.createdAt) }))
  );
  const [nextCursor, setNextCursor] = React.useState<string | null>(
    initialNextCursor
  );
  const [loading, setLoading] = React.useState(false);

  // 🔁 Resync ketika props berubah (mis. setelah router.refresh)
  React.useEffect(() => {
    setItems(
      initialItems.map((r) => ({ ...r, createdAt: String(r.createdAt) }))
    );
    setNextCursor(initialNextCursor);
  }, [initialItems, initialNextCursor]);

  // 🔔 Listen event review baru dari form, lalu prepend
  React.useEffect(() => {
    const onCreated = (e: Event) => {
      const ce = e as CustomEvent<Review>;
      const review = ce.detail;
      if (!review || review.trackId !== trackId) return;
      setItems((prev) => {
        // hindari duplikat jika router.refresh sudah menarik data baru
        if (prev.some((x) => x.id === review.id)) return prev;
        const normalized = { ...review, createdAt: String(review.createdAt) };
        return [normalized, ...prev];
      });
    };
    window.addEventListener("review:created", onCreated as EventListener);
    return () =>
      window.removeEventListener("review:created", onCreated as EventListener);
  }, [trackId]);

  // edit dialog state
  const [editing, setEditing] = React.useState<Review | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [editBody, setEditBody] = React.useState("");
  const [editRating, setEditRating] = React.useState(0);
  const [editHover, setEditHover] = React.useState<number | null>(null);
  const [saving, setSaving] = React.useState(false);

  // delete dialog state
  const [deleteTarget, setDeleteTarget] = React.useState<Review | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const dirty =
    editing &&
    (editTitle !== (editing.title ?? "") ||
      editBody !== editing.body ||
      editRating !== editing.rating);

  const overLimit = editBody.length > BODY_MAX;
  const canSave =
    !!dirty &&
    !saving &&
    !!editBody.trim() &&
    !overLimit &&
    editRating >= 1 &&
    editRating <= 5;

  const startEdit = (r: Review) => {
    setEditing(r);
    setEditTitle(r.title ?? "");
    setEditBody(r.body);
    setEditRating(r.rating);
    setEditHover(null);
  };

  // keyboard support untuk rating (← / →)
  const onStarsKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setEditRating((p) => Math.min(5, p + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setEditRating((p) => Math.max(1, p - 1));
    }
  };

  const saveEdit = async () => {
    if (!editing || !canSave) return;
    try {
      setSaving(true);
      const payload = { title: editTitle, body: editBody, rating: editRating };
      const res = await fetch(`/api/reviews/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        toast.error("Failed to update review");
        return;
      }
      const json = (await res.json()) as { review: Review };
      setItems((prev) =>
        prev.map((it) =>
          it.id === editing.id
            ? { ...json.review, createdAt: String(json.review.createdAt) }
            : it
        )
      );
      toast.success("Review updated");
      setEditing(null);
    } catch {
      toast.error("Failed to update review");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/reviews/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.error("Failed to delete review");
        return;
      }
      setItems((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      toast.success("Review deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete review");
    } finally {
      setDeleting(false);
    }
  };

  const loadMore = async () => {
    if (!nextCursor || loading) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        trackId,
        limit: String(pageSize),
        cursor: nextCursor,
      });
      const res = await fetch(`/api/reviews?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load more");
      const json = (await res.json()) as {
        items: Review[];
        nextCursor: string | null;
      };
      setItems((prev) => [
        ...prev,
        ...json.items.map((r) => ({ ...r, createdAt: String(r.createdAt) })),
      ]);
      setNextCursor(json.nextCursor);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="space-y-4">
        <p className="text-sm" style={{ color: "#076653" }}>
          No reviews yet.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {items.map((r) => {
        const name = r.author?.displayName || r.author?.name || "User";
        const initial = (name?.[0] || "U").toUpperCase();

        // Hitung Date sekali, pakai di ISO + display
        const createdDate = new Date(r.createdAt);
        const createdIso = createdDate.toISOString();
        const createdDisplay = DATE_FORMATTER.format(createdDate);

        const mine = currentUserId && r.authorId === currentUserId;

        return (
          <article
            key={r.id}
            className="p-4 transition-all"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(7, 102, 83, 0.2)",
              boxShadow: "0 2px 8px rgba(7, 102, 83, 0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(7, 102, 83, 0.2)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.borderColor = "rgba(7, 102, 83, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 2px 8px rgba(7, 102, 83, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(7, 102, 83, 0.2)";
            }}
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              {r.author?.image ? (
                <Image
                  src={r.author.image}
                  alt={name}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full border object-cover"
                  style={{ borderColor: "rgba(7, 102, 83, 0.2)" }}
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={{
                    background: "#e2fbce",
                    color: "#076653",
                  }}
                >
                  {initial}
                </div>
              )}

              {/* Body */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                  <Link
                    href={`/user/${r.authorId}`}
                    className="font-medium truncate hover:underline transition-colors"
                    style={{ color: "#076653" }}
                  >
                    {name}
                  </Link>

                  <span style={{ color: "#076653" }}>•</span>
                  <time dateTime={createdIso} style={{ color: "#0a6b56" }}>
                    {createdDisplay}
                  </time>
                </div>

                {/* Rating row */}
                <div className="mt-1 text-sm flex items-center gap-2">
                  <Stars value={r.rating} />
                  <span className="text-xs" style={{ color: "#076653" }}>
                    {r.rating}/5
                  </span>
                  {r.title ? (
                    <span className="text-sm" style={{ color: "#0a6b56" }}>
                      — {r.title}
                    </span>
                  ) : null}
                </div>

                {r.body && (
                  <p
                    className="mt-1 text-sm whitespace-pre-wrap leading-relaxed"
                    style={{ color: "#0a6b56" }}
                  >
                    {r.body}
                  </p>
                )}
              </div>

              {/* Actions */}
              {mine && (
                <div className="ml-1 flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => startEdit(r)}
                    aria-label="Edit review"
                    title="Edit"
                    style={{ color: "#076653" }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => setDeleteTarget(r)}
                    aria-label="Delete review"
                    title="Delete"
                    style={{ color: "#076653" }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Like/Dislike Buttons */}
            <div className="mt-4 ml-12">
              <LikeDislikeButtons
                reviewId={r.id}
                initialLikes={r.likes}
                initialDislikes={r.dislikes}
                currentUserId={currentUserId}
              />
            </div>

            {/* Comments Section */}
            <div className="mt-4 ml-12">
              <CommentList
                reviewId={r.id}
                initialItems={[]} // TODO: seed initial comments if needed
                initialNextCursor={null}
                pageSize={5}
                currentUserId={currentUserId}
              />
              {currentUserId && (
                <div className="mt-3">
                  <CommentForm reviewId={r.id} />
                </div>
              )}
            </div>
          </article>
        );
      })}

      {nextCursor && (
        <div className="pt-2">
          <Button
            onClick={loadMore}
            disabled={loading}
            className="w-full sm:w-auto"
            style={{
              background: "#076653",
              color: "#ffffff",
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading…
              </>
            ) : (
              "Load more"
            )}
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent
          className="sm:max-w-lg"
          style={{
            background: "#ffffff",
            border: "1px solid rgba(7, 102, 83, 0.2)",
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: "#076653" }}>Edit review</DialogTitle>
            <DialogDescription style={{ color: "#0a6b56" }}>
              Adjust your rating and thoughts.
            </DialogDescription>
          </DialogHeader>

          <div
            className="mt-1 flex items-center gap-1 outline-none"
            role="radiogroup"
            aria-label="Edit rating"
            tabIndex={0}
            onKeyDown={onStarsKeyDown}
          >
            {[1, 2, 3, 4, 5].map((i) => {
              const active = (editHover ?? editRating) >= i;
              return (
                <button
                  key={i}
                  type="button"
                  role="radio"
                  aria-checked={editRating === i}
                  onMouseEnter={() => setEditHover(i)}
                  onMouseLeave={() => setEditHover(null)}
                  onFocus={() => setEditHover(i)}
                  onBlur={() => setEditHover(null)}
                  onClick={() => setEditRating(i)}
                  className={cn(
                    "px-1 text-lg leading-none transition",
                    active
                      ? "text-yellow-500/90 scale-105"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  style={!active ? { color: "#0a6b56" } : {}}
                >
                  ★
                  <span className="sr-only">
                    {i} star{i > 1 ? "s" : ""}
                  </span>
                </button>
              );
            })}
            <span className="ml-2 text-xs" style={{ color: "#0a6b56" }}>
              {editRating}/5
            </span>
          </div>

          <Input
            className="mt-4"
            placeholder="Title (optional)"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            style={{
              borderColor: "rgba(7, 102, 83, 0.2)",
              color: "#076653",
            }}
          />

          <div className="mt-3">
            <Textarea
              placeholder="Your review..."
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className="min-h-28"
              maxLength={BODY_MAX + 200}
              style={{
                borderColor: "rgba(7, 102, 83, 0.2)",
                color: "#076653",
              }}
            />
            <div
              className={cn(
                "mt-1 text-xs",
                overLimit ? "text-red-500" : "text-muted-foreground"
              )}
              style={{ color: overLimit ? "#ef4444" : "#0a6b56" }}
            >
              {editBody.length}/{BODY_MAX}{" "}
              {overLimit ? "(over the recommended length)" : ""}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setEditing(null)}
              style={{
                borderColor: "rgba(7, 102, 83, 0.2)",
                color: "#076653",
              }}
            >
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button
              onClick={saveEdit}
              disabled={!canSave}
              style={{
                background: "#076653",
                color: "#ffffff",
              }}
            >
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
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent
          style={{
            background: "#ffffff",
            border: "1px solid rgba(7, 102, 83, 0.2)",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: "#076653" }}>
              Delete this review?
            </AlertDialogTitle>
            <AlertDialogDescription style={{ color: "#0a6b56" }}>
              This action cannot be undone. Your review will be permanently
              removed.
              {deleteTarget?.body ? (
                <span
                  className="block mt-2 italic"
                  style={{ color: "#076653" }}
                >
                  {deleteTarget.body.length > 80
                    ? `${deleteTarget.body.slice(0, 80)}…`
                    : deleteTarget.body}
                </span>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              style={{
                borderColor: "rgba(7, 102, 83, 0.2)",
                color: "#076653",
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              style={{
                background: "#076653",
                color: "#ffffff",
              }}
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
    </section>
  );
}
