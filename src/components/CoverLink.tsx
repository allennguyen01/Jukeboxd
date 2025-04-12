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
