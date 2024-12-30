import { createClient } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function useUser() {
	async function getUser() {
		const { data: user, error } = await supabase.auth.getUser();
		if (error) {
			throw new Error(error.message);
		}
		return user;
	}

	return useQuery({
		queryKey: ['user'],
		queryFn: getUser,
		staleTime: 1000 * 60 * 5,
		retry: false,
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

export default supabase;
export { useUser, useReviews };
