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
	async function getReviews() {
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

function addReview(
	albumReview: Pick<AlbumReview, 'id' | 'album_name' | 'rating' | 'review'>,
) {
	async function insertReview() {
		const { data, error } = await supabase
			.from('reviews')
			.insert([albumReview])
			.select();

		if (error) {
			throw error;
		}

		return data;
	}

	return useMutation({ mutationFn: insertReview });
}

export default supabase;
export { useUser, useReviews, addReview };
