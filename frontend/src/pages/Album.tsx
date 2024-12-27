import SpotifyIconButton from '@/components/icon/SpotifyIconButton';
import spotifyClient from '@/config/spotifyClient';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

type AlbumInfo = SpotifyApi.SingleAlbumResponse;

export default function Album() {
	const { id } = useParams();

	function msToMinAndSec(ms: number) {
		const date = new Date(ms);
		return `${date.getMinutes()}:${date.getSeconds()}`;
	}

	function getAlbum(): Promise<AlbumInfo> {
		return spotifyClient.get(`/albums/${id}`).then((res) => res.data);
	}

	const {
		isPending,
		isError,
		error,
		data: album,
	} = useQuery({ queryKey: ['album', id], queryFn: getAlbum });

	if (isPending) return <div>Loading...</div>;
	if (isError) return <div>Error: {error.message}</div>;

	console.log(album);

	return (
		<div>
			<img
				src={album.images[0].url}
				alt={album.name}
			/>

			<SpotifyIconButton
				size={30}
				url={album.external_urls.spotify}
			/>

			<h1>
				{album.name} {new Date(album.release_date).getFullYear()} Performed by{' '}
				{album.artists.map((artist) => artist.name).join(', ')}
			</h1>

			<p>Label: {album.label}</p>
			<p>Total tracks: {album.total_tracks}</p>
			<p>Type: {album.album_type}</p>
			<p>
				Release date:{' '}
				{new Date(album.release_date).toLocaleDateString(undefined, {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				})}
			</p>

			<h3>Tracks</h3>
			<ol className='list-inside list-decimal'>
				{album.tracks.items.map((track) => (
					<li key={track.id}>
						{track.name} {msToMinAndSec(track.duration_ms)}{' '}
						{track.artists.map((artist) => artist.name).join(', ')}
					</li>
				))}
			</ol>
		</div>
	);
}
