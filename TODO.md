# TODO: Implement Comments for Reviews

## API Routes
- [x] Create `/api/reviews/[id]/comments/route.ts`: GET (list comments with pagination), POST (create comment)
- [x] Create `/api/reviews/[id]/comments/[commentId]/route.ts`: PATCH (edit comment if author), DELETE (delete comment if author)

## Frontend Components
- [x] Create `components/comment/comment-list.tsx`: Display comments for a review, with edit/delete if author
- [x] Create `components/comment/comment-form.tsx`: Form to create new comment
- [x] Update `components/review/review-list.tsx`: Add comments section below each review using CommentList and CommentForm

## Integration and Testing
- [x] Test API routes for CRUD operations on comments
- [x] Ensure authentication and error handling
- [x] Verify frontend integration in review-list.tsx
