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
import CoverLink, { CoverLinkSkeletons } from '@/components/CoverLink';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { cn, decadeToRange } from '@/lib/utils';
import { useState } from 'react';

export default function Home() {
	return (
		<div className='m-4'>
			<BrowseAlbums />
			<NewAlbumReleases />
		</div>
	);
}

const availableGenres = [
	'classical',
	'country',
	'electronic',
	'folk',
	'indie',
	'hip-hop',
	'jazz',
	'pop',
	'rock',
	'r&b',
];

const availableYears = [2020, 2010, 2000, 1990, 1980, 1970, 1960, 1950].map(
	decadeToRange,
);

function BrowseAlbums() {
	const [selectedGenre, setSelectedGenre] = useState('pop');
	const [selectedYearRange, setSelectedYearRange] = useState(
		decadeToRange(2020),
	);
	const handleGenreChange = (value: string) => {
		setSelectedGenre(value);
	};
	const handleYearRangeChange = (value: string) => {
		setSelectedYearRange(value);
	};

	return (
		<>
			<div className='mx-3 mb-2 flex items-center gap-4 border-b border-b-slate-500 pb-2'>
				<p>BROWSE BY...</p>
				<div className='flex gap-2'>
					<AlbumSelect
						placeholder='GENRE'
						items={availableGenres}
						value={selectedGenre}
						onValueChange={handleGenreChange}
					/>
					<AlbumSelect
						placeholder='YEAR'
						items={availableYears}
						value={selectedYearRange}
						onValueChange={handleYearRangeChange}
						className='w-32'
					/>
				</div>
			</div>
			<BrowseAlbumCarousel
				genre={selectedGenre}
				year={selectedYearRange}
			/>
		</>
	);
}

function BrowseAlbumCarousel({
	genre,
	year,
}: {
	genre?: string;
	year?: string;
}) {
	const genreQuery = genre ? `genre:"${genre}"` : '';
	const yearQuery = year ? `year:${year}` : '';
	const query = `${genreQuery} ${yearQuery}`.trim();

	const {
		isPending,
		isError,
		error,
		data: albums,
	} = useAlbumsBySearchQuery(query, 20);

	if (isError) {
		return <p>Error loading hip hop albums: {error.message}</p>;
	}
	if (isPending || albums.length === 0) {
		return (
			<div className='mx-3 mb-28 mt-4 flex justify-between'>
				<CoverLinkSkeletons />
			</div>
		);
	}

	return <FourAlbumCarousel newAlbums={albums} />;
}

type AlbumSelectProps = {
	placeholder: string;
	items: string[];
	value: string;
	onValueChange: (value: string) => void;
	className?: string;
};

function AlbumSelect({
	placeholder,
	items,
	value,
	onValueChange,
	className = '',
}: AlbumSelectProps) {
	return (
		<Select
			value={value}
			onValueChange={onValueChange}
		>
			<SelectTrigger className={cn('w-28', className)}>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{items.map((item) => (
						<SelectItem
							key={item}
							value={item}
						>
							{item}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
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
