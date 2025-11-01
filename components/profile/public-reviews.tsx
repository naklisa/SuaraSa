// components/profile/public-reviews.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Stars } from "@/components/home/stars";
import Image from "next/image";

type Author = {
  id: string;
  displayName?: string | null;
  name?: string | null;
  image?: string | null;
};

type Review = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  createdAt: string;
  authorId: string;
  author: Author;
  trackId: string;
  track?: {
    id: string;
    name: string;
    artists: string[];
    album?: string | null;
    albumImage?: string | null;
  };
};

export default function PublicReviews({
  initialItems,
}: {
  initialItems: Review[];
}) {
  if (!initialItems?.length) {
    return (
      <div
        className="border p-6 text-sm"
        style={{
          background: "#e2fbce",
          borderColor: "#076653",
          color: "#076653",
        }}
      >
        No reviews yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {initialItems.map((r) => {
        const createdIso = new Date(r.createdAt).toISOString();
        const t = r.track; // ✅ Removed `as any` — type is already defined

        return (
          <article
            key={r.id}
            className="p-4 transition-all"
            style={{
              background: "#f0f9e8",
              border: "1px solid #076653",
              boxShadow: "0 2px 8px rgba(7, 102, 83, 0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e2fbce";
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(7, 102, 83, 0.25)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.borderColor = "#054a3c";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f0f9e8";
              e.currentTarget.style.boxShadow =
                "0 2px 8px rgba(7, 102, 83, 0.15)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "#076653";
            }}
          >
            <div className="flex items-start gap-3">
              {/* Optional album art leading the row */}
              {t?.albumImage ? (
                <Link href={`/track/${t.id}`} className="shrink-0">
                  <Image
                    src={t.albumImage}
                    alt={t.name || "Album art"}
                    width={48}
                    height={48}
                    loading="lazy"
                    className="w-12 h-12 object-cover border"
                    style={{
                      borderColor: "#076653",
                      boxShadow: "0 2px 4px rgba(7, 102, 83, 0.2)",
                    }}
                  />
                </Link>
              ) : null}

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                  <Link
                    href={`/track/${t?.id}`}
                    className="font-medium hover:underline truncate"
                    style={{ color: "#076653" }}
                  >
                    {t?.name ?? "Unknown track"}
                  </Link>
                  {t?.artists?.length ? (
                    <>
                      <span style={{ color: "#076653" }}>•</span>
                      <span
                        className="text-sm truncate"
                        style={{ color: "#0a6b56" }}
                      >
                        {t.artists.join(", ")}
                      </span>
                    </>
                  ) : null}
                  <span style={{ color: "#076653" }}>•</span>
                  <time dateTime={createdIso} style={{ color: "#0a6b56" }}>
                    {new Date(r.createdAt).toLocaleString()}
                  </time>
                </div>

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
            </div>
          </article>
        );
      })}
    </div>
  );
}
