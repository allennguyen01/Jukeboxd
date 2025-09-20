import { NavLink, useParams, useNavigate } from 'react-router-dom';
import {
	useProfileInfoByUsername,
	useUser,
	useReviewsByUserId,
} from '@/config/supabaseClient';
import { Mail, MapPinHouse, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeaderDivider from '@/components/typography/HeaderDivider';
import FourFavoriteAlbums from '@/components/profile/FourFavoriteAlbums';
import RecentActivity from '@/components/profile/RecentActivity';
import { Separator } from '@/components/ui/separator';

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

	const { bio } = userData;

	return (
		<div className='my-5 flex w-5xl flex-col gap-6'>
			<div className='flex items-center justify-between'>
				<ProfileHeader userData={userData} />
				<ProfileStats userId={userData.id} />
			</div>
			<div className='flex justify-between gap-16'>
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
				<div className='flex flex-col gap-4'>
					<HeaderDivider text='BIO' />
					{bio && <p className='text-sm whitespace-pre-line'>{bio}</p>}
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
		</section>
	);
}

function ProfileStats({ userId }: { userId: string }) {
	const { data: reviews } = useReviewsByUserId(userId);

	const thisYearReviews = reviews?.filter((review) => {
		const reviewDate = new Date(review.created_at);
		const currentYear = new Date().getFullYear();
		return reviewDate.getFullYear() === currentYear;
	});

	const info = {
		ALBUMS: reviews?.length,
		'THIS YEAR': thisYearReviews?.length,
	};

	return (
		<div className='flex items-center gap-2'>
			{Object.entries(info).map(([key, value], i) => (
				<div className='flex items-center gap-2'>
					<p className='flex flex-col items-center gap-2'>
						<span className='font-playfair text-3xl font-bold'>{value}</span>
						<span className='text-xs text-slate-400'>{key}</span>
					</p>
					{i !== Object.keys(info).length - 1 && (
						<Separator
							className='mx-2 h-14 bg-slate-600'
							orientation='vertical'
						/>
					)}
				</div>
			))}
		</div>
	);
}
