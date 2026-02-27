import { useQuery } from '@tanstack/react-query';

import CoverLink from '@/components/CoverLink';
import TextCollapse from '@/components/TextCollapse';
import SpotifyIconButton from './icon/SpotifyIconButton';
import spotifyClient from '@/config/spotifyClient';
import ArtistTag from './common/ArtistTag';

type AlbumCardProps = SpotifyApi.AlbumObjectSimplified;

export default function AlbumCard({ album }: { album: AlbumCardProps }) {
	return (
		<div className='flex max-w-5xl gap-4 border-b border-neutral-600 pb-3 sm:gap-8 sm:pb-4'>
			<CoverLink
				album={album}
				size={144}
				className='h-24 w-24 shrink-0 sm:h-36 sm:w-36'
			/>
			<div className='flex min-w-0 flex-1 flex-col gap-2 sm:gap-3'>
				<div className='flex flex-col items-baseline gap-2 sm:flex-row'>
					<a
						href={`/album/${album.id}`}
						className='font-playfair hover:text-primary-600 text-base font-extrabold text-white sm:text-xl'
					>
						{album.name}
					</a>
					<div className='flex flex-row items-center gap-2'>
						<p className='text-neutral-content font-sans text-sm font-thin sm:text-lg'>
							{new Date(album.release_date).getFullYear()}
						</p>
						<SpotifyIconButton url={album.external_urls.spotify} />
					</div>
				</div>

				<section>
					<TracksCollapse albumID={album.id} />
				</section>

				<div className='flex flex-row flex-wrap items-center gap-x-1'>
					<span className='text-xs sm:text-base'>Performed by </span>
					<span className='flex flex-wrap gap-1'>
						{album.artists.map((artist) => (
							<ArtistTag artist={artist} />
						))}
					</span>
				</div>
			</div>
		</div>
	);
}

function TracksCollapse({ albumID }: { albumID: string }) {
	function getTracks() {
		return spotifyClient
			.get(`albums/${albumID}`)
			.then((res) => res.data.tracks.items);
	}

	const {
		isPending,
		isError,
		error,
		data: tracks,
	} = useQuery<SpotifyApi.TrackObjectSimplified[]>({
		queryKey: ['tracks', albumID],
		queryFn: getTracks,
	});

	if (isPending) return <div>Tracks: loading...</div>;
	if (isError) return <div>Tracks: error ({error.message})</div>;

	const trackNames = tracks.map((track) => track.name).join(', ');

	return <TextCollapse text={`Tracks: ${trackNames}`} />;
}
