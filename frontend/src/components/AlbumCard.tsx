import ReviewModalForm from './ReviewModalForm';
import { FaSpotify } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ISO3166ToString from '../data/ISO3166-1.alpha-2';
import TextCollapse from './TextCollapse';
import SpotifyIconButton from './icon/SpotifyIconButton';

type AlbumCardProps = {
	id: string;
	name: string;
	artists: { id: string; name: string }[];
	images: { url: string }[];
	release_date: string;
	available_markets: string[];
	external_urls: { spotify: string };
};

export default function AlbumCard({ album }: { album: AlbumCardProps }) {
	const id = album.id;
	const name = album.name;
	const artists = album.artists;
	const coverURL = album.images[0].url;
	const releaseYear = new Date(album.release_date).getFullYear();
	const albumAvailableMarkets = album.available_markets
		.map((album) => {
			return ISO3166ToString[album.toUpperCase()];
		})
		.join(', ');
	const spotifyURL = album.external_urls.spotify;

	const navigate = useNavigate();

	return (
		<div>
			<div
				className='card card-side rounded-none border-b-[1px] border-neutral-600 pb-4 hover:cursor-pointer'
				onClick={() =>
					(
						document.getElementById(`review-modal-${name}`) as HTMLDialogElement
					).showModal()
				}
			>
				<img
					src={coverURL}
					alt={`${name} album cover`}
					className='h-28 w-28 rounded-sm'
				/>
				<div className='card-body py-0'>
					<h2 className='card-title font-semibold text-white'>
						{name}
						<span className='font-sans font-thin text-neutral-content'>
							{releaseYear}
						</span>

						<SpotifyIconButton url={spotifyURL} />
					</h2>

					<TextCollapse text={`Available in: ${albumAvailableMarkets}`} />

					<div className='flex flex-row items-center'>
						<span className='mr-1 font-thin'>Performed by </span>
						<div className='flex gap-1'>
							{artists.map((artist) => (
								<button
									key={artist.id}
									className='btn btn-neutral btn-xs rounded-sm px-1 py-0'
									onClick={(e) => {
										e.stopPropagation();
										navigate(`/search/${artist.name}`);
									}}
								>
									{artist.name}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>

			<ReviewModalForm
				id={id}
				name={name}
				coverURL={coverURL}
				year={releaseYear}
			/>
		</div>
	);
}
