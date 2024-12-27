import { FaSpotify } from 'react-icons/fa';

export default function SpotifyIconButton({
	url,
	size = 16,
	className,
}: {
	url: string;
	size?: number;
	className?: string;
}) {
	return (
		<a
			href={url}
			target='_blank'
			rel='noreferrer noopener'
			onClick={(e) => e.stopPropagation()}
		>
			<FaSpotify
				size={size}
				className={`fill-neutral-500 hover:fill-white ${className}`}
			/>
		</a>
	);
}
