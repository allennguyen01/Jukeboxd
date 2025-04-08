import TextCollapse from './TextCollapse';
import SpotifyIconButton from './icon/SpotifyIconButton';
import spotifyClient from '@/config/spotifyClient';
import { useQuery } from '@tanstack/react-query';

type AlbumCardProps = SpotifyApi.AlbumObjectSimplified;

export default function AlbumCard({ album }: { album: AlbumCardProps }) {
	return (
		<div className='flex max-w-5xl gap-8 border-b-[1px] border-neutral-600 pb-4'>
			<a
				href={`/album/${album.id}`}
				className='flex-shrink-0'
			>
				<img
					src={album.images[0].url}
					alt={`${album.name} album cover`}
					className='size-28 rounded-sm transition duration-150 hover:cursor-pointer hover:shadow-white'
				/>
			</a>

			<div className='flex flex-col gap-3'>
				<h2 className='flex items-baseline gap-2'>
					<a
						href={`/album/${album.id}`}
						className='font-playfair text-xl font-extrabold text-white hover:text-primary-600'
					>
						{album.name}
					</a>
					<p className='font-sans text-lg font-thin text-neutral-content'>
						{new Date(album.release_date).getFullYear()}
					</p>
					<SpotifyIconButton url={album.external_urls.spotify} />
				</h2>

				<section>
					<TracksCollapse albumID={album.id} />
				</section>

				<div className='flex flex-row items-center'>
					<span className='mr-1 font-light'>Performed by </span>
					<span className='flex flex-wrap gap-1'>
						{album.artists.map((artist) => (
							<a
								key={artist.id}
								className='rounded-sm bg-gray-700 px-2 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-300'
								href={`/search/${artist.name}`}
							>
								{artist.name}
							</a>
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
