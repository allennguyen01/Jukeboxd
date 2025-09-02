import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { useProfileInfoByUsername } from '@/config/supabaseClient';
import { Mail, MapPinHouse, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeaderDivider from '@/components/typography/HeaderDivider';
import { useFavoriteAlbumsByUsername } from '@/config/supabaseClient';
import CoverLink from '@/components/CoverLink';

export default function Profile() {
	const navigate = useNavigate();
	const { username = '' } = useParams();
	const {
		isLoading,
		isError,
		error,
		data: userData,
	} = useProfileInfoByUsername(username);

	if (isLoading) return <p>Loading profile...</p>;

	if (isError) return <p>Error loading profile: {error?.message}</p>;

	if (!userData) {
		navigate('/404');
	}

	return (
		<div className='my-5 flex w-5xl flex-col gap-6'>
			<ProfileHeader userData={userData} />
			<FourFavoriteAlbums username={username} />
		</div>
	);
}

function ProfileHeader({ userData }: { userData: any }) {
	if (!userData) return null;

	const {
		username,
		first_name: firstName,
		last_name: lastName,
		email,
		location,
		bio,
		website,
	} = userData;

	return (
		<section className='flex flex-col gap-4 text-slate-300'>
			<div className='flex gap-8'>
				<h1 className='text-2xl font-bold text-white'>
					{firstName || lastName ? (
						<>
							{firstName} {lastName}
						</>
					) : (
						username
					)}
				</h1>
				<NavLink
					to='/settings'
					className='text-sm'
				>
					<Button
						size='sm'
						variant='outline'
					>
						EDIT PROFILE
					</Button>
				</NavLink>
			</div>
			<div className='flex gap-10'>
				{email && (
					<p className='flex gap-2'>
						<Mail /> {email}
					</p>
				)}
				{location && (
					<p className='flex gap-2'>
						<MapPinHouse /> {location}
					</p>
				)}
				{website && (
					<p className='flex gap-2'>
						<MousePointerClick />{' '}
						<a
							href={website}
							className='hover:text-blue-400 hover:underline'
						>
							{website}
						</a>
					</p>
				)}
			</div>
			{bio && <p className='text-sm whitespace-pre-line'>{bio}</p>}
		</section>
	);
}

function FourFavoriteAlbums({ username }: { username: string }) {
	const {
		isLoading,
		isError,
		error,
		data: favAlbums,
	} = useFavoriteAlbumsByUsername(username);

	return (
		<div className='flex flex-col gap-2'>
			<HeaderDivider text='FAVORITE ALBUMS' />
			{isLoading && <p>Loading favorite albums...</p>}
			{isError && <p>Error loading favorite albums: {error?.message}</p>}
			{favAlbums && favAlbums.length > 0 ? (
				<div className='flex gap-2'>
					{favAlbums.map((album) => (
						<CoverLink
							key={album.id}
							album={album}
						/>
					))}
				</div>
			) : (
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
			)}
		</div>
	);
}
