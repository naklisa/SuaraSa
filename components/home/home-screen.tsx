// ========================================
// components/home/HomeScreen.tsx
// ========================================
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Hero } from "@/components/home/hero";
import { Trending } from "@/components/home/trending";
import { FeaturedReviews } from "@/components/home/featured-review";

export function HomeScreen() {
  const [q, setQ] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  async function search(searchQuery?: string) {
    const query = (searchQuery || q).trim();
    if (!query) return;

    setLoading(true);

    // Redirect to search results page instead of showing results here
    router.push(`/search?q=${encodeURIComponent(query)}`);
    
    // Reset loading after redirect starts
    setTimeout(() => setLoading(false), 100);
  }

  return (
    <div className="space-y-0 relative">
      {/* 🔹 Input Pencarian */}
      <Hero
        value={q}
        onChange={setQ}
        onSubmit={() => search()}
        loading={loading}
      />

      {/* 🔹 Bagian konten utama */}
      <Trending />
      <FeaturedReviews />
    </div>
  );
}