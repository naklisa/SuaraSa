# TODO: Perbaikan Sistem Like/Dislike

## Schema Prisma
- [x] Tambah field `dislikes` di model Review (default 0)
- [x] Buat model Dislike mirip dengan Like (userId, reviewId, createdAt, unique constraint)
- [x] Update relasi User untuk dislikes
- [x] Generate dan push schema ke database

## API Routes
- [x] Buat `/api/reviews/[id]/dislike/route.ts` untuk POST/DELETE dislike
- [x] Periksa dan perbaiki route like jika perlu
- [x] Pastikan transaction untuk consistency counter

## Frontend Components
- [x] Buat `components/review/like-dislike-buttons.tsx` component reusable
- [x] Update `components/home/featured-review.tsx` untuk connect ke API
- [x] Update `components/review/review-list.tsx` untuk tambah like/dislike buttons
- [x] Tampilkan total likes/dislikes counter di UI

## Testing
- [ ] Test API routes like/dislike
- [ ] Test frontend integration
- [ ] Test counter updates
