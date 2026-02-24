import { FormEvent, useState } from 'react';
import { useUpsertReview } from '@/config/supabaseClient';
import { AlbumReview } from '@/types/supabaseTypes';
import { User } from '@supabase/supabase-js';
import StarRating from '@/components/StarRating';
import IconToggle from '@/components/IconToggle';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type AlbumInfo = SpotifyApi.SingleAlbumResponse;

export default function ReviewForm({
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

	const [review, setReview] = useState<string>(initialReview ?? '');
	const [rating, setRating] = useState<number>(initialRating ?? 0);
	const [listened, setListened] = useState<boolean>(initialListened);

	const [formError, setFormError] = useState<string | null>('');
	const [formSuccess, setFormSuccess] = useState<string | null>('');
	const { mutate: upsertReview } = useUpsertReview();

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		upsertReview(
			{
				album_id: album.id,
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
			className='flex min-w-0 flex-col gap-2'
		>
			<section className='flex min-w-0 flex-col gap-6 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8 sm:py-4'>
				<div className='flex gap-8'>
					<Rating
						rating={rating}
						setRating={setRating}
					/>
					<IconToggle
						checked={listened}
						setChecked={setListened}
					/>
				</div>
				<LastUpdated createdAtDate={createdAtDate} />
			</section>

			<ReviewTextBox
				setReview={setReview}
				review={review}
			/>

			{formError && (
				<p className='text-sm break-words text-red-500'>{formError}</p>
			)}
			{formSuccess && (
				<p className='text-sm break-words text-green-500'>{formSuccess}</p>
			)}

			<Button
				className='mt-4 w-full sm:w-auto'
				type='submit'
			>
				Save
			</Button>
		</form>
	);
}

function LastUpdated({ createdAtDate }: { createdAtDate: string | null }) {
	const formattedDate = createdAtDate
		? new Date(createdAtDate).toLocaleDateString(undefined, {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			})
		: 'Not available';

	return (
		<div className='flex flex-col items-start gap-1 sm:items-center'>
			<Label className='text-sm font-normal sm:text-base'>Last updated</Label>
			<p className='text-sm text-slate-300 sm:text-base'>{formattedDate}</p>
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
		<div className='min-w-0'>
			<Label className='text-sm font-normal sm:text-base'>Rating</Label>
			<StarRating
				initialRating={rating}
				onChange={setRating}
				size='md'
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
		<div className='flex min-w-0 flex-col gap-1'>
			<Label className='text-sm font-normal sm:text-base'>Review</Label>
			<Textarea
				name='review'
				required
				className='min-h-24 resize-y text-sm text-slate-300 sm:text-base'
				placeholder='Leave a review...'
				value={review}
				onChange={(e) => {
					setReview(e.target.value);
				}}
			/>
		</div>
	);
}
