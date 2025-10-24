// components/home/FeaturedReviews.tsx
"use client";

import * as React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

// Stars component inline
const Stars = ({ value }: { value: number }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className="w-4 h-4"
          fill={star <= value ? "#5c83b3" : "none"}
          stroke={star <= value ? "#5c83b3" : "#37649d"}
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
};

// Types
interface FeaturedItem {
  id: string;
  author: {
    name: string;
    image: string | null;
  };
  rating: number;
  createdAt: string;
  track: {
    id: string;
    name: string;
    artists: string[];
    image: string | null;
  };
  title: string | null;
  body: string | null;
}

export function FeaturedReviews() {
  const [items, setItems] = React.useState<FeaturedItem[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [interactions, setInteractions] = React.useState<
    Record<string, { like?: boolean; dislike?: boolean }>
  >({});

  React.useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/featured-reviews", { cache: "no-store" });
        if (!r.ok) throw new Error("Failed to load featured");
        const json = await r.json();
        setItems((json.items ?? []).slice(0, 3));
      } catch {
        setError("Couldn't load featured reviews right now.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleInteraction = (itemId: string, type: "like" | "dislike") => {
    setInteractions((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [type]: !prev[itemId]?.[type],
        [type === "like" ? "dislike" : "like"]: false,
      },
    }));
  };

  return (
    <section
      className="px-4 py-6"
      style={{ background: "#134686", minHeight: "100vh" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center gap-2">
          <h2
            className="text-xl md:text-2xl font-bold tracking-tight"
            style={{
              color: "#E6F1FF",
              textShadow: "0 0 20px rgba(92, 131, 179, 0.5)",
            }}
          >
            Featured Reviews
          </h2>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 animate-pulse space-y-3"
                style={{
                  background: "rgba(55, 100, 157, 0.3)",
                  border: "1px solid rgba(92, 131, 179, 0.3)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-full"
                    style={{ background: "rgba(92, 131, 179, 0.3)" }}
                  />
                  <div className="flex-1 space-y-2">
                    <div
                      className="h-4 w-32 rounded"
                      style={{ background: "rgba(92, 131, 179, 0.3)" }}
                    />
                    <div
                      className="h-3 w-20 rounded"
                      style={{ background: "rgba(92, 131, 179, 0.2)" }}
                    />
                  </div>
                </div>
                <div
                  className="h-3 w-3/4 rounded"
                  style={{ background: "rgba(92, 131, 179, 0.2)" }}
                />
                <div
                  className="h-3 w-2/3 rounded"
                  style={{ background: "rgba(92, 131, 179, 0.2)" }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Error or empty state */}
        {!loading && (!items || items.length === 0 || error) && (
          <div
            className="rounded-2xl p-5 text-sm text-center"
            style={{
              background: "rgba(55, 100, 157, 0.3)",
              border: "1px solid rgba(92, 131, 179, 0.3)",
              color: "rgba(230, 241, 255, 0.7)",
            }}
          >
            {error ?? "No featured reviews yet."}
          </div>
        )}

        {/* Success — clickable cards */}
        {!loading && items && items.length > 0 && (
          <div className="grid grid-cols-1 gap-5">
            {items.map((item) => (
              <div key={item.id} className="group relative">
                <a
                  href={`/track/${item.track.id}`}
                  className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-2xl transition"
                  style={{ outlineColor: "#5c83b3" }}
                >
                  <div
                    className="relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                    style={{
                      background: "rgba(55, 100, 157, 0.4)",
                      border: "1px solid rgba(92, 131, 179, 0.4)",
                      boxShadow: "0 4px 20px rgba(92, 131, 179, 0.15)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 8px 30px rgba(92, 131, 179, 0.3)";
                      e.currentTarget.style.borderColor =
                        "rgba(92, 131, 179, 0.6)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 4px 20px rgba(92, 131, 179, 0.15)";
                      e.currentTarget.style.borderColor =
                        "rgba(92, 131, 179, 0.4)";
                    }}
                  >
                    <div className="p-5 space-y-3">
                      {/* Header: author + rating */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {item.author.image ? (
                            <img
                              src={item.author.image}
                              alt={item.author.name}
                              className="w-10 h-10 rounded-full object-cover"
                              style={{
                                border: "2px solid rgba(92, 131, 179, 0.5)",
                                boxShadow: "0 0 10px rgba(92, 131, 179, 0.3)",
                              }}
                            />
                          ) : (
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                              style={{
                                background:
                                  "linear-gradient(135deg, #5c83b3, #37649d)",
                                color: "#E6F1FF",
                                boxShadow: "0 0 15px rgba(92, 131, 179, 0.5)",
                              }}
                            >
                              {(item.author.name?.[0] ?? "U").toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div
                              className="text-sm font-semibold"
                              style={{ color: "#E6F1FF" }}
                            >
                              {item.author.name}
                            </div>
                            <time
                              dateTime={new Date(item.createdAt).toISOString()}
                              className="text-xs"
                              style={{ color: "rgba(230, 241, 255, 0.6)" }}
                            >
                              {new Date(item.createdAt).toLocaleDateString()}
                            </time>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs">
                          <Stars value={item.rating} />
                          <span style={{ color: "#5c83b3", fontWeight: "600" }}>
                            {item.rating}/5
                          </span>
                        </div>
                      </div>

                      {/* Track + review */}
                      <div className="flex items-start gap-4">
                        {item.track.image && (
                          <div
                            className="relative shrink-0 overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-105"
                            style={{
                              width: "100px",
                              height: "100px",
                              border: "2px solid rgba(92, 131, 179, 0.4)",
                              boxShadow: "0 8px 25px rgba(92, 131, 179, 0.3)",
                            }}
                          >
                            <img
                              src={item.track.image}
                              alt={item.track.name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="mb-2">
                            <div
                              className="text-base font-bold leading-tight truncate"
                              style={{ color: "#E6F1FF" }}
                            >
                              {item.track.name}
                            </div>
                            <div
                              className="text-xs truncate"
                              style={{ color: "rgba(92, 131, 179, 0.9)" }}
                            >
                              {item.track.artists.join(", ")}
                            </div>
                          </div>

                          {item.title && (
                            <div
                              className="text-sm font-semibold leading-tight mb-1"
                              style={{ color: "#5c83b3" }}
                            >
                              {item.title}
                            </div>
                          )}
                          {item.body && (
                            <p
                              className="text-sm leading-relaxed line-clamp-3"
                              style={{ color: "rgba(230, 241, 255, 0.85)" }}
                            >
                              {item.body}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Subtle glow overlay on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 50%, rgba(92, 131, 179, 0.08), transparent 70%)",
                      }}
                    />
                  </div>
                </a>

                {/* Like/Dislike buttons - outside the link */}
                <div
                  className="flex items-center gap-3 mt-3 px-5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleInteraction(item.id, "like")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200"
                    style={{
                      background: interactions[item.id]?.like
                        ? "linear-gradient(135deg, #5c83b3, #37649d)"
                        : "rgba(92, 131, 179, 0.15)",
                      color: interactions[item.id]?.like
                        ? "#E6F1FF"
                        : "#E6F1FF",
                      border: "1px solid rgba(92, 131, 179, 0.4)",
                      transform: interactions[item.id]?.like
                        ? "scale(1.05)"
                        : "scale(1)",
                      boxShadow: interactions[item.id]?.like
                        ? "0 0 20px rgba(92, 131, 179, 0.5)"
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!interactions[item.id]?.like) {
                        e.currentTarget.style.background =
                          "rgba(92, 131, 179, 0.25)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!interactions[item.id]?.like) {
                        e.currentTarget.style.background =
                          "rgba(92, 131, 179, 0.15)";
                      }
                    }}
                  >
                    <ThumbsUp size={14} />
                    Like
                  </button>

                  <button
                    onClick={() => handleInteraction(item.id, "dislike")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200"
                    style={{
                      background: interactions[item.id]?.dislike
                        ? "rgba(255, 100, 100, 0.8)"
                        : "rgba(92, 131, 179, 0.15)",
                      color: interactions[item.id]?.dislike
                        ? "#E6F1FF"
                        : "#E6F1FF",
                      border: "1px solid rgba(92, 131, 179, 0.4)",
                      transform: interactions[item.id]?.dislike
                        ? "scale(1.05)"
                        : "scale(1)",
                      boxShadow: interactions[item.id]?.dislike
                        ? "0 0 20px rgba(255, 100, 100, 0.4)"
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!interactions[item.id]?.dislike) {
                        e.currentTarget.style.background =
                          "rgba(92, 131, 179, 0.25)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!interactions[item.id]?.dislike) {
                        e.currentTarget.style.background =
                          "rgba(92, 131, 179, 0.15)";
                      }
                    }}
                  >
                    <ThumbsDown size={14} />
                    Dislike
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
