import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { useProfileInfoByUsername } from '@/config/supabaseClient';
import { Mail, MapPinHouse, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
		<div className='my-5 w-5xl'>
			<ProfileHeader userData={userData} />
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
