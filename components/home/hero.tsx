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
}: {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  return (
    <section
      className="relative py-20 px-4 text-center"
      style={{ background: "#134686" }}
    >
      {/* Blue gradient backdrop with new palette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-96 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(92, 131, 179, 0.15), rgba(55, 100, 157, 0.1), transparent)",
        }}
      />

      <h1
        className="text-5xl md:text-7xl font-bold relative"
        style={{
          background:
            "linear-gradient(135deg, #ffffffff, #ffffffff, #ffffffff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textShadow: "0 0 40px rgba(255, 255, 255, 1)",
        }}
      >
        SuarAsa
      </h1>
      <p
        className="mt-4 text-base md:text-lg max-w-2xl mx-auto relative"
        style={{ color: "rgba(255, 255, 255, 1)" }}
      >
        Discover, review, and share your favorite tracks with the community.
      </p>

      <form
        className="mt-10 max-w-xl mx-auto flex gap-3 relative"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        role="search"
        aria-label="Search tracks"
      >
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search for a song, artist, or vibe…"
          className="h-12 text-base"
          style={{
            background: "rgba(55, 100, 157, 0.6)",
            border: "1px solid rgba(255, 255, 255, 1)",
            color: "#ffffffff",
            boxShadow: "0 0 20px rgba(92, 131, 179, 0.1)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "rgba(92, 131, 179, 0.6)";
            e.currentTarget.style.boxShadow =
              "0 0 25px rgba(92, 131, 179, 0.3)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(92, 131, 179, 0.4)";
            e.currentTarget.style.boxShadow =
              "0 0 20px rgba(92, 131, 179, 0.1)";
          }}
          aria-label="Search query"
        />
        <Button
          type="submit"
          disabled={!value.trim() || loading}
          className="h-12 px-8 font-semibold transition-all duration-200"
          style={{
            background:
              value.trim() && !loading
                ? "linear-gradient(135deg, #5c83b3, #37649d)"
                : "rgba(92, 131, 179, 0.3)",
            color:
              value.trim() && !loading ? "#E6F1FF" : "rgba(230, 241, 255, 0.5)",
            border: "1px solid rgba(92, 131, 179, 0.4)",
            boxShadow:
              value.trim() && !loading
                ? "0 0 20px rgba(92, 131, 179, 0.4)"
                : "none",
            cursor: !value.trim() || loading ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (value.trim() && !loading) {
              e.currentTarget.style.boxShadow =
                "0 0 30px rgba(92, 131, 179, 0.6)";
              e.currentTarget.style.transform = "scale(1.05)";
            }
          }}
          onMouseLeave={(e) => {
            if (value.trim() && !loading) {
              e.currentTarget.style.boxShadow =
                "0 0 20px rgba(92, 131, 179, 0.4)";
              e.currentTarget.style.transform = "scale(1)";
            }
          }}
          aria-busy={loading}
        >
          {loading ? "Searching…" : "Go"}
        </Button>
      </form>

      <p
        className="mt-4 text-xs relative"
        style={{ color: "rgba(230, 241, 255, 0.6)" }}
      >
        Tip: press{" "}
        <kbd
          className="px-2 py-1 rounded text-xs font-mono"
          style={{
            background: "rgba(92, 131, 179, 0.2)",
            border: "1px solid rgba(92, 131, 179, 0.4)",
            color: "#5c83b3",
          }}
        >
          Enter
        </kbd>{" "}
        to search
      </p>
    </section>
  );
}
