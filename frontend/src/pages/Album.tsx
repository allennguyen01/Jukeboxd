import SpotifyIconButton from '@/components/icon/SpotifyIconButton';
import spotifyClient from '@/config/spotifyClient';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Clock } from 'lucide-react';
import { reduce } from 'lodash';

type AlbumInfo = SpotifyApi.SingleAlbumResponse;

export default function Album() {
	const { id } = useParams();

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

			<TracksTable tracks={album.tracks.items} />
		</div>
	);
}

function TracksTable({
	tracks,
}: {
	tracks: SpotifyApi.TrackObjectSimplified[];
}) {
	function msToMinAndSec(ms: number) {
		const date = new Date(ms);
		return `${date.getMinutes()}:${date.getSeconds() < 10 ? `${'0' + date.getSeconds()}` : date.getSeconds()}`;
	}

	return (
		<Table>
			<TableHeader>
				<TableRow className='border-neutral-600'>
					<TableHead>#</TableHead>
					<TableHead>Title</TableHead>
					<TableHead>Artist</TableHead>
					<TableHead className='flex items-center justify-end'>
						<Clock size={16} />
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{tracks.map((track) => (
					<TableRow
						key={track.id}
						className='border-0'
					>
						<TableCell>{track.track_number}</TableCell>
						<TableCell className='text-white'>{track.name}</TableCell>
						<TableCell>
							{track.artists.map((artist) => artist.name).join(', ')}
						</TableCell>
						<TableCell className='text-right'>
							{msToMinAndSec(track.duration_ms)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
