// components/home/results.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { Item } from "./types";
import Image from "next/image";

export function Results({
  items,
  error,
  anchorRef,
}: {
  items: Item[];
  error: string | null;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={anchorRef}>
      {error && (
        <div className="px-10">
          <div
            className="max-w-4xl mx-auto mb-4 text-center text-sm py-3 px-4"
            style={{
              color: "#dc2626",
              background: "rgba(220, 38, 38, 0.05)",
              border: "1px solid rgba(220, 38, 38, 0.2)",
              borderRadius: "8px",
            }}
          >
            ⚠️ {error}
          </div>
        </div>
      )}

      {items.length > 0 && (
        <section
          className="px-4 pb-20 pt-8"
          style={{
            background: "linear-gradient(180deg, #f0fdf4 0%, #e2fbce 100%)",
          }}
        >
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-3xl font-bold text-center mb-6"
              style={{
                color: "#076653",
                letterSpacing: "-0.02em",
              }}
            >
              Results
            </h2>

            <ul className="space-y-3">
              {items.map((t, index) => (
                <Link
                  key={t.id}
                  href={`/track/${t.id}`}
                  className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition"
                  style={{
                    animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
                  }}
                >
                  <Card
                    className="relative overflow-hidden transition-all duration-300"
                    style={{
                      background: "#ffffff",
                      border: "1px solid rgba(7, 102, 83, 0.15)",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                      borderRadius: "12px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(7, 102, 83, 0.15)";
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.borderColor = "#076653";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 1px 3px rgba(0, 0, 0, 0.05)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor =
                        "rgba(7, 102, 83, 0.15)";
                    }}
                  >
                    {/* Accent bar on left */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300"
                      style={{
                        background:
                          "linear-gradient(180deg, #076653 0%, #0a6b56 100%)",
                        opacity: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                    />

                    <CardContent className="p-5 flex items-center gap-5">
                      {/* Album Cover */}
                      <div className="relative shrink-0">
                        {t.image ? (
                          <div
                            className="relative w-20 h-20 overflow-hidden"
                            style={{
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                              borderRadius: "10px",
                              border: "2px solid rgba(255, 255, 255, 0.8)",
                            }}
                          >
                            <Image
                              src={t.image}
                              alt={t.name}
                              width={80}
                              height={80}
                              loading="lazy"
                              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                        ) : (
                          <div
                            className="w-20 h-20 flex items-center justify-center"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(226, 251, 206, 0.8) 0%, rgba(226, 251, 206, 0.4) 100%)",
                              border: "2px solid rgba(7, 102, 83, 0.2)",
                              borderRadius: "10px",
                            }}
                          >
                            <svg
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#076653"
                              strokeWidth="2"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Track Info */}
                      <div className="flex-1 min-w-0 py-1">
                        <h3
                          className="font-bold text-lg truncate transition-colors mb-1"
                          style={{
                            color: "#076653",
                            lineHeight: "1.3",
                          }}
                        >
                          {t.name}
                        </h3>

                        <div className="flex items-center gap-2 text-sm">
                          <p
                            className="truncate"
                            style={{
                              color: "#0a6b56",
                            }}
                          >
                            {t.artists.join(", ")}
                          </p>
                          <span style={{ color: "#94a3b8" }}>•</span>
                          <p
                            className="truncate"
                            style={{
                              color: "#64748b",
                            }}
                          >
                            {t.album}
                          </p>
                        </div>
                      </div>

                      {/* Action button */}
                      <div
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0"
                        style={{
                          transform: "translateX(-8px)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        <div
                          className="w-10 h-10 flex items-center justify-center"
                          style={{
                            background: "#076653",
                            borderRadius: "50%",
                            color: "white",
                          }}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </ul>
          </div>
        </section>
      )}

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
    </div>
  );
}
