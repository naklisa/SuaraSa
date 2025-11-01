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
    <section className="px-4 py-8" style={{ background: "#FFFDEE" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <h2
              className="text-xl md:text-2xl font-bold flex items-center gap-2"
              style={{
                color: "#000000",
                textShadow: "0 0 20px rgba(0, 191, 255, 0.4)",
              }}
            >
              Recommendations
            </h2>
          </div>

          {/* Info bar with message */}
          {!loading && items && items.length > 0 && (
            <div
              className="text-xs px-3 py-2 rounded-lg"
              style={{ background: "rgba(2, 195, 151, 0.1)", color: "#666" }}
            >
              <span className="font-medium">
                Curated for you — hope you find something you love!
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl p-3 animate-pulse space-y-3"
                style={{
                  background: "rgba(17, 34, 64, 0.5)",
                  border: "1px solid rgba(30, 144, 255, 0.3)",
                }}
              >
                <div
                  className="w-full aspect-square rounded-lg"
                  style={{ background: "rgba(30, 144, 255, 0.2)" }}
                />
                <div
                  className="h-4 w-2/3 rounded"
                  style={{ background: "rgba(30, 144, 255, 0.3)" }}
                />
                <div
                  className="h-3 w-1/2 rounded"
                  style={{ background: "rgba(30, 144, 255, 0.2)" }}
                />
              </div>
            ))}
          </div>
        ) : error ? (
          <Card
            style={{
              background: "#AFFA01",
              border: "1px solid rgba(30, 144, 255, 0.3)",
            }}
          >
            <CardContent className="p-6 text-sm" style={{ color: "#000000" }}>
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
                  background: "#02C397",
                  border: "1px solid rgba(30, 144, 255, 0.4)",
                  boxShadow: "0 4px 15px rgba(0, 191, 255, 0.15)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 30px rgba(0, 191, 255, 0.3)";
                  e.currentTarget.style.borderColor = "rgba(0, 191, 255, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(251, 0, 255, 0.15)";
                  e.currentTarget.style.borderColor = "rgba(30, 144, 255, 0.4)";
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
                      <div
                        className="w-full aspect-square rounded-lg overflow-hidden"
                        style={{
                          border: "2px solid rgba(30, 144, 255, 0.3)",
                          boxShadow: "0 4px 20px rgba(0, 191, 255, 0.2)",
                        }}
                      >
                        <Image
                          src={t.image}
                          alt={t.name}
                          width={500}
                          height={500}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-full aspect-square rounded-lg"
                        style={{
                          background: "#AACACE",
                          border: "2px solid rgba(30, 144, 255, 0.3)",
                        }}
                      />
                    )}

                    {/* Ranking badge */}
                    {idx < 8 && (
                      <span
                        className="absolute top-2 left-2 rounded-full px-2.5 py-1 text-xs font-bold"
                        style={{
                          background:
                            "linear-gradient(135deg, #e2fbce, #076653)",
                          color: "#000000",
                          boxShadow: "0 0 15px rgba(0, 191, 255, 0.5)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                        }}
                      >
                        #{idx + 1}
                      </span>
                    )}

                    {/* Glow overlay */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background:
                          "radial-gradient(circle at center, rgba(0, 191, 255, 0.15), transparent 70%)",
                      }}
                    />
                  </div>

                  <div className="mt-3">
                    <div
                      className="font-semibold truncate text-sm"
                      style={{ color: "#000000" }}
                    >
                      {t.name}
                    </div>
                    <div
                      className="text-xs truncate mt-0.5"
                      style={{ color: "#000000" }}
                    >
                      {t.artists.join(", ")}
                    </div>
                  </div>
                </CardContent>

                {/* Focus ring */}
                <span
                  className="pointer-events-none absolute inset-0 rounded-xl ring-0 ring-offset-1 group-focus-within:ring-2"
                  style={
                    {
                      "--tw-ring-color": "#000000",
                      backgroundColor: "transparent",
                    } as React.CSSProperties
                  }
                />
              </Card>
            ))}
          </div>
        ) : (
          <Card
            style={{
              background: "#AACACE",
              border: "1px solid rgba(30, 144, 255, 0.3)",
            }}
          >
            <CardContent className="p-6 text-sm" style={{ color: "#000000" }}>
              No trending tracks yet. Try searching to seed your cache.
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
