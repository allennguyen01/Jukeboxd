import { useAlbum } from '@/config/spotifyClient';
import { useReviews } from '@/config/supabaseClient';
import { AlbumReview } from '@/types/supabaseTypes';
import StarRating from '@/components/StarRating';
import CoverLink from '@/components/CoverLink';

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
				<h2 className='card-title items-baseline font-semibold text-white'>
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
