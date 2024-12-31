import { useAlbum } from '@/config/spotifyClient';
import { useReviews } from '../config/supabaseClient';
import ReviewRatingStars from '@/components/ReviewRatingStars';
import { AlbumReview } from '@/types/supabaseTypes';

export default function Reviews() {
	const { isPending, isError, error, data: reviews } = useReviews();

	if (isPending) return <div>Loading...</div>;
	if (isError) return <div>Error: {error.message}</div>;

	return (
		<div className='flex flex-col items-center justify-center p-4'>
			<div className='flex w-[1024px] flex-col gap-4'>
				{reviews.map((ar: AlbumReview) => (
					<AlbumReviewCard
						key={ar.id}
						albumID={ar.id}
						albumName={ar.album_name}
						createDate={ar.created_at}
						rating={ar.rating}
						review={ar.review}
					/>
				))}
			</div>
		</div>
	);
}

type AlbumReviewCardProps = {
	albumID: string;
	albumName: string;
	createDate: Date;
	rating: number;
	review: string;
};

function AlbumReviewCard({
	albumID,
	albumName,
	createDate,
	rating,
	review,
}: AlbumReviewCardProps) {
	const { isPending, isError, error, data: album } = useAlbum(albumID);

	if (isPending) return <div>Loading...</div>;
	if (isError) return <div>Error: {error.message}</div>;

	return (
		<div className='card card-side gap-4 rounded-none border-b-[1px] border-neutral-600 pb-4'>
			<figure className='flex-none self-start'>
				<img
					src={album.images[0].url}
					alt={`${albumName} album cover`}
					className='size-28 rounded-sm'
				/>
			</figure>
			<div className='card-body overflow-hidden text-ellipsis p-0'>
				<h2 className='card-title items-baseline font-semibold text-white'>
					{albumName}
					<span className='font-sans text-lg font-thin text-neutral-content'>
						{new Date(album.release_date).getFullYear()}
					</span>
				</h2>

				<div className='flex items-center gap-2'>
					<ReviewRatingStars
						readOnly={true}
						rating={rating}
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
