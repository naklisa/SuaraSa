// ========================================
// components/home/Hero.tsx
// ========================================
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Hero({
  value,
  onChange,
  onSubmit,
  loading,
  onFocus,
}: {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  loading: boolean;
  onFocus?: () => void;
}) {
  const [placeholder, setPlaceholder] = React.useState(0);
  const [isTyping, setIsTyping] = React.useState(false);

  const placeholders = [
    "Search for a song, artist, or vibe…",
    "Try 'Bohemian Rhapsody'…",
    "Discover new music…",
    "Find your next favorite track…",
    "Search by mood or genre…",
  ];

  // ✅ Fixed: tambahkan placeholders.length ke dependency agar tidak warning
  React.useEffect(() => {
    if (isTyping) return;
    const interval = setInterval(() => {
      setPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isTyping, placeholders.length]);

  return (
    <section
      className="relative px-4 pb-10 pt-8 text-center overflow-hidden"
      style={{
        backgroundImage: "url('/images/hero.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        borderRadius: "48px 48px 0 0",
      }}
    >
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent via-white/20 to-white" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
      >
        <div
          className="absolute top-10 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(0, 191, 255, 0.2), transparent)",
            animationDuration: "4s",
          }}
        />
        <div
          className="absolute top-20 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(7, 102, 83, 0.15), transparent)",
            animationDuration: "5s",
            animationDelay: "1s",
          }}
        />
      </div>

      <div className="relative">
        <h1
          className="text-5xl md:text-[10rem] relative inline-block"
          style={{
            color: "#ffffff",
            fontFamily: "retrock",
            textShadow:
              "0 4px 20px rgba(0, 0, 0, 0.3), 0 2px 10px rgba(2, 195, 151, 0.5)",
          }}
        >
          SuarAsa
        </h1>
      </div>

      <p
        className="mt-6 text-base md:text-lg max-w-2xl mx-auto relative font-medium"
        style={{
          color: "#ffffff",
          textShadow: "0 1px 4px rgba(0, 0, 0, 0.8)",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          letterSpacing: "0.01em",
        }}
      >
        Discover, review, and share your favorite tracks with the community.
      </p>

      <form
        className="mt-10 max-w-xl mx-auto relative"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        role="search"
        aria-label="Search tracks"
      >
        <div className="flex gap-3 relative">
          <div className="flex-1 relative">
            <Input
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setIsTyping(e.target.value.length > 0);
              }}
              placeholder={placeholders[placeholder]}
              className="h-14 text-base pl-12 pr-4 transition-all duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                border: "2px solid rgba(2, 195, 151, 0.3)",
                color: "#000000",
                boxShadow: "0 4px 20px rgba(0, 191, 255, 0.15)",
                borderRadius: "24px",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#02C397";
                e.currentTarget.style.boxShadow =
                  "0 4px 30px rgba(2, 195, 151, 0.4)";
                e.currentTarget.style.transform = "translateY(-2px)";
                if (onFocus) onFocus();
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(2, 195, 151, 0.3)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(0, 191, 255, 0.15)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
              aria-label="Search query"
            />

            <div
              className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
              style={{ color: "#02C397" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M21 21L16.65 16.65"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {value && !loading && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setIsTyping(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:bg-gray-200"
                style={{ color: "#666" }}
                aria-label="Clear search"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L13 13M1 13L13 1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>

          <Button
            type="submit"
            disabled={!value.trim() || loading}
            className="h-14 px-8 font-semibold transition-all duration-300 relative overflow-hidden"
            style={{
              background:
                value.trim() && !loading
                  ? "linear-gradient(135deg, #02C397, #076653)"
                  : "rgba(2, 195, 151, 0.3)",
              color:
                value.trim() && !loading ? "#ffffff" : "rgba(0, 0, 0, 0.3)",
              border: "2px solid transparent",
              borderRadius: "24px",
              boxShadow:
                value.trim() && !loading
                  ? "0 4px 20px rgba(2, 195, 151, 0.4)"
                  : "none",
              cursor: !value.trim() || loading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (value.trim() && !loading) {
                e.currentTarget.style.boxShadow =
                  "0 6px 30px rgba(2, 195, 151, 0.6)";
                e.currentTarget.style.transform =
                  "translateY(-2px) scale(1.02)";
              }
            }}
            onMouseLeave={(e) => {
              if (value.trim() && !loading) {
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(2, 195, 151, 0.4)";
                e.currentTarget.style.transform = "translateY(0) scale(1)";
              }
            }}
            aria-busy={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Searching…
              </span>
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </form>

      <div
        className="mt-6 flex items-center justify-center gap-2 text-xs"
        style={{ color: "#fff" }}
      >
        <span>Press</span>
        <kbd
          className="px-3 py-1.5 font-mono"
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            border: "1px solid rgba(2, 195, 151, 0.3)",
            color: "#02C397",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        >
          Enter
        </kbd>
        <span>to search</span>
      </div>
    </section>
  );
}
