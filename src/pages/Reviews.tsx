import { useAlbum, useAlbumsBySearchQuery } from '@/config/spotifyClient';
import { useReviews } from '@/config/supabaseClient';
import { AlbumReview } from '@/types/supabaseTypes';
import StarRating from '@/components/StarRating';
import CoverLink from '@/components/CoverLink';
import { useQuery } from '@tanstack/react-query';
import HeaderDivider from '@/components/typography/HeaderDivider';
import { WandSparkles, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { reviewsToString } from '@/lib/utils';
import { useEffect, useState } from 'react';
import {
	fetchRecommendations,
	fetchTasteProfile,
	Recommendation,
} from '@/services/recommendationsAI';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export default function Reviews() {
	const { isPending, isError, error, data: reviews } = useReviews();
	const [tasteProfile, setTasteProfile] = useState<string>('');
	const [reviewsString, setReviewsString] = useState<string>('');
	const [triggerRecommendations, setTriggerRecommendations] = useState(false);
	function triggerRecs() {
		setTriggerRecommendations(true);
	}

	if (isPending) return <div>Loading...</div>;
	if (isError) return <div>Error: {error.message}</div>;

	return (
		<div className='flex w-[1024px] flex-col items-center justify-center gap-8 p-4'>
			<div className='flex w-full flex-col gap-1'>
				<HeaderDivider
					text='AI TASTE PROFILE'
					icon={
						<WandSparkles
							color='#ff2350'
							size={32}
						/>
					}
				/>
				<TasteProfile
					setTasteProfile={setTasteProfile}
					setReviewsString={setReviewsString}
				/>
			</div>
			<section className='flex w-full flex-col gap-4'>
				<HeaderDivider text='RECOMMENDATIONS' />
				<div className='flex w-full justify-center'>
					<Button
						className='gap-2 text-base'
						variant='secondary'
						size='lg'
						onClick={triggerRecs}
					>
						<Sparkles color='#ff2350' />
						Get AI album recommendations
					</Button>
				</div>
				{triggerRecommendations && (
					<Recommendations
						tasteProfile={tasteProfile}
						reviewsString={reviewsString}
					/>
				)}
			</section>
			<div className='flex w-full flex-col gap-4'>
				<HeaderDivider text='RECENT REVIEWS' />
				{reviews.map((ar: AlbumReview) => (
					<AlbumReviewCard
						key={ar.id}
						albumReview={ar}
					/>
				))}
			</div>
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

	const { isPending, isError, error, data: album } = useAlbum(id);

	if (isPending) return <div>Loading...</div>;
	if (isError) return <div>Error: {error.message}</div>;

	return (
		<div className='card card-side gap-4 rounded-none border-b-[1px] border-neutral-600 pb-4'>
			<CoverLink
				album={album}
				size={112}
			/>
			<div className='card-body overflow-hidden text-ellipsis p-0'>
				<h2 className='card-title items-baseline font-playfair font-semibold text-white'>
					{albumName}
					<span className='font-sans text-lg font-thin text-neutral-content'>
						{new Date(album.release_date).getFullYear()}
					</span>
				</h2>
				<div className='flex items-center gap-2'>
					<StarRating
						initialRating={rating}
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
				<p className=''>{review}</p>
			</div>
		</div>
	);
}

function TasteProfile({
	setTasteProfile,
	setReviewsString,
}: {
	setTasteProfile: (profile: string) => void;
	setReviewsString: (reviews: string) => void;
}) {
	const { isPending, isError, error, data: reviews } = useReviews();

	if (isPending) return <div>Loading...</div>;
	if (isError) return <div>Error with getting reviews: {error.message}</div>;
	if (reviews.length < 5) {
		return <p>Please make more than 5 reviews.</p>;
	}
	const reviewsToSummarize = reviews
		.sort((a, b) => b.rating - a.rating)
		.slice(0, 5);

	useEffect(() => {
		if (reviewsToSummarize) {
			setReviewsString(reviewsToString(reviewsToSummarize));
		}
	}, [reviewsToSummarize]);

	const {
		isPending: isTastePending,
		isError: isTasteError,
		error: tasteError,
		data: tasteProfile,
	} = useQuery({
		queryKey: ['tasteProfile', reviewsToSummarize],
		queryFn: () => fetchTasteProfile(reviewsToSummarize),
	});

	useEffect(() => {
		if (tasteProfile) {
			setTasteProfile(tasteProfile);
		}
	}, [tasteProfile]);

	if (isTastePending)
		return (
			<div className='mx-auto flex w-full animate-pulse flex-col gap-2'>
				<div className='h-2 rounded bg-gray-200'></div>
				<div className='h-2 rounded bg-gray-200'></div>
				<div className='h-2 rounded bg-gray-200'></div>
				<div className='h-2 rounded bg-gray-200'></div>
				<div className='h-2 w-3/4 rounded bg-gray-200'></div>
			</div>
		);

	if (isTasteError)
		return <div>Error with getting taste profile: {tasteError.message}</div>;

	return (
		<div className='flex flex-col gap-6'>
			<p className='leading-relaxed text-white'>{tasteProfile}</p>
		</div>
	);
}

function Recommendations({
	tasteProfile,
	reviewsString,
}: {
	tasteProfile: string;
	reviewsString: string;
}) {
	const {
		isPending,
		isError,
		error,
		data: recommendations,
	} = useQuery({
		queryKey: ['recommendations'],
		queryFn: () => fetchRecommendations(tasteProfile, reviewsString),
		enabled: !!tasteProfile && !!reviewsString,
	});

	if (isPending)
		return (
			<div className='flex animate-pulse justify-between gap-2'>
				<div className='size-44 rounded bg-gray-200'></div>
				<div className='size-44 rounded bg-gray-200'></div>
				<div className='size-44 rounded bg-gray-200'></div>
				<div className='size-44 rounded bg-gray-200'></div>
				<div className='size-44 rounded bg-gray-200'></div>
			</div>
		);
	if (isError)
		return <div>Error with getting recommendations: {error.message}</div>;

	if (!recommendations.length) {
		return null;
	}

	if (typeof recommendations === 'string') {
		return <p>{recommendations}</p>;
	}

	return (
		<div className='flex w-full justify-between gap-4'>
			{recommendations.map((rec, index) => (
				<AlbumRec
					key={index}
					{...rec}
				/>
			))}
		</div>
	);
}

function AlbumRec(rec: Recommendation) {
	const { album, artist } = rec;
	const query = `album:"${album}" artist:"${artist}"`;
	const {
		isLoading,
		isError,
		error,
		data: albumData,
	} = useAlbumsBySearchQuery(query, 1);

	if (isLoading)
		return <div className='size-44 animate-pulse rounded bg-gray-200'></div>;
	if (isError) return <li>Error: {error.message}</li>;
	if (!albumData) return <li>No album found</li>;

	return (
		<CoverLink
			album={albumData[0]}
			size={176}
		/>
	);
}
