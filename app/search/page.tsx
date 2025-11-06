import { Suspense } from 'react';
import SearchResultsClient from './SearchResultsClient';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFFDED' }}>
          <div className="text-center">
            <div className="animate-spin mx-auto mb-4" style={{ width: 48, height: 48, border: '4px solid #eee', borderTopColor: '#02C397', borderRadius: '50%' }} />
            <p style={{ color: '#666' }}>Loading search…</p>
          </div>
        </div>
      }
    >
      <SearchResultsClient />
    </Suspense>
  );
}
