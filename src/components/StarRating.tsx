import { useState } from 'react';
import { Star } from 'lucide-react';
import clsx from 'clsx';

type StarRatingProps = {
	maxRating?: number;
	initialRating?: number;
	onChange?: (rating: number) => void;
	size?: 'sm' | 'md' | 'lg';
	color?: string;
	readOnly?: boolean;
};

export default function StarRating({
	maxRating = 5,
	initialRating = 0,
	onChange,
	size = 'lg',
	color = '#ce22ff',
	readOnly = false,
}: StarRatingProps) {
	const [rating, setRating] = useState(initialRating);
	const [hoverRating, setHoverRating] = useState(0);

	// Size mapping for the stars
	const sizeMap = {
		sm: 'w-4 h-4',
		md: 'w-6 h-6',
		lg: 'w-8 h-8',
	};

	// Calculate the star size based on the size prop
	const starSize = sizeMap[size];

	// Handle mouse enter on a star
	const handleMouseEnter = (index: number, isHalf: boolean) => {
		if (readOnly) return;
		setHoverRating(isHalf ? index - 0.5 : index);
	};

	// Handle mouse leave from the rating component
	const handleMouseLeave = () => {
		if (readOnly) return;
		setHoverRating(0);
	};

	// Handle click on a star
	const handleClick = (index: number, isHalf: boolean) => {
		if (readOnly) return;
		const newRating = isHalf ? index - 0.5 : index;
		setRating(newRating);
		if (onChange) {
			onChange(newRating);
		}
	};

	// Render the stars
	const renderStars = () => {
		const stars = [];
		const activeRating = hoverRating || rating;

		for (let i = 1; i <= maxRating; i++) {
			const isActiveHalf = activeRating === i - 0.5;
			const isActiveFull = activeRating >= i;

			stars.push(
				<div
					key={`star-${i}`}
					className={clsx('relative inline-block', {
						'pointer-events-none': readOnly,
					})}
				>
					{/* Half star hitbox (left half) */}
					<span
						className='absolute inset-y-0 left-0 w-1/2 cursor-pointer'
						onMouseEnter={() => handleMouseEnter(i, true)}
						onClick={() => handleClick(i, true)}
						aria-hidden='true'
					/>

					{/* Full star hitbox (right half) */}
					<span
						className='absolute inset-y-0 right-0 w-1/2 cursor-pointer'
						onMouseEnter={() => handleMouseEnter(i, false)}
						onClick={() => handleClick(i, false)}
						aria-hidden='true'
					/>

					{/* Star icon with fill based on rating */}
					<Star
						className={`${starSize} transition-colors`}
						fill={isActiveFull ? color : isActiveHalf ? 'url(#half)' : 'none'}
						color={color}
						strokeWidth={1.5}
					/>
				</div>,
			);
		}

		return stars;
	};

	return (
		<div
			className='flex items-center gap-1'
			onMouseLeave={handleMouseLeave}
			role='radiogroup'
			aria-label='Rating'
		>
			{/* SVG definition for half-star gradient */}
			<svg
				width='0'
				height='0'
				className='absolute'
			>
				<defs>
					<linearGradient
						id='half'
						x1='0'
						x2='100%'
						y1='0'
						y2='0'
					>
						<stop
							offset='50%'
							stopColor={color}
						/>
						<stop
							offset='50%'
							stopColor='transparent'
						/>
					</linearGradient>
				</defs>
			</svg>

			{renderStars()}
		</div>
	);
}
