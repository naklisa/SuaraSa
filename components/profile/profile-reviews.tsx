// app/profile/profile-reviews.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Pencil, Trash2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";

type Track = {
  id: string;
  name: string;
  artists: string[];
  album: string | null;
  albumImage: string | null;
};

type Review = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  createdAt: string; // ISO
  authorId: string;
  trackId: string;
  track?: Track | null;
};

export default function ProfileReviews({
  initialItems,
}: {
  initialItems: Review[];
}) {
  const [items, setItems] = React.useState<Review[]>(initialItems);

  // Edit state
  const [editing, setEditing] = React.useState<Review | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [editBody, setEditBody] = React.useState("");
  const [editRating, setEditRating] = React.useState(5);
  const [editHover, setEditHover] = React.useState<number | null>(null);
  const [saving, setSaving] = React.useState(false);

  // Delete state
  const [deleting, setDeleting] = React.useState<Review | null>(null);
  const [deletingBusy, setDeletingBusy] = React.useState(false);

  const openEdit = (r: Review) => {
    setEditing(r);
    setEditTitle(r.title ?? "");
    setEditBody(r.body);
    setEditRating(r.rating);
    setEditHover(null);
  };
  const closeEdit = () => {
    if (saving) return;
    setEditing(null);
    setEditTitle("");
    setEditBody("");
    setEditRating(5);
    setEditHover(null);
  };

  async function saveEdit() {
    if (!editing) return;
    try {
      setSaving(true);
      const payload = { title: editTitle, body: editBody, rating: editRating };
      const res = await fetch(`/api/reviews/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      const json = (await res.json()) as { review: Review };
      setItems((prev) =>
        prev.map((it) =>
          it.id === editing.id
            ? { ...json.review, createdAt: String(json.review.createdAt) }
            : it
        )
      );
      toast.success("Review updated");
      closeEdit();
    } catch {
      toast.error("Failed to update review");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    try {
      setDeletingBusy(true);
      const res = await fetch(`/api/reviews/${deleting.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      setItems((prev) => prev.filter((r) => r.id !== deleting.id));
      toast.success("Review deleted");
      setDeleting(null);
    } catch {
      toast.error("Failed to delete review");
    } finally {
      setDeletingBusy(false);
    }
  }

  if (items.length === 0) {
    return (
      <Card
        className="border-muted overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #e2fbce 0%, #d4f5b8 100%)",
          border: "1px solid rgba(7, 102, 83, 0.2)",
          borderRadius: "16px",
        }}
      >
        <CardContent className="p-8 text-center">
          <div
            className="w-16 h-16 mx-auto mb-4 flex items-center justify-center"
            style={{
              background: "rgba(255, 255, 255, 0.6)",
              borderRadius: "50%",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#076653"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
              <path d="M17.7 7.7a7.1 7.1 0 0 0 -10.4 0M21 5.9a11.2 11.2 0 0 0 -18 0" />
            </svg>
          </div>
          <p
            className="text-base font-medium mb-2"
            style={{ color: "#076653" }}
          >
            No reviews yet
          </p>
          <p className="text-sm" style={{ color: "#0a6b56" }}>
            Search a song on the homepage to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {items.map((r, index) => {
          const t = r.track;
          const created = new Date(r.createdAt);
          return (
            <Card
              key={r.id}
              className="transition-all duration-300 overflow-hidden"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(7, 102, 83, 0.15)",
                boxShadow: "0 2px 8px rgba(7, 102, 83, 0.08)",
                borderRadius: "16px",
                animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(7, 102, 83, 0.15)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "#076653";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(7, 102, 83, 0.08)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(7, 102, 83, 0.15)";
              }}
            >
              <CardContent className="p-5 flex items-start gap-5">
                {/* Album Image */}
                {t?.albumImage && (
                  <div className="relative shrink-0">
                    <Image
                      src={t.albumImage}
                      alt={t.name}
                      width={80}
                      height={80}
                      loading="lazy"
                      className="w-20 h-20 object-cover"
                      style={{
                        borderRadius: "12px",
                        border: "2px solid rgba(255, 255, 255, 0.8)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  {/* Track info */}
                  <div className="mb-3">
                    <Link
                      href={`/track/${t?.id ?? r.trackId}`}
                      className="font-bold text-lg hover:underline block mb-1 truncate transition-colors"
                      style={{ color: "#076653" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#054a3c";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#076653";
                      }}
                    >
                      {t?.name ?? "Unknown track"}
                    </Link>

                    <div className="flex items-center gap-2 text-sm">
                      <span style={{ color: "#0a6b56" }}>
                        {(t?.artists ?? []).join(", ")}
                      </span>
                      {t?.album && (
                        <>
                          <span style={{ color: "#94a3b8" }}>•</span>
                          <span style={{ color: "#64748b" }}>{t.album}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Rating display */}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#076653" }}
                    >
                      Rating: {r.rating}/5
                    </span>
                  </div>

                  {/* Review title */}
                  {r.title && (
                    <h4
                      className="font-semibold text-base mb-2"
                      style={{ color: "#076653" }}
                    >
                      {r.title}
                    </h4>
                  )}

                  {/* Review body */}
                  {r.body && (
                    <div
                      className="text-sm whitespace-pre-wrap p-3 mb-3"
                      style={{
                        color: "#076653",
                        background:
                          "linear-gradient(135deg, rgba(226, 251, 206, 0.2) 0%, rgba(255, 255, 255, 0.8) 100%)",
                        borderRadius: "8px",
                      }}
                    >
                      {r.body}
                    </div>
                  )}

                  {/* Timestamp */}
                  <div
                    className="flex items-center gap-2 text-xs"
                    style={{ color: "#64748b" }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {created.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-2 shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 transition-all"
                    onClick={() => openEdit(r)}
                    aria-label="Edit review"
                    style={{
                      color: "#076653",
                      borderRadius: "8px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(226, 251, 206, 0.6)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 transition-all"
                    onClick={() => setDeleting(r)}
                    aria-label="Delete review"
                    style={{
                      color: "#dc2626",
                      borderRadius: "8px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(220, 38, 38, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => (!o ? closeEdit() : null)}>
        <DialogContent
          style={{
            background: "#ffffff",
            border: "2px solid rgba(7, 102, 83, 0.2)",
            borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(7, 102, 83, 0.2)",
          }}
        >
          <DialogHeader>
            <DialogTitle
              className="text-2xl font-bold"
              style={{ color: "#076653" }}
            >
              Edit Review
            </DialogTitle>
          </DialogHeader>

          {/* Rating stars */}
          <div className="py-4">
            <label
              className="text-sm font-medium mb-3 block"
              style={{ color: "#076653" }}
            >
              Your Rating
            </label>
            <div
              className="flex items-center gap-2"
              role="radiogroup"
              aria-label="Edit rating out of 5"
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
                    className="p-2 rounded-lg transition-all"
                    style={{
                      background: active
                        ? "rgba(226, 251, 206, 0.5)"
                        : "transparent",
                    }}
                  >
                    <Star
                      className={cn(
                        "w-8 h-8 transition-all",
                        active
                          ? "fill-yellow-400 text-yellow-400 scale-110"
                          : "text-gray-300"
                      )}
                    />
                    <span className="sr-only">
                      {i} star{i > 1 ? "s" : ""}
                    </span>
                  </button>
                );
              })}
              <span
                className="ml-2 text-lg font-bold px-3 py-1 rounded-full"
                style={{
                  color: "#076653",
                  background: "rgba(226, 251, 206, 0.5)",
                }}
              >
                {editRating}/5
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="text-sm font-medium mb-2 block"
                style={{ color: "#076653" }}
              >
                Title (Optional)
              </label>
              <input
                className="w-full border-2 rounded-lg px-4 py-3 text-sm bg-background transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
                placeholder="Give your review a title..."
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{
                  borderColor: "rgba(7, 102, 83, 0.2)",
                  color: "#076653",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#076653";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(7, 102, 83, 0.2)";
                }}
              />
            </div>

            <div>
              <label
                className="text-sm font-medium mb-2 block"
                style={{ color: "#076653" }}
              >
                Your Review
              </label>
              <textarea
                className="w-full border-2 rounded-lg px-4 py-3 text-sm bg-background min-h-32 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
                placeholder="Share your thoughts about this track..."
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                style={{
                  borderColor: "rgba(7, 102, 83, 0.2)",
                  color: "#076653",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#076653";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(7, 102, 83, 0.2)";
                }}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 mt-6">
            <Button
              variant="outline"
              onClick={closeEdit}
              disabled={saving}
              className="px-6 transition-all"
              style={{
                borderColor: "rgba(7, 102, 83, 0.3)",
                color: "#076653",
                borderWidth: "2px",
                borderRadius: "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(226, 251, 206, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={saveEdit}
              disabled={saving}
              className="px-6 transition-all"
              style={{
                background: "linear-gradient(135deg, #076653 0%, #0a6b56 100%)",
                color: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(7, 102, 83, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(7, 102, 83, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(7, 102, 83, 0.3)";
              }}
            >
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete AlertDialog */}
      <AlertDialog
        open={!!deleting}
        onOpenChange={(o) => (!o ? setDeleting(null) : null)}
      >
        <AlertDialogContent
          style={{
            background: "#ffffff",
            border: "2px solid rgba(220, 38, 38, 0.3)",
            borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(220, 38, 38, 0.2)",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle
              className="text-2xl font-bold flex items-center gap-2"
              style={{ color: "#dc2626" }}
            >
              <Trash2 className="w-6 h-6" />
              Delete Review?
            </AlertDialogTitle>
            <AlertDialogDescription
              className="text-base"
              style={{ color: "#64748b" }}
            >
              This action cannot be undone. Your review will be permanently
              removed.
              {deleting?.body && (
                <div
                  className="mt-4 p-4 rounded-lg border-l-4"
                  style={{
                    background: "rgba(220, 38, 38, 0.05)",
                    borderColor: "#dc2626",
                  }}
                >
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: "#dc2626" }}
                  >
                    Review Preview:
                  </p>
                  <p className="text-sm italic" style={{ color: "#64748b" }}>
                    "
                    {deleting.body.length > 100
                      ? `${deleting.body.slice(0, 100)}…`
                      : deleting.body}
                    "
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 mt-4">
            <AlertDialogCancel
              disabled={deletingBusy}
              className="px-6 transition-all"
              style={{
                borderColor: "rgba(7, 102, 83, 0.3)",
                color: "#076653",
                borderWidth: "2px",
                borderRadius: "8px",
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deletingBusy}
              className="px-6 transition-all"
              style={{
                background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                color: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(220, 38, 38, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(220, 38, 38, 0.3)";
              }}
            >
              {deletingBusy ? "Deleting…" : "Delete Review"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
