type ReviewRatingStarsProps = {
	rating?: number;
	readOnly?: boolean;
	required?: boolean;
	setRating?: (rating: number) => void;
};

export default function ReviewRatingStars({
	rating = 0,
	readOnly = false,
	required = false,
	setRating = () => {},
}: ReviewRatingStarsProps) {
	const ratingValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	return (
		<div className='flex flex-col gap-1 py-2'>
			{!readOnly && <p className='font-normal'>Rating</p>}

			<div className='rating rating-half rating-md'>
				{ratingValues.map((value) => (
					<input
						key={value}
						type='radio'
						name='10-star-rating'
						disabled={readOnly}
						required={required}
						className={`mask mask-star-2 bg-secondary-600 ${readOnly && value > rating ? 'bg-opacity-20' : ''} ${value % 2 === 1 ? 'mask-half-1' : 'mask-half-2'} ${readOnly ? 'cursor-auto' : ''}`}
						value={value}
						onChange={(e) => {
							setRating(Number(e.target.value));
						}}
					/>
				))}
			</div>
		</div>
	);
}
