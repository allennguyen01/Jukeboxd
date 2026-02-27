import { useAlbum } from '@/config/spotifyClient';
import CoverLink, { CoverLinkSkeletons } from '@/components/CoverLink';
import { AlbumReview } from '@/types/supabaseTypes';
import { FileText } from 'lucide-react';
import StarRating from '@/components/StarRating';
import { themeBrand } from '@/config/theme';

export default function RecentActivityCard({
	review,
}: {
	review: AlbumReview;
}) {
	const { album_id: albumId, rating, review: reviewText } = review;

	const { isPending, isError, error, data: album } = useAlbum(albumId);

	if (isPending) return <CoverLinkSkeletons />;
	if (isError) return <div>Error: {error.message}</div>;

	return (
		<div className='flex flex-col gap-1'>
			<CoverLink album={album} />
			<div className='hidden h-full items-center gap-2 sm:flex'>
				{rating && (
					<StarRating
						initialRating={rating}
						readOnly
						color={themeBrand.secondary}
						size='sm'
					/>
				)}
				{reviewText && (
					<FileText
						size={16}
						color='lightgray'
					/>
				)}
			</div>
		</div>
	);
}
