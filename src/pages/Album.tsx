import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import ISO3166ToString from '@/data/ISO3166-1.alpha-2';
import spotifyClient, { useAlbumGenres } from '@/config/spotifyClient';
import { useUser, useReviewByAlbumId } from '@/config/supabaseClient';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import SpotifyIconButton from '@/components/icon/SpotifyIconButton';
import TextCollapse from '@/components/TextCollapse';
import HeaderDivider from '@/components/typography/HeaderDivider';
import { Button } from '@/components/ui/button';
import ReviewForm from './album/ReviewForm';
import clsx from 'clsx';
import ArtistTag from '@/components/common/ArtistTag';

type AlbumInfo = SpotifyApi.SingleAlbumResponse;

function msToMinAndSec(ms: number) {
	const date = new Date(ms);
	return `${date.getMinutes()}:${date.getSeconds() < 10 ? `${'0' + date.getSeconds()}` : date.getSeconds()}`;
}

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

	return (
		<div className='relative grid w-full max-w-5xl grid-cols-1 gap-2 lg:grid-cols-4 lg:gap-0'>
			<div className='flex h-min flex-col items-center gap-4 sm:flex-row lg:sticky lg:top-2 lg:max-w-64 lg:flex-col lg:items-start'>
				<img
					src={album.images[0].url}
					alt={album.name}
					className='size-48 shrink-0 rounded-sm sm:size-56 lg:size-64'
				/>
				<div>
					<SpotifyIconButton
						size={30}
						url={album.external_urls.spotify}
						className='mb-2'
					/>
					<InfoTable album={album} />
				</div>
			</div>

			<div className='flex flex-col gap-8 lg:col-span-3 lg:ml-10 lg:gap-8'>
				<AlbumTitle album={album} />

				<section>
					<HeaderDivider
						text='YOUR REVIEW'
						className='mb-2'
					/>
					<YourReview album={album} />
				</section>

				<section>
					<HeaderDivider
						text='TRACKS'
						className='mb-2'
					/>
					<TracksTable
						tracks={album.tracks.items}
						initialTracks={5}
					/>
				</section>

				<section>
					<HeaderDivider
						text='AVAILABLE MARKETS'
						className='mb-2'
					/>
					<TextCollapse
						text={
							album.available_markets
								?.map((album) => {
									return ISO3166ToString[album.toUpperCase()];
								})
								.join(', ') || 'N/A'
						}
					/>
				</section>
			</div>
		</div>
	);
}

function YourReview({ album }: { album: AlbumInfo }) {
	const {
		isPending: isPendingUser,
		isError: isErrorUser,
		error: errorUser,
		data: user,
	} = useUser();

	const {
		isPending: isPendingReview,
		isError: isErrorReview,
		error: errorReview,
		data: currentReview,
	} = useReviewByAlbumId(album.id);

	if (isPendingUser || isPendingReview) {
		return <div>Loading...</div>;
	}
	if (isErrorUser) return <div>Error: {errorUser.message}</div>;
	if (isErrorReview) return <div>Error: {errorReview.message}</div>;

	if (!user) {
		return (
			<Button className='w-full'>
				Sign in to log, rate, or leave a review
			</Button>
		);
	}

	return (
		<ReviewForm
			album={album}
			user={user}
			albumReview={currentReview}
		/>
	);
}

function InfoTable({
	album,
	className,
}: {
	album: AlbumInfo;
	className?: string;
}) {
	const infoTable = {
		'Record Label':
			album.label && album.label.length > 30
				? `${album.label.slice(0, 30)}...`
				: album.label,
		Release: new Date(album.release_date).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		}),
		Genres: <GenreList album={album} />,
		'Total Tracks': album.total_tracks,
		Duration: msToMinAndSec(
			album.tracks.items.reduce(
				(sumDuration, track) => sumDuration + track.duration_ms,
				0,
			),
		),
		Popularity: `${album.popularity}%`,
	};

	return (
		<Table className={clsx('my-4 w-full', className)}>
			<TableBody className='grid w-full grid-flow-col grid-cols-2 grid-rows-3 items-center gap-2 sm:grid-flow-row sm:grid-cols-1 sm:grid-rows-1 sm:gap-4'>
				{Object.entries(infoTable).map(([key, value]) => (
					<TableRow
						key={key}
						className='grid max-h-14 w-full grid-cols-5 items-center gap-x-2 text-sm sm:max-h-20 sm:grid-cols-2 sm:gap-x-4 sm:text-base'
					>
						<TableCell className='col-span-2 p-0 font-medium text-slate-400 sm:col-span-1 sm:min-w-32'>
							{key}
						</TableCell>
						<TableCell className='col-span-3 p-0 break-words text-white sm:col-span-1'>
							{value}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

function AlbumTitle({ album }: { album: AlbumInfo }) {
	return (
		<section className='flex flex-col gap-2'>
			<h1 className='font-playfair text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl'>
				{album.name}
			</h1>
			<p className='text-sm sm:text-base'>
				Performed by{' '}
				<span className='inline-flex flex-wrap gap-1'>
					{album.artists.map((artist) => (
						<ArtistTag artist={artist} />
					))}
				</span>
			</p>
		</section>
	);
}

function GenreList({ album }: { album: AlbumInfo }) {
	const { isPending, isError, error, data: genres } = useAlbumGenres(album);

	if (isPending) return 'Loading...';
	if (isError) return `Error: ${error.message}`;

	return genres;
}

function TracksTable({
	tracks,
	initialTracks = 10,
}: {
	tracks: SpotifyApi.TrackObjectSimplified[];
	initialTracks?: number;
}) {
	const [expanded, setExpanded] = useState(false);
	const tooManyTracks = tracks.length > initialTracks;
	const visibleTracks = expanded ? tracks : tracks.slice(0, initialTracks);

	return (
		<>
			<Table>
				<TableHeader>
					<TableRow className='border-neutral-600 text-xs lg:text-sm'>
						<TableHead className='w-8 text-right'>#</TableHead>
						<TableHead>Title</TableHead>
						<TableHead className='hidden sm:table-cell'>Artist</TableHead>
						<TableHead className='flex w-12 items-center justify-end'>
							<Clock
								size={16}
								className='shrink-0'
							/>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{visibleTracks.map((track) => (
						<TableRow
							key={track.id}
							className='border-0 text-xs lg:text-sm'
						>
							<TableCell className='w-8 py-2 text-right lg:py-3'>
								{track.track_number}
							</TableCell>
							<TableCell
								className='max-w-0 truncate py-2 text-white lg:max-w-none lg:py-3'
								title={track.name}
							>
								{track.name}
							</TableCell>
							<TableCell
								className='hidden max-w-0 truncate py-2 sm:table-cell lg:max-w-none lg:py-3'
								title={track.artists.map((a) => a.name).join(', ')}
							>
								{track.artists.map((artist) => artist.name).join(', ')}
							</TableCell>
							<TableCell className='w-12 text-right'>
								{msToMinAndSec(track.duration_ms)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			{(tooManyTracks || expanded) && (
				<Button
					variant='ghost'
					size='sm'
					className='w-full rounded-sm border border-neutral-600'
					onClick={() => setExpanded(!expanded)}
				>
					{expanded ? 'View Less' : 'View More'}
					{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
				</Button>
			)}
		</>
	);
}
