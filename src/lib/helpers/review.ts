import { AlbumReview } from '@/types/supabaseTypes';
import { ReviewsSortBy } from '@/pages/Reviews';

// Sort reviews based on selected criteria
function sortReviews(
	reviews: AlbumReview[],
	sortBy: ReviewsSortBy,
): AlbumReview[] {
	switch (sortBy) {
		case 'date-desc':
			return reviews.sort(
				(a, b) =>
					new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
			);
		case 'date-asc':
			return reviews.sort(
				(a, b) =>
					new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
			);
		case 'rating-desc':
			return reviews.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
		case 'rating-asc':
			return reviews.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
		case 'alphabetical':
			return reviews.sort((a, b) => a.album_name.localeCompare(b.album_name));
		default:
			return reviews;
	}
}

export { sortReviews };
