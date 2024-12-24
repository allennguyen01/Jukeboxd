import { useEffect, useState } from 'react';
import spotifyClient from '../config/spotifyClient';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import SpotifyIconButton from '@/components/icon/SpotifyIconButton';
import HeaderDivider from '@/components/typography/HeaderDivider';

type NewAlbumCards = {
	id: string;
	images: { url: string }[];
	name: string;
	artists: { name: string }[];
	release_date: string;
	external_urls: { spotify: string };
	album_type: string;
};

type Album = { album: { id: string; album_type: string } };

export default function Home() {
	const [newAlbums, setNewAlbums] = useState<NewAlbumCards[]>([]);
	const [hiphopAlbums, setHipHopAlbums] = useState<NewAlbumCards[]>([]);
	const [rbAlbums, setRBAlbums] = useState<NewAlbumCards[]>([]);

	function filter20Albums(items: Album[]) {
		const itemAlbums = items.map((item: any) => item.album);
		const seen = new Set();
		const itemsFiltered = itemAlbums.filter((album: NewAlbumCards) => {
			const duplicate = seen.has(album.id);
			seen.add(album.id);
			return !duplicate && album.album_type === 'album';
		});
		return itemsFiltered.slice(0, 20);
	}

	useEffect(() => {
		async function getAlbums() {
			const response = await spotifyClient.get('/browse/new-releases?limit=20');
			setNewAlbums(response.data.albums.items);
		}
		getAlbums();
	}, []);

	// TODO: remove duplicate albums appearing, check ID
	useEffect(() => {
		async function getGenreAlbums() {
			const response = await spotifyClient.get(
				'search?q=genre%3A%22hip+hop%22+year%3A2024&type=track&market=US&limit=50',
			);
			setHipHopAlbums(filter20Albums(response.data.tracks.items));
		}
		getGenreAlbums();
	}, []);

	// TODO: remove duplicate albums appearing, check ID
	useEffect(() => {
		async function getGenreAlbums() {
			const response = await spotifyClient.get(
				'search?q=genre%3A%22r%26b%22+year%3A2024&type=track&market=US&limit=50',
			);
			setRBAlbums(filter20Albums(response.data.tracks.items));
		}
		getGenreAlbums();
	}, []);

	return (
		<div className='p-4'>
			<HeaderDivider
				text='NEW ALBUM RELEASES'
				className='mx-3 mb-2'
			/>
			<FourAlbumCarousel newAlbums={newAlbums} />
			<HeaderDivider
				text='HIP HOP ALBUMS'
				className='mx-3 mb-2'
			/>
			<FourAlbumCarousel newAlbums={hiphopAlbums} />
			<HeaderDivider
				text='R&B ALBUMS'
				className='mx-3 mb-2'
			/>
			<FourAlbumCarousel newAlbums={rbAlbums} />
		</div>
	);
}

function FourAlbumCarousel({ newAlbums }: { newAlbums: NewAlbumCards[] }) {
	return (
		<Carousel
			className='min-h-96 w-full max-w-5xl'
			opts={{ slidesToScroll: 4 }}
		>
			<CarouselContent>
				{newAlbums.map((album: NewAlbumCards) => (
					<CarouselItem
						key={album.id}
						className='flex basis-1/4 flex-col items-center gap-2 py-1 text-center'
					>
						<img
							src={album.images[0].url}
							alt={album.name}
							className='box-border h-56 max-w-56 rounded transition duration-150 hover:cursor-pointer hover:shadow-white'
						/>
						<div className='flex max-w-56 flex-col'>
							<span className='inline-flex items-center gap-1 font-semibold'>
								{album.name}
								<SpotifyIconButton spotifyURL={album.external_urls.spotify} />
							</span>
							<p className='text-sm'>
								{album.artists.map((artist) => artist.name).join(', ')}
							</p>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
}
