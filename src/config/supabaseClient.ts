import { AlbumReview } from '@/types/supabaseTypes';
import { createClient } from '@supabase/supabase-js';
import { useMutation, useQuery } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function useUser() {
	async function getUser() {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		return user;
	}

	return useQuery({
		queryKey: ['user'],
		queryFn: getUser,
	});
}

function useReviews() {
	async function getReviews(): Promise<AlbumReview[]> {
		const { data: reviews, error } = await supabase
			.from('reviews')
			.select()
			.order('created_at', { ascending: false });
		if (error) {
			throw new Error(error.message);
		}
		return reviews;
	}

	return useQuery({
		queryKey: ['reviews'],
		queryFn: getReviews,
	});
}

function useUpsertReview() {
	async function upsertReview(reviewData: Omit<AlbumReview, 'created_at'>) {
		const { data, error } = await supabase
			.from('reviews')
			.upsert([reviewData], { onConflict: 'id, user_id' })
			.select();

		if (error) throw error;

		return data;
	}

	return useMutation({ mutationFn: upsertReview });
}

function useReviewByAlbumId(albumId: string) {
	async function getReviewByAlbumId(): Promise<AlbumReview | null> {
		const { data: review, error } = await supabase
			.from('reviews')
			.select()
			.eq('id', albumId)
			.single();

		if (!review) return null;

		if (error) throw error;

		return review;
	}

	return useQuery({
		queryKey: ['reviews', albumId],
		queryFn: getReviewByAlbumId,
	});
}

export default supabase;
export { useUser, useReviews, useUpsertReview, useReviewByAlbumId };
