import AlbumCard from '../components/AlbumCard.jsx';
import { useParams } from 'react-router-dom';
import spotifyClient from '../config/spotifyClient';
import HeaderDivider from '@/components/typography/HeaderDivider.js';
import { useQuery } from '@tanstack/react-query';

export default function SearchResults() {
	const { searchInput = '' } = useParams();

	async function search() {
		return spotifyClient
			.get(`https://api.spotify.com/v1/search?type=album&q=${searchInput}`)
			.then((res) =>
				res.data.albums.items.filter(
					(item: { album_type: string }) => item.album_type === 'album',
				),
			);
	}

	const {
		isPending,
		isError,
		error,
		data: albumSearch,
	} = useQuery({
		queryKey: ['search', searchInput],
		queryFn: search,
	});

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
