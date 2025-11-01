// ========================================
// components/home/HomeScreen.tsx
// ========================================
"use client";

import * as React from "react";
import { Hero } from "@/components/home/hero";
import { Trending } from "@/components/home/trending";
import { FeaturedReviews } from "@/components/home/featured-review";
import { Results } from "@/components/home/results";
import type { Item } from "@/components/home/types";

export function HomeScreen() {
  const [q, setQ] = React.useState("");
  const [items, setItems] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [searchHistory, setSearchHistory] = React.useState<string[]>([]);
  const [showHistory, setShowHistory] = React.useState(false);
  const resultRef = React.useRef<HTMLDivElement | null>(null);

  // Load search history dari localStorage saat mount
  React.useEffect(() => {
    const stored = localStorage.getItem("search_history");
    if (stored) {
      try {
        setSearchHistory(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  // Save search history ke localStorage
  const saveToHistory = (query: string) => {
    const updated = [query, ...searchHistory.filter((h) => h !== query)].slice(
      0,
      5
    );
    setSearchHistory(updated);
    localStorage.setItem("search_history", JSON.stringify(updated));
  };

  async function search(searchQuery?: string) {
    const query = (searchQuery || q).trim();
    if (!query) return;

    setLoading(true);
    setError(null);
    setShowHistory(false);

    try {
      const r = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!r.ok) throw new Error("Search failed");
      const json = await r.json();
      setItems(json.items);
      saveToHistory(query);

      // Smooth-scroll to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
    } catch {
      setError("Something went wrong. Please try again.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("search_history");
  };

  return (
    <div
      className="space-y-0 relative"
      style={{ background: "#FFFDEE", minHeight: "50vh" }}
    >
      {/* Search History Dropdown - muncul saat focus input */}
      {showHistory && searchHistory.length > 0 && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowHistory(false)}
        >
          <div
            className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-auto px-4"
            style={{ top: "140px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="rounded-xl shadow-2xl border overflow-hidden"
              style={{
                background: "#02C397",
                borderColor: "rgba(30, 144, 255, 0.4)",
                boxShadow: "0 8px 30px rgba(0, 191, 255, 0.3)",
              }}
            >
              <div
                className="px-4 py-2 border-b flex items-center justify-between"
                style={{ borderColor: "rgba(30, 144, 255, 0.3)" }}
              >
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#000000" }}
                >
                  Recent Searches
                </span>
                <button
                  onClick={clearHistory}
                  className="text-xs hover:underline"
                  style={{ color: "#000000" }}
                >
                  Clear
                </button>
              </div>
              <div className="py-1">
                {searchHistory.map((h, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQ(h);
                      search(h);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-all"
                    style={{ color: "#000000" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(30, 144, 255, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span className="opacity-60">🔍</span>
                    <span className="flex-1">{h}</span>
                    <span className="text-xs opacity-40">↵</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Hero
        value={q}
        onChange={setQ}
        onSubmit={() => search()}
        loading={loading}
        onFocus={() => setShowHistory(true)}
      />

      {/* Quick Stats Bar */}
      {(items.length > 0 || loading) && (
        <div
          className="sticky top-0 z-30 px-4 py-2 border-b backdrop-blur-sm"
          style={{
            background: "rgba(255, 253, 238, 0.95)",
            borderColor: "rgba(30, 144, 255, 0.2)",
          }}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between text-xs">
            <span style={{ color: "#666" }}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-pulse">🔍</span>
                  Searching...
                </span>
              ) : (
                <span className="font-medium">
                  {items.length} result{items.length !== 1 ? "s" : ""} for "{q}"
                </span>
              )}
            </span>
            {!loading && items.length > 0 && (
              <button
                onClick={() => {
                  setItems([]);
                  setQ("");
                  setError(null);
                }}
                className="text-xs hover:underline"
                style={{ color: "#666" }}
              >
                Clear results
              </button>
            )}
          </div>
        </div>
      )}

      <Trending />
      <FeaturedReviews />
      <Results items={items} error={error} anchorRef={resultRef} />

      {/* Scroll to Top Button */}
      {items.length > 5 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-lg transition-all z-30 hover:scale-110"
          style={{
            background: "linear-gradient(135deg, #02C397, #076653)",
            color: "#ffffff",
            boxShadow: "0 4px 20px rgba(0, 191, 255, 0.3)",
          }}
          title="Scroll to top"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto"
          >
            <path
              d="M12 19V5M12 5L5 12M12 5L19 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
