import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import ISO3166ToString from '@/data/ISO3166-1.alpha-2';
import spotifyClient from '@/config/spotifyClient';
import supabase, { useUser } from '@/config/supabaseClient';
import { User } from '@supabase/supabase-js';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Clock } from 'lucide-react';
import SpotifyIconButton from '@/components/icon/SpotifyIconButton';
import TextCollapse from '@/components/TextCollapse';
import HeaderDivider from '@/components/typography/HeaderDivider';
import { Button } from '@/components/ui/button';
import ReviewRatingStars from '@/components/ReviewRatingStars';

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

	const infoTable = {
		'Record Label': album.label,
		Release: new Date(album.release_date).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		}),
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

				<InfoTable infoTable={infoTable} />
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
	const { isPending, isError, error, data: user } = useUser();

	if (isPending) return <div>Loading...</div>;
	if (isError) return <div>Error: {error.message}</div>;

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
		/>
	);
}

function ReviewForm({ album, user }: { album: AlbumInfo; user: User }) {
	const [review, setReview] = useState('');
	const [rating, setRating] = useState(0);
	const [formError, setFormError] = useState<string | null>('');
	const [formSuccess, setFormSuccess] = useState<string | null>('');

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const { data, error } = await supabase
			.from('reviews')
			.insert([
				{
					id: album.id,
					user_id: user.id,
					album_name: album.name,
					rating,
					review,
				},
			])
			.select();

		if (error) {
			console.error('Error inserting review:', error);
			if (error.code === '23505') {
				setFormError('Review already exists.');
			} else {
				setFormError(
					`Error inserting review. Please try again. Error: ${error.message}`,
				);
			}
			setFormSuccess(null);
		}

		if (data) {
			setFormSuccess('Review saved successfully!');
			setFormError(null);
		}
	}

	return (
		<form
			method='dialog'
			onSubmit={handleSubmit}
			className='flex flex-col gap-2'
		>
			<ReviewRatingStars
				required
				setRating={setRating}
			/>
			<ReviewTextBox setReview={setReview} />

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

function ReviewTextBox({
	setReview,
	required = false,
}: {
	setReview: (review: string) => void;
	required?: boolean;
}) {
	return (
		<label className='form-control'>
			<div className='label px-0 py-2'>
				<span className='label-text text-base'>Review</span>
			</div>
			<textarea
				name='review'
				required={required}
				className='textarea textarea-bordered h-24'
				placeholder='Leave a review...'
				onChange={(e) => {
					setReview(e.target.value);
				}}
			></textarea>
		</label>
	);
}

function InfoTable({
	infoTable,
}: {
	infoTable: Record<string, string | number>;
}) {
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

function TracksTable({
	tracks,
}: {
	tracks: SpotifyApi.TrackObjectSimplified[];
}) {
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
	);
}
