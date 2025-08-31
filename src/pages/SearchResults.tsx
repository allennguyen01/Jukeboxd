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

	if (isPending) return <div>Loading...</div>;
	if (isError) return <div>Error: {error.message}</div>;

	return (
		<div className='flex max-w-5xl flex-col items-center justify-start'>
			<HeaderDivider
				text={`FOUND ${albumSearch.length} ALBUMS MATCHING "${searchInput.toUpperCase()}"`}
				className='mb-4 w-full'
			/>

			<div className='flex flex-col gap-4'>
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
