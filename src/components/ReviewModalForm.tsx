import { FormEvent, useState } from 'react';
import ReviewRatingStars from './ReviewRatingStars';
import supabase from '../config/supabaseClient';

type ReviewModalFormProps = {
	id: string;
	name: string;
	coverURL: string;
	year: number;
};

export default function ReviewModalForm({
	id,
	name,
	coverURL,
	year,
}: ReviewModalFormProps) {
	const [rating, setRating] = useState<number>(0);
	const [review, setReview] = useState<string>('');
	const [formError, setFormError] = useState<string | null>('');
	const [formSuccess, setFormSuccess] = useState<string | null>('');

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!id || !name || !coverURL || !year || !rating) {
			setFormError(
				`${!id ? 'albumID' : ''}
				${!name ? 'albumName' : ''}
				${!coverURL ? 'albumCoverURL' : ''}
				${!year ? 'albumYear' : ''}
				${!rating ? 'rating' : ''}
				 does not exist, please try again.`,
			);
			return;
		}

		const { data, error } = await supabase
			.from('reviews')
			.insert([
				{
					id: id,
					album_name: name,
					album_cover_url: coverURL,
					year: year,
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
				setFormError('Error inserting review. Please try again.');
			}

			setFormSuccess(null);
		}

		if (data) {
			console.log('Review inserted:', data);

			setFormSuccess('Review saved successfully!');
			setFormError(null);
		}
	}

	return (
		<dialog
			id={`review-modal-${name}`}
			className='modal'
		>
			<div className='modal-box'>
				<form method='dialog'>
					{/* if there is a button in form, it will close the modal */}
					<button className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2'>
						✕
					</button>
				</form>
				<h3 className='text-xl font-bold'>{name}</h3>

				<form
					method='dialog'
					onSubmit={handleSubmit}
					className='flex flex-col gap-2'
				>
					<ReviewTextBox setReview={setReview} />
					<ReviewRatingStars setRating={setRating} />

					{formError && <p className='text-red-500'>{formError}</p>}
					{formSuccess && <p className='text-green-500'>{formSuccess}</p>}

					<button
						className='btn mt-4'
						type='submit'
					>
						Save
					</button>
				</form>
			</div>
		</dialog>
	);
}

function ReviewTextBox({ setReview }: { setReview: (review: string) => void }) {
	return (
		<label className='form-control'>
			<div className='label px-0 py-2'>
				<span className='label-text text-base'>Review</span>
			</div>
			<textarea
				className='textarea textarea-bordered h-24'
				placeholder='Leave a review...'
				onChange={(e) => {
					setReview(e.target.value);
				}}
			></textarea>
		</label>
	);
}
