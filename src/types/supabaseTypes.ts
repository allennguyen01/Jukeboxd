import { Database } from './supabase';

export type AlbumReview = Database['public']['Tables']['reviews']['Row'];

export type AlbumReviewInsert =
	Database['public']['Tables']['reviews']['Insert'];

export type UserProfile = Database['public']['Tables']['profiles']['Row'];
