import { AlbumReview } from '@/types/supabaseTypes';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function reviewsToString(reviews: AlbumReview[]): string {
	return reviews
		.map((review) => {
			return `Album: ${review.album_name}, Rating: ${review.rating}, Review: ${review.review}`;
		})
		.join('\n');
}
