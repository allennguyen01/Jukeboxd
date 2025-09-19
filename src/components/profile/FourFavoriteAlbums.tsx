import { useFavoriteAlbumsByUsername } from '@/config/supabaseClient';
import { NavLink } from 'react-router-dom';
import CoverLink from '@/components/CoverLink';

export default function FourFavoriteAlbums({ username }: { username: string }) {
	const {
		isLoading,
		isError,
		error,
		data: favAlbums,
	} = useFavoriteAlbumsByUsername(username);

	if (isLoading) return <p>Loading favorite albums...</p>;
	if (isError) return <p>Error loading favorite albums: {error?.message}</p>;
	if (!favAlbums || favAlbums.length === 0)
		return (
			<p className='text-slate-400'>
				Don't forget to select your{' '}
				<NavLink
					to='/settings'
					className='text-slate-200 hover:text-blue-400'
				>
					favorite albums
				</NavLink>
				!
			</p>
		);

	return (
		<div className='flex gap-2'>
			{favAlbums.map((album) => (
				<div>
					<CoverLink
						key={album.id}
						album={album}
					/>
				</div>
			))}
		</div>
	);
}
