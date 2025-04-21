import { useQuery } from '@tanstack/react-query';
import spotifyClient, { useAlbumsBySearchQuery } from '../config/spotifyClient';

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import SpotifyIconButton from '@/components/icon/SpotifyIconButton';
import HeaderDivider from '@/components/typography/HeaderDivider';
import CoverLink from '@/components/CoverLink';

export default function Home() {
	return (
		<div className='m-4'>
			<NewAlbumReleases />
			<BrowseAlbumCarousel />
		</div>
	);
}

function BrowseAlbumCarousel() {
	const {
		isPending,
		isError,
		error,
		data: albums,
	} = useAlbumsBySearchQuery('genre:"hip hop"', 20);

	if (isPending) {
		return <p>Loading albums...</p>;
	}

	if (isError) {
		return <p>Error loading hip hop albums: {error.message}</p>;
	}

	return (
		<>
			<HeaderDivider
				text='HIP HOP ALBUMS'
				className='mx-3 mb-2'
			/>
			<FourAlbumCarousel newAlbums={albums} />
		</>
	);
}

function NewAlbumReleases() {
	function filterNewAlbums(data: SpotifyApi.ListOfNewReleasesResponse) {
		const newAlbums = data.albums.items;
		const itemsFiltered = newAlbums.filter(
			(album) => album.album_type === 'album',
		);
		return itemsFiltered.slice(0, 20);
	}

	function getNewAlbums() {
		return spotifyClient
			.get('/browse/new-releases?limit=50')
			.then((res) => filterNewAlbums(res.data));
	}

	const {
		isPending,
		isError,
		error,
		data: newAlbums,
	} = useQuery({
		queryKey: ['newAlbums'],
		queryFn: getNewAlbums,
	});

	if (isPending) {
		return <p>Loading albums...</p>;
	}
	if (isError) {
		return <p>Error loading new albums: {error.message}</p>;
	}

	return (
		<>
			<HeaderDivider
				text='NEW ALBUM RELEASES'
				className='mx-3 mb-2'
			/>
			<FourAlbumCarousel newAlbums={newAlbums} />
		</>
	);
}

function FourAlbumCarousel({
	newAlbums,
}: {
	newAlbums: SpotifyApi.AlbumObjectSimplified[];
}) {
	return (
		<Carousel
			className='mb-10 w-full max-w-5xl'
			opts={{ slidesToScroll: 4 }}
		>
			<CarouselContent className='max-h-80'>
				{newAlbums.map((album) => (
					<CarouselItem
						key={album.id}
						className='flex basis-1/4 flex-col items-center gap-2 py-1 text-center'
					>
						<CoverLink album={album} />
						<div className='inline-flex max-w-56 flex-col overflow-hidden'>
							<span className='inline-flex gap-1 overflow-hidden font-semibold'>
								<p className='line-clamp-2'>{album.name}</p>
								<SpotifyIconButton
									url={album.external_urls.spotify}
									className='size-4 h-6'
								/>
							</span>
							<p className='line-clamp-1 text-sm'>
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
