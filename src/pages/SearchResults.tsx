import AlbumCard from '../components/AlbumCard.jsx';
import { useParams } from 'react-router-dom';
import HeaderDivider from '@/components/typography/HeaderDivider.js';
import { useSearchAlbums } from '../config/spotifyClient';

export default function SearchResults() {
	const { searchInput = '' } = useParams();

	const {
		isPending,
		isError,
		error,
		data: albumSearch,
	} = useSearchAlbums(searchInput);

	if (isPending) return <div className='px-3 sm:px-6'>Loading...</div>;
	if (isError)
		return <div className='px-3 sm:px-6'>Error: {error.message}</div>;

	return (
		<div className='flex w-full max-w-5xl flex-col items-center justify-start px-1 sm:px-6'>
			<HeaderDivider
				text={`FOUND ${albumSearch.length} ALBUMS MATCHING "${searchInput.toUpperCase()}"`}
				className='mb-3 w-full sm:mb-4'
			/>

			<div className='flex w-full flex-col gap-3 sm:gap-4'>
				{albumSearch.map((album: SpotifyApi.AlbumObjectSimplified) => {
					return (
						<AlbumCard
							key={album.id}
							album={album}
						/>
					);
				})}
			</div>
		</div>
	);
}
