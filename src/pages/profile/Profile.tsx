import { NavLink, useParams, useNavigate } from 'react-router-dom';
import {
	useProfileInfoByUsername,
	useUser,
	useReviewsByUserId,
} from '@/config/supabaseClient';
import { Mail, MapPinHouse, MousePointerClick, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeaderDivider from '@/components/typography/HeaderDivider';
import FourFavoriteAlbums from '@/components/profile/FourFavoriteAlbums';
import RecentActivity from '@/components/profile/RecentActivity';
import { Separator } from '@/components/ui/separator';
import { themeBrand } from '@/config/theme';

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
		<div className='my-5 flex w-full max-w-5xl flex-col gap-6 px-4 sm:px-0'>
			<div className='flex flex-col items-center gap-4 sm:flex-row sm:justify-between'>
				<ProfileHeader userData={userData} />
				<ProfileStats userId={userData.id} />
			</div>
			<div className='flex flex-col-reverse gap-8 sm:grid sm:grid-cols-5 sm:gap-16'>
				<div className='flex w-full min-w-0 flex-col gap-4 sm:col-span-3 sm:max-w-3xl sm:flex-1'>
					<div className='flex flex-col gap-2'>
						<HeaderDivider text='FAVORITE ALBUMS' />
						<FourFavoriteAlbums username={username} />
					</div>
					<div className='flex flex-col gap-2'>
						<HeaderDivider text='RECENT ACTIVITY' />
						<RecentActivity userId={userData.id} />
					</div>
				</div>
				<div className='flex w-full flex-shrink-0 flex-col gap-4 sm:col-span-2'>
					<div className='flex flex-col gap-2'>
						<HeaderDivider text='BIO' />
						{bio && <p className='text-sm whitespace-pre-line'>{bio}</p>}
					</div>
					<div className='flex flex-col gap-2'>
						<HeaderDivider text='REVIEW STATS' />
						<ReviewStats userId={userData.id} />
					</div>
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
		website,
	} = userData;

	const viewingOwnProfile = user?.id === id;

	const name = firstName || lastName ? `${firstName} ${lastName}` : username;

	return (
		<section className='flex flex-col items-center gap-4 text-slate-300 sm:items-start'>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8'>
				<h1 className='text-xl font-bold text-white sm:text-2xl'>{name}</h1>
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
			<div className='flex flex-col gap-2 text-sm sm:flex-row sm:gap-10 sm:text-base'>
				{email && (
					<span className='flex gap-2'>
						<Mail className='size-4 sm:size-5' /> {email}
					</span>
				)}
				{location && (
					<p className='flex gap-2'>
						<MapPinHouse className='size-4 sm:size-5' /> {location}
					</p>
				)}
				{website && (
					<p className='flex gap-2'>
						<MousePointerClick className='size-4 sm:size-5' />{' '}
						<a
							href={website}
							className='hover:text-blue-400 hover:underline'
							target='_blank'
							rel='noopener noreferrer'
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
		<div className='flex items-center gap-1 sm:gap-2'>
			{Object.entries(info).map(([key, value], i) => (
				<div
					key={key}
					className='flex items-center gap-2'
				>
					<p className='flex flex-col items-center gap-1 sm:gap-2'>
						<span className='font-playfair text-2xl font-bold sm:text-3xl'>
							{value}
						</span>
						<span className='text-xs text-slate-400'>{key}</span>
					</p>
					{i !== Object.keys(info).length - 1 && (
						<Separator
							className='mx-1 h-10 bg-slate-600 sm:mx-2 sm:h-14'
							orientation='vertical'
						/>
					)}
				</div>
			))}
		</div>
	);
}

function ReviewStats({ userId }: { userId: string }) {
	const { data: reviews } = useReviewsByUserId(userId);

	if (!reviews) return null;

	const ratings: number[] = reviews
		.filter((review) => review.rating !== null)
		.map((review) => review.rating as number);

	ratings.sort((a, b) => b - a);

	const averageRating =
		ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;

	const map = new Map<number, number>([
		[0, 0],
		[0.5, 0],
		[1, 0],
		[1.5, 0],
		[2, 0],
		[2.5, 0],
		[3, 0],
		[3.5, 0],
		[4, 0],
		[4.5, 0],
		[5, 0],
	]);

	const ratingDistribution = ratings.reduce(
		(acc: Map<number, number>, rating) => {
			acc.set(rating, (acc.get(rating) || 0) + 1);
			return acc;
		},
		map,
	);

	return (
		<section className='flex flex-col items-center gap-3 sm:gap-4'>
			<p className='flex flex-col items-center gap-1 sm:gap-2'>
				<span className='font-playfair text-2xl font-bold sm:text-3xl'>
					{averageRating}
				</span>
				<span className='text-xs text-slate-400'>AVERAGE RATING</span>
			</p>
			<div className='grid grid-cols-4 place-items-center gap-1 gap-x-4 gap-y-1 sm:grid-cols-2 sm:gap-2 sm:gap-x-8 sm:gap-y-2'>
				{Array.from(ratingDistribution.entries()).map(([rating, count]) => (
					<div
						key={rating}
						className='flex items-center gap-2'
					>
						<span className='flex items-center'>
							{rating}
							<Star
								fill={themeBrand.secondary}
								stroke={themeBrand.secondary}
								className='size-4 sm:size-5'
							/>
							:
						</span>
						{count}
					</div>
				))}
			</div>
		</section>
	);
}
