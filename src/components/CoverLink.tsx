import { useNavigate } from 'react-router-dom';

export default function CoverLink({
	album,
	size = 224,
}: {
	album: SpotifyApi.AlbumObjectSimplified;
	size?: number;
}) {
	const navigate = useNavigate();
	function navigateToAlbum() {
		navigate(`/album/${album.id}`);
	}

	return (
		<img
			src={album.images[0].url}
			alt={`${album.name} album cover`}
			width={size}
			height={size}
			className='box-border h-fit rounded transition duration-150 hover:cursor-pointer hover:shadow-white'
			onClick={navigateToAlbum}
		/>
	);
}

export function CoverLinkSkeletons({
	size = 224,
	number = 1,
}: {
	size?: number;
	number?: number;
}) {
	return Array.from({ length: number }).map((_, i) => (
		<div
			key={i}
			className='animate-pulse rounded bg-slate-700'
			style={{ width: size, height: size }}
		/>
	));
}
