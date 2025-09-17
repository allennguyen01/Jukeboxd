import { AlbumReview, UserProfile } from '@/types/supabaseTypes';
import { createClient } from '@supabase/supabase-js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UseQueryResult, useQueryClient } from '@tanstack/react-query';
import { getSpotifyAlbum } from './spotifyClient';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function useUser() {
	async function getUser() {
		const {
			error,
			data: { user },
		} = await supabase.auth.getUser();

		if (error) throw error;

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

function useRecentReviewsByUserId(userId: string, limit: number = 4) {
	async function getRecentReviewsByUserId(): Promise<AlbumReview[]> {
		const { data: reviews, error } = await supabase
			.from('reviews')
			.select()
			.eq('user_id', userId)
			.order('created_at', { ascending: false })
			.limit(limit);

		if (error) throw error;

		return reviews;
	}

	return useQuery({
		queryKey: ['recent_reviews', userId, limit],
		queryFn: getRecentReviewsByUserId,
		enabled: !!userId,
	});
}

// Profile hooks

function useProfileInfo() {
	const { data: user } = useUser();

	async function getProfileInfo() {
		if (!user?.id) throw new Error('User not authenticated');

		const { data: profile, error } = await supabase
			.from('profiles')
			.select()
			.eq('id', user.id)
			.limit(1)
			.single();

		if (error) throw error;

		return profile;
	}

	return useQuery({
		queryKey: ['profile', user?.id],
		queryFn: getProfileInfo,
		enabled: !!user?.id, // Only run the query when user ID is available
	});
}

function useProfileInfoByUsername(username: string) {
	async function getProfileInfoByUsername() {
		const { data: profile, error } = await supabase
			.from('profiles')
			.select()
			.eq('username', username)
			.limit(1)
			.single();

		if (error) throw error;

		return profile;
	}

	return useQuery({
		queryKey: ['profile', username],
		queryFn: getProfileInfoByUsername,
		enabled: !!username, // Only run the query when username is available
	});
}

function useUpsertProfile() {
	async function upsertProfile(profileData: Omit<UserProfile, 'created_at'>) {
		const { data, error } = await supabase
			.from('profiles')
			.upsert([profileData], { onConflict: 'id' })
			.select();

		if (error) throw error;

		return data;
	}

	return useMutation({ mutationFn: upsertProfile });
}

// Favorite Albums hooks

function useFavoriteAlbumsByUsername(
	username: string,
): UseQueryResult<SpotifyApi.SingleAlbumResponse[]> {
	async function getFavoriteAlbumsByUsername() {
		const { data: favAlbums, error } = await supabase
			.from('profiles')
			.select(
				`
				four_favorites(
					album_id
				)
			`,
			)
			.eq('username', username)
			.single();

		if (error) throw error;

		const fourFavAlbums = favAlbums.four_favorites;

		const albumPromises = fourFavAlbums.map((album: { album_id: string }) =>
			getSpotifyAlbum(album.album_id),
		);

		return Promise.all(albumPromises);
	}

	return useQuery({
		queryKey: ['four_favorites', username],
		queryFn: getFavoriteAlbumsByUsername,
	});
}

function useFavoriteAlbumByRank(
	rank: number,
): UseQueryResult<SpotifyApi.SingleAlbumResponse> {
	const { data: user } = useUser();

	async function getFavoriteAlbumByRank() {
		if (!user) throw new Error('User not authenticated');

		const { data: album, error } = await supabase
			.from('four_favorites')
			.select()
			.eq('user_id', user.id)
			.eq('rank', rank)
			.maybeSingle();

		if (error) throw error;

		return getSpotifyAlbum(album.album_id);
	}

	return useQuery({
		queryKey: ['four_favorites', user?.id, rank],
		queryFn: getFavoriteAlbumByRank,
		enabled: !!user?.id,
	});
}

function useUpsertFavorite() {
	const { data: user } = useUser();
	const queryClient = useQueryClient();

	async function upsertFavorite(albumData: { album_id: string; rank: number }) {
		if (!user) throw new Error('User not authenticated');

		const { data, error } = await supabase
			.from('four_favorites')
			.upsert([{ ...albumData, user_id: user.id }], {
				onConflict: 'user_id, rank',
			})
			.select();

		if (error) throw error;

		return data;
	}

	return useMutation({
		mutationFn: upsertFavorite,
		onSuccess: () => {
			// Invalidate query so that the updated favorite album is refetched
			queryClient.invalidateQueries({ queryKey: ['four_favorites', user?.id] });
		},
	});
}

export default supabase;
export {
	useUser,
	useReviews,
	useReviewByAlbumId,
	useRecentReviewsByUserId,
	useProfileInfo,
	useProfileInfoByUsername,
	useFavoriteAlbumsByUsername,
	useFavoriteAlbumByRank,
	useUpsertReview,
	useUpsertFavorite,
	useUpsertProfile,
};
