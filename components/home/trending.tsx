// ========================================
// components/home/Trending.tsx
// ========================================
"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { Item } from "./types";
import Image from "next/image";

export function Trending() {
  const [items, setItems] = React.useState<Item[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/trending", { cache: "no-store" });
        if (!r.ok) throw new Error("Failed to load trending");
        const json = await r.json();
        setItems(json.items ?? []);
      } catch {
        setError("Couldn't load trending right now.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="px-4 py-8" style={{ background: "#134686" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2
            className="text-xl md:text-2xl font-bold"
            style={{ color: "#FFFFFF" }}
          >
            Trending now
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl p-3 animate-pulse space-y-3"
                style={{
                  background: "#37649D",
                  border: "none",
                }}
              >
                <div
                  className="w-full aspect-square rounded-lg"
                  style={{ background: "#5C83B3" }}
                />
                <div
                  className="h-4 w-2/3 rounded"
                  style={{ background: "#5C83B3" }}
                />
                <div
                  className="h-3 w-1/2 rounded"
                  style={{ background: "#5C83B3" }}
                />
              </div>
            ))}
          </div>
        ) : error ? (
          <Card style={{ background: "#37649D", border: "none" }}>
            <CardContent className="p-6 text-sm" style={{ color: "#FFFFFF" }}>
              {error}
            </CardContent>
          </Card>
        ) : items && items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((t, idx) => (
              <Card
                key={t.id}
                className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105"
                style={{
                  background: "#37649D",
                  border: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#5C83B3";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#37649D";
                }}
              >
                <Link
                  href={`/track/${t.id}`}
                  className="absolute inset-0 z-10"
                  aria-label={`Open ${t.name} by ${t.artists.join(", ")}`}
                />

                <CardContent className="p-3">
                  <div className="relative overflow-hidden rounded-lg">
                    {t.image ? (
                      <Image
                        src={t.image}
                        alt={t.name}
                        width={500}
                        height={500}
                        loading="lazy"
                        className="w-full aspect-square object-cover rounded-lg transition-transform duration-300 ease-out group-hover:scale-110"
                      />
                    ) : (
                      <div
                        className="w-full aspect-square rounded-lg"
                        style={{ background: "#134686" }}
                      />
                    )}

                    {/* Rank badge */}
                    <span
                      className="absolute top-2 left-2 rounded-full px-2.5 py-1 text-xs font-bold"
                      style={{
                        background: "#5C83B3",
                        color: "#FFFFFF",
                      }}
                    >
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div
                      className="font-semibold truncate text-sm"
                      style={{ color: "#FFFFFF" }}
                    >
                      {t.name}
                    </div>
                    <div
                      className="text-xs truncate mt-0.5"
                      style={{ color: "rgba(255, 255, 255, 0.7)" }}
                    >
                      {t.artists.join(", ")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card style={{ background: "#37649D", border: "none" }}>
            <CardContent className="p-6 text-sm" style={{ color: "#FFFFFF" }}>
              No trending tracks yet. Try searching to seed your cache.
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
