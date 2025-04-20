import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import ISO3166ToString from '@/data/ISO3166-1.alpha-2';
import spotifyClient, { useAlbumGenres } from '@/config/spotifyClient';
import {
	useUpsertReview,
	useUser,
	useReviewByAlbumId,
} from '@/config/supabaseClient';
import { User } from '@supabase/supabase-js';
import { AlbumReview } from '@/types/supabaseTypes';

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
import StarRating from '@/components/StarRating';
import IconToggle from '@/components/IconToggle';

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
		<div className='relative m-4 grid max-w-5xl grid-cols-4'>
			<div className='sticky top-2 flex h-min max-w-64 flex-col'>
				<img
					src={album.images[0].url}
					alt={album.name}
					className='size-64 rounded-sm'
				/>

				<SpotifyIconButton
					size={30}
					url={album.external_urls.spotify}
					className='my-4'
				/>

				<InfoTable album={album} />
			</div>

			<div className='col-span-3 ml-10 flex flex-col gap-4'>
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
					<TracksTable tracks={album.tracks.items} />
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
			<Button className='w-full text-slate-400 hover:text-slate-100'>
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

function ReviewForm({
	album,
	user,
	albumReview,
}: {
	album: AlbumInfo;
	user: User;
	albumReview: AlbumReview | null;
}) {
	const {
		rating: initialRating,
		review: initialReview,
		listened: initialListened,
		created_at: createdAtDate,
	} = albumReview || {
		rating: 0,
		review: '',
		listened: false,
		created_at: null,
	};

	const [review, setReview] = useState(initialReview);
	const [rating, setRating] = useState(initialRating);
	const [listened, setListened] = useState(initialListened);
	const [formError, setFormError] = useState<string | null>('');
	const [formSuccess, setFormSuccess] = useState<string | null>('');
	const { mutate: upsertReview } = useUpsertReview();

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		upsertReview(
			{
				id: album.id,
				user_id: user.id,
				album_name: album.name,
				rating,
				review,
				listened,
			},
			{
				onSuccess: () => {
					setFormSuccess('Review saved successfully!');
					setFormError(null);
				},
				onError: (error: any) => {
					if (error.code === '23505') {
						setFormError('Review already exists.');
					} else {
						setFormError(
							`Error inserting review, please try again. Error: ${error.message}`,
						);
					}
					setFormSuccess(null);
				},
			},
		);
	}

	return (
		<form
			method='dialog'
			onSubmit={handleSubmit}
			className='flex flex-col gap-2'
		>
			<section className='flex h-full items-center gap-8 py-4'>
				<Rating
					rating={rating}
					setRating={setRating}
				/>
				<IconToggle
					checked={listened}
					setChecked={setListened}
				/>
				<LastUpdated createdAtDate={createdAtDate} />
			</section>

			<ReviewTextBox
				setReview={setReview}
				review={review}
			/>

			{formError && <p className='text-red-500'>{formError}</p>}
			{formSuccess && <p className='text-green-500'>{formSuccess}</p>}

			<button
				className='btn mt-4'
				type='submit'
			>
				Save
			</button>
		</form>
	);
}

function LastUpdated({ createdAtDate }: { createdAtDate: Date | null }) {
	if (!createdAtDate) return null;

	return (
		<div className='flex flex-col items-center gap-1'>
			<p>Last updated</p>
			<p className='text-white'>
				{`${new Date(createdAtDate).toLocaleDateString(undefined, {
					year: 'numeric',
					month: 'short',
					day: 'numeric',
				})}`}
			</p>
		</div>
	);
}

function Rating({
	rating,
	setRating,
}: {
	rating: number;
	setRating: (rating: number) => void;
}) {
	return (
		<div>
			<p>Rating</p>
			<StarRating
				initialRating={rating}
				onChange={setRating}
			/>
		</div>
	);
}

function ReviewTextBox({
	review,
	setReview,
}: {
	review: string;
	setReview: (review: string) => void;
}) {
	return (
		<label className='form-control'>
			<div className='label px-0 py-2'>
				<span className='label-text text-base'>Review</span>
			</div>
			<Textarea
				name='review'
				required
				className='dark:bg-transparent'
				placeholder='Leave a review...'
				value={review}
				onChange={(e) => {
					setReview(e.target.value);
				}}
			/>
		</label>
	);
}

function InfoTable({ album }: { album: AlbumInfo }) {
	const infoTable = {
		'Record Label': album.label,
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
		'Popularity (0-100)': album.popularity,
	};

	return (
		<Table>
			<TableBody>
				{Object.entries(infoTable).map(([key, value]) => (
					<TableRow key={key}>
						<TableCell className='min-w-32 p-0'>{key}</TableCell>
						<TableCell className='break-words text-white'>{value}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

function AlbumTitle({ album }: { album: AlbumInfo }) {
	const navigate = useNavigate();

	return (
		<section>
			<h1 className='font-playfair text-2xl font-semibold text-white'>
				{album.name}
			</h1>
			<p>
				Performed by{' '}
				<span className='inline-flex gap-1'>
					{album.artists.map((artist) => (
						<a
							className='underline hover:cursor-pointer hover:text-accent-600'
							key={artist.id}
							onClick={() => navigate(`/artist/${artist.id}`)}
						>
							{artist.name}
						</a>
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
}: {
	tracks: SpotifyApi.TrackObjectSimplified[];
}) {
	const [expanded, setExpanded] = useState(false);
	const tooManyTracks = tracks.length > 10;
	const visibleTracks = expanded ? tracks : tracks.slice(0, 10);

	return (
		<>
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
					{visibleTracks.map((track) => (
						<TableRow
							key={track.id}
							className='border-0'
						>
							<TableCell className='text-right'>{track.track_number}</TableCell>
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
