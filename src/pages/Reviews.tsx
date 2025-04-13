import { useAlbum } from '@/config/spotifyClient';
import { useReviews } from '@/config/supabaseClient';
import { AlbumReview } from '@/types/supabaseTypes';
import StarRating from '@/components/StarRating';
import CoverLink from '@/components/CoverLink';
import { useQuery } from '@tanstack/react-query';
import HeaderDivider from '@/components/typography/HeaderDivider';
import { WandSparkles } from 'lucide-react';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export default function Reviews() {
	const { isPending, isError, error, data: reviews } = useReviews();

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
				<TasteProfile />
			</div>
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

function TasteProfile() {
	const { isPending, isError, error, data: reviews } = useReviews();

	if (isPending) return <div>Loading...</div>;
	if (isError) return <div>Error with getting reviews: {error.message}</div>;
	if (reviews.length < 5) {
		return <p>Please make more than 5 reviews.</p>;
	}
	const reviewsToSummarize = reviews
		.sort((a, b) => b.rating - a.rating)
		.slice(0, 5);

	const {
		isPending: isTastePending,
		isError: isTasteError,
		error: tasteError,
		data: tasteProfile,
	} = useQuery({
		queryKey: ['tasteProfile', reviewsToSummarize],
		queryFn: () => fetchTasteProfile(reviewsToSummarize),
	});

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

	return <p className='leading-relaxed text-white'>{tasteProfile}</p>;
}

const fetchTasteProfile = async (reviews: AlbumReview[]): Promise<string> => {
	const reviewsString = reviews
		.map((review) => {
			return `Album: ${review.album_name}, Rating: ${review.rating}, Review: ${review.review}`;
		})
		.join('\n');

	const promptTaste = `Below are the reviews and ratings for albums a user has listened to:
${reviewsString}

Please provide a concise summary of the user's musical tastes and preferences, highlighting key genres, moods, and unique characteristics.`;

	const response = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			// TODO: create proxy server to NOT expose API key in production client-side code!
			Authorization: `Bearer ${OPENAI_API_KEY}`,
		},
		body: JSON.stringify({
			model: 'gpt-4', // You may use "gpt-3.5-turbo" if preferred
			messages: [{ role: 'user', content: promptTaste }],
			temperature: 0.5,
			max_tokens: 150,
		}),
	});
	const data = await response.json();
	return data.choices[0].message.content;
};
