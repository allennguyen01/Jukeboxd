import { useState } from 'react';
import { useAlbum } from '@/config/spotifyClient';
import { useReviews, useUser } from '@/config/supabaseClient';
import { AlbumReview } from '@/types/supabaseTypes';
import StarRating from '@/components/StarRating';
import CoverLink from '@/components/CoverLink';
import { SearchSlash, UserSearch } from 'lucide-react';
import { sortReviews } from '@/lib/helpers/review';
import SearchBox from '@/components/common/SearchBox';

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

	if (isPendingReview || isPendingUser)
		return (
			<div className='flex w-full max-w-5xl flex-col items-center justify-center px-4 py-6 sm:p-4'>
				<AlbumReviewCardSkeletons number={3} />
			</div>
		);
	if (isErrorUser) return <div>Error: {userError.message}</div>;
	if (isErrorReview) return <div>Error: {errorReview.message}</div>;

	if (!user)
		return (
			<div className='flex w-full max-w-5xl flex-col items-center justify-center px-4 py-6 sm:p-4'>
				<div className='my-6 flex flex-col items-center gap-2 text-center sm:my-8 sm:flex-row sm:text-left'>
					<UserSearch size={50} />
					<span className='text-base sm:text-lg'>
						Please sign in to view your reviews.
					</span>
				</div>
				<AlbumReviewCardSkeletons number={2} />
			</div>
		);

	if (!reviews || reviews.length === 0)
		return (
			<div className='flex w-full max-w-5xl flex-col items-center justify-center gap-8 px-4 py-6 sm:p-4'>
				<div className='mt-4 flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left'>
					<SearchSlash
						size={30}
						className='shrink-0'
					/>
					<span className='text-base sm:text-lg'>
						No reviews found, make your first review by searching in the search
						bar!
					</span>
				</div>
				<SearchBox />
			</div>
		);

	const sortedReviews = sortReviews(reviews, sortBy);

	return (
		<div className='flex w-full max-w-5xl flex-col items-center justify-center px-4 py-6 sm:p-4'>
			<div className='flex w-full flex-col'>
				<div className='flex items-center justify-between'>
					<h1 className='text-base font-semibold text-slate-200 sm:text-lg'>
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
			<p className='shrink-0 text-sm text-slate-400'>Sort by:</p>
			<Select
				defaultValue='date-desc'
				onValueChange={setSortBy}
			>
				<SelectTrigger className='w-36 min-w-0 sm:w-3xs'>
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
		album_id: albumId,
		album_name: albumName,
		created_at: createDate,
		rating,
		review,
	} = albumReview;

	const initialRating = rating ?? 0;

	const { isPending, isError, error, data: album } = useAlbum(albumId);

	if (isPending) return <AlbumReviewCardSkeletons number={1} />;
	if (isError) return <div>Error: {error.message}</div>;

	return (
		<div className='flex flex-row gap-3 border-b-2 border-slate-600 pb-4 text-slate-300 sm:gap-4'>
			<CoverLink
				album={album}
				size={112}
				className='size-24 shrink-0 sm:size-28'
			/>
			<div className='flex flex-col gap-3 overflow-hidden p-0 text-ellipsis'>
				<h2 className='flex flex-wrap items-baseline gap-2'>
					<span className='text-lg font-semibold text-white sm:text-xl'>
						{albumName}
					</span>
					<span className='font-sans text-base font-thin sm:text-lg'>
						{new Date(album.release_date).getFullYear()}
					</span>
				</h2>
				<div className='flex flex-wrap items-center gap-2'>
					<StarRating
						initialRating={initialRating}
						size='md'
						readOnly
					/>
					<p className='text-xs sm:text-sm'>
						Reviewed on{' '}
						{new Date(createDate).toLocaleDateString(undefined, {
							year: 'numeric',
							month: 'short',
							day: 'numeric',
						})}
					</p>
				</div>
				<p className='text-sm sm:text-base'>{review}</p>
			</div>
		</div>
	);
}

function AlbumReviewCardSkeletons({ number = 3 }: { number?: number }) {
	return (
		<div className='flex w-full flex-col gap-4'>
			{Array.from({ length: number }).map((_, i) => (
				<div
					key={i}
					className='flex w-full flex-row gap-3 border-b border-slate-600 pb-4 sm:gap-4'
				>
					<div className='h-24 w-24 shrink-0 animate-pulse rounded bg-slate-700 sm:h-28 sm:w-28' />
					<div className='flex w-full min-w-0 flex-col gap-3 p-0'>
						<div className='h-6 w-3/4 animate-pulse rounded bg-slate-700 sm:h-12 sm:w-1/2' />
						<div className='h-4 w-1/2 animate-pulse rounded bg-slate-700 sm:h-8 sm:w-1/3' />
						<div className='h-12 w-full animate-pulse rounded bg-slate-700 sm:h-full' />
					</div>
				</div>
			))}
		</div>
	);
}
