'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Item } from '@/components/home/types';

export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (query) {
      searchTracks(query);
    } else {
      setLoading(false);
    }
  }, [query]);

  async function searchTracks(searchQuery: string) {
    setLoading(true);
    setError(null);

    try {
      const r = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!r.ok) throw new Error('Search failed');
      const json = await r.json();
      setItems(json.items || []);
    } catch {
      setError('Something went wrong. Please try again.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#FFFDED' }}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center mb-6 transition-colors group"
            style={{ color: '#666' }}
          >
            <svg className="w-5 h-5 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="group-hover:underline">Back to Home</span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#076653' }}>
            Search Results
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search for another song..."
                  className="w-full h-14 px-12 text-base transition-all duration-300 outline-none"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '2px solid rgba(2, 195, 151, 0.3)',
                    color: '#000000',
                    boxShadow: '0 4px 20px rgba(0, 191, 255, 0.15)',
                    borderRadius: '24px',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#02C397';
                    e.currentTarget.style.boxShadow = '0 4px 30px rgba(2, 195, 151, 0.4)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(2, 195, 151, 0.3)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 191, 255, 0.15)';
                  }}
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" style={{ color: '#02C397' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <button
                type="submit"
                disabled={!searchInput.trim()}
                className="h-14 px-8 font-semibold transition-all duration-300"
                style={{
                  background: searchInput.trim() ? 'linear-gradient(135deg, #02C397, #076653)' : 'rgba(2, 195, 151, 0.3)',
                  color: searchInput.trim() ? '#ffffff' : 'rgba(0, 0, 0, 0.3)',
                  border: '2px solid transparent',
                  borderRadius: '24px',
                  boxShadow: searchInput.trim() ? '0 4px 20px rgba(2, 195, 151, 0.4)' : 'none',
                  cursor: !searchInput.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 mx-auto mb-4" viewBox="0 0 24 24" style={{ color: '#02C397' }}>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p style={{ color: '#666' }}>Searching...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-red-500 mb-4">⚠️</div>
            <p className="text-lg" style={{ color: '#666' }}>{error}</p>
          </div>
        ) : query ? (
          <div>
            <h2 className="text-xl font-semibold mb-6" style={{ color: '#076653' }}>
              {items.length} result{items.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
            </h2>

            {items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                  <Link
                    key={item.id}
                    href={`/track/${item.id}`}
                    className="group block rounded-3xl overflow-hidden transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      border: '2px solid rgba(2, 195, 151, 0.2)',
                      boxShadow: '0 4px 15px rgba(0, 191, 255, 0.1)',
                    }}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={item.image || '/placeholder-album.png'}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg truncate mb-1" style={{ color: '#076653' }}>
                        {item.name}
                      </h3>
                      <p className="text-sm truncate" style={{ color: '#666' }}>
                        {item.artists}
                      </p>
                      {item.album && (
                        <p className="text-xs truncate mt-1" style={{ color: '#999' }}>
                          {item.album}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🎵</div>
                <p className="text-xl mb-2" style={{ color: '#076653' }}>
                  No songs found for &ldquo;{query}&rdquo;
                </p>
                <p style={{ color: '#999' }}>Try searching with different keywords</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl" style={{ color: '#076653' }}>Start searching for your favorite songs</p>
            <p className="mt-2" style={{ color: '#999' }}>Enter a song name in the search bar above</p>
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      {items.length > 5 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-lg transition-all hover:scale-110"
          style={{
            background: 'linear-gradient(135deg, #02C397, #076653)',
            color: '#ffffff',
            boxShadow: '0 4px 20px rgba(2, 195, 151, 0.4)',
          }}
          title="Scroll to top"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mx-auto">
            <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
