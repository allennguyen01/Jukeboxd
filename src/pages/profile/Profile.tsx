import { NavLink, useParams, useNavigate } from 'react-router-dom';
import {
	useProfileInfoByUsername,
	useUser,
	useRecentReviewsByUserId,
} from '@/config/supabaseClient';
import { Mail, MapPinHouse, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeaderDivider from '@/components/typography/HeaderDivider';
import { useFavoriteAlbumsByUsername } from '@/config/supabaseClient';
import CoverLink from '@/components/CoverLink';
import RecentActivityCard from '@/components/RecentActivityCard';

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
			<div className='flex w-3xl flex-col gap-4'>
				<div className='flex flex-col gap-2'>
					<HeaderDivider text='FAVORITE ALBUMS' />
					<FourFavoriteAlbums username={username} />
				</div>
				<div className='flex flex-col gap-2'>
					<HeaderDivider text='RECENT ACTIVITY' />
					<RecentActivity userId={userData.id} />
				</div>
			</div>
		</div>
	);
}

function ProfileHeader({ userData }: { userData: any }) {
	const { data: user } = useUser();

	const {
		id,
		username,
		first_name: firstName,
		last_name: lastName,
		email,
		location,
		bio,
		website,
	} = userData;

	const viewingOwnProfile = user?.id === id;

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
				{viewingOwnProfile && (
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
				)}
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

function RecentActivity({ userId }: { userId: string }) {
	const {
		isLoading: isLoadingReviews,
		isError: isErrorReviews,
		error: errorReviews,
		data: recentReviews,
	} = useRecentReviewsByUserId(userId, 4);

	console.log(recentReviews);

	if (isLoadingReviews)
		return <p className='text-slate-400'>Loading recent activity...</p>;
	if (isErrorReviews)
		return (
			<p className='text-red-400'>
				Error loading recent activity: {errorReviews?.message}
			</p>
		);
	if (!recentReviews || recentReviews.length === 0)
		return <p className='text-slate-400'>No recent activity found.</p>;

	return (
		<div className='flex gap-2'>
			{recentReviews.map((review) => (
				<RecentActivityCard
					key={`${review.id}-${review.user_id}`}
					review={review}
				/>
			))}
		</div>
	);
}
