import { useState } from 'react';
import { useAlbum } from '@/config/spotifyClient';
import { useReviews, useUser } from '@/config/supabaseClient';
import { AlbumReview } from '@/types/supabaseTypes';
import StarRating from '@/components/StarRating';
import CoverLink from '@/components/CoverLink';
import { SearchSlash, UserSearch } from 'lucide-react';
import { sortReviews } from '@/lib/helpers/review';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

export type ReviewsSortBy =
	| 'date-desc'
	| 'date-asc'
	| 'rating-desc'
	| 'rating-asc'
	| 'alphabetical';

export default function Reviews() {
	const {
		isPending: isPendingUser,
		isError: isErrorUser,
		error: userError,
		data: user,
	} = useUser();
	const {
		isPending: isPendingReview,
		isError: isErrorReview,
		error: errorReview,
		data: reviews,
	} = useReviews();

	const [sortBy, setSortBy] = useState<ReviewsSortBy>('date-desc');

	if (isPendingReview || isPendingUser) return <div>Loading...</div>;
	if (isErrorUser) return <div>Error: {userError.message}</div>;
	if (isErrorReview) return <div>Error: {errorReview.message}</div>;

	if (!user)
		return (
			<div className='flex w-[1024px] flex-col items-center justify-center p-4'>
				<div className='my-8 flex items-center gap-2'>
					<UserSearch size={30} />
					<span className='text-lg'>Please sign in to view your reviews.</span>
				</div>
				<AlbumReviewCardSkeletons number={1} />
			</div>
		);

	if (!reviews || reviews.length === 0)
		return (
			<div className='flex w-[1024px] flex-col items-center justify-center p-4'>
				<div className='my-8 flex items-center gap-2'>
					<SearchSlash size={30} />
					<span className='text-lg'>
						No reviews found, make your first review by searching in the search
						bar!
					</span>
				</div>
				<AlbumReviewCardSkeletons />
			</div>
		);

	const sortedReviews = sortReviews(reviews, sortBy);

	return (
		<div className='flex w-5xl flex-col items-center justify-center p-4'>
			<div className='flex w-full flex-col'>
				<div className='flex items-center justify-between'>
					<h1 className='text-lg font-semibold text-slate-200'>
						REVIEWS <span className='text-slate-400'>({reviews.length})</span>
					</h1>
					<SortByDropdown setSortBy={setSortBy} />
				</div>
				<hr className='mt-2 mb-4 border border-slate-400' />
			</div>
			<div className='flex w-full flex-col gap-4'>
				{sortedReviews.map((ar: AlbumReview) => (
					<AlbumReviewCard
						key={ar.id}
						albumReview={ar}
					/>
				))}
			</div>
		</div>
	);
}

function SortByDropdown({
	setSortBy,
}: {
	setSortBy: (value: ReviewsSortBy) => void;
}) {
	return (
		<div className='flex items-center gap-2'>
			<p className='text-sm text-neutral-400'>Sort by:</p>
			<Select
				defaultValue='date-desc'
				onValueChange={setSortBy}
			>
				<SelectTrigger className='w-[180px]'>
					<SelectValue placeholder='Theme' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='date-desc'>Newest first</SelectItem>
					<SelectItem value='date-asc'>Oldest first</SelectItem>
					<SelectItem value='rating-desc'>Highest rated</SelectItem>
					<SelectItem value='rating-asc'>Lowest rated</SelectItem>
					<SelectItem value='alphabetical'>A → Z</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}

function AlbumReviewCard({ albumReview }: { albumReview: AlbumReview }) {
	const {
		id,
		album_name: albumName,
		created_at: createDate,
		rating,
		review,
	} = albumReview;

	const initialRating = rating ?? 0;

	const { isPending, isError, error, data: album } = useAlbum(id);

	if (isPending) return <AlbumReviewCardSkeletons number={1} />;
	if (isError) return <div>Error: {error.message}</div>;

	return (
		<div className='flex gap-4 border-b-2 border-neutral-600 pb-4 text-slate-300'>
			<CoverLink
				album={album}
				size={112}
			/>
			<div className='flex flex-col gap-3 overflow-hidden p-0 text-ellipsis'>
				<h2 className='flex items-baseline gap-2'>
					<span className='text-xl font-semibold text-white'>{albumName}</span>
					<span className='font-sans text-lg font-thin'>
						{new Date(album.release_date).getFullYear()}
					</span>
				</h2>
				<div className='flex items-center gap-2'>
					<StarRating
						initialRating={initialRating}
						size='md'
						readOnly
					/>
					<p className='text-sm'>
						Reviewed on{' '}
						{new Date(createDate).toLocaleDateString(undefined, {
							year: 'numeric',
							month: 'short',
							day: 'numeric',
						})}
					</p>
				</div>
				<p>{review}</p>
			</div>
		</div>
	);
}

function AlbumReviewCardSkeletons({ number = 3 }: { number?: number }) {
	return (
		<>
			{Array.from({ length: number }).map((_, i) => (
				<div
					key={i}
					className='flex w-full gap-4 border-b border-neutral-600 pb-4'
				>
					<div className='h-28 w-28 shrink-0 animate-pulse rounded bg-slate-700' />
					<div className='flex w-full flex-col gap-3 p-0'>
						<div className='h-12 w-1/2 animate-pulse rounded bg-slate-700' />
						<div className='h-8 w-1/3 animate-pulse rounded bg-slate-700' />
						<p className='h-full w-full animate-pulse rounded bg-slate-700' />
					</div>
				</div>
			))}
		</>
	);
}
