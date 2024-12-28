import { useState, useRef, useEffect } from 'react';
import { debounce } from 'lodash';

const TextCollapse = ({ text }: { text: string }) => {
	const [clamped, setClamped] = useState(true);
	const [showButton, setShowButton] = useState(false);
	const containerRef = useRef<HTMLParagraphElement>(null);
	const handleClick = () => setClamped(!clamped);

	useEffect(() => {
		const hasClamping = (el: HTMLParagraphElement) => {
			const { clientHeight, scrollHeight } = el;
			return clientHeight !== scrollHeight;
		};

		const checkButtonAvailability = () => {
			const container = containerRef.current;

			if (container) {
				const hadClampClass = container.classList.contains('clamp');
				if (!hadClampClass) container.classList.add('clamp');
				setShowButton(hasClamping(container));
				if (!hadClampClass) container.classList.remove('clamp');
			}
		};

		const debouncedCheck = debounce(checkButtonAvailability, 50);

		checkButtonAvailability();
		window.addEventListener('resize', debouncedCheck);

		return () => {
			window.removeEventListener('resize', debouncedCheck);
		};
	}, [containerRef]);

	return (
		<div className='text-sm font-normal'>
			<p
				ref={containerRef}
				className={`leading-relaxed ${clamped ? 'line-clamp-3 break-words' : ''}`}
			>
				{text}
			</p>

			{showButton && (
				<button
					onClick={(e) => {
						e.stopPropagation();
						handleClick();
					}}
					className='font-normal text-neutral-300 hover:text-blue-500'
				>
					{clamped ? '...more' : '✕'}
				</button>
			)}
		</div>
	);
};

export default TextCollapse;
