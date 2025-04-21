import AuthDialog from '@/components/AuthDialog';
import HeaderDivider from '@/components/typography/HeaderDivider';
import { Button } from '@/components/ui/button';
import CoverLink from '@/components/CoverLink';
import {
	Eye,
	Calendar,
	Heart,
	NotebookText,
	Star,
	TableProperties,
} from 'lucide-react';
import { useAlbumsBySearchQuery } from '@/config/spotifyClient';

export default function Landing() {
	return (
		<div className='mb-24 flex w-full max-w-screen-lg flex-col gap-5'>
			<Hero />
			<JukeboxdLetsYou />
			<RecentAlbums />
		</div>
	);
}

function Hero() {
	return (
		<div
			className='blurred-edges hero h-[600px] max-w-screen-xl'
			style={{
				backgroundImage:
					'url(https://media.cnn.com/api/v1/images/stellar/prod/130907221429-jukebox-1942.jpg?q=w_3580,h_2340,x_0,y_0,c_fill)',
			}}
		>
			<div className='hero-overlay bg-opacity-40'></div>
			<div className='hero-content mb-16 h-full flex-col justify-end p-0 text-center'>
				<p className='font-playfair text-4xl font-bold text-white'>
					Track albums you&apos;ve listened to.
					<br />
					Save those you want to hear.
					<br />
					Tell your friends what&apos;s good.
				</p>
				<AuthDialog
					TriggerButton={
						<Button
							size='lg'
							className='text-lg font-semibold dark:bg-primary-600 dark:text-white dark:hover:bg-primary-800'
						>
							Get started — it&apos;s free!
						</Button>
					}
				/>
			</div>
		</div>
	);
}

function JukeboxdLetsYou() {
	function Card({
		text,
		color,
		icon,
	}: {
		text: string;
		color: 'primary' | 'secondary' | 'accent';
		icon: JSX.Element;
	}) {
		const backgroundColors = {
			primary: 'hover:bg-primary-500',
			secondary: 'hover:bg-secondary-500',
			accent: 'hover:bg-accent-500',
		};

		return (
			<div
				className={`flex items-center justify-between gap-4 rounded-sm bg-slate-600 px-4 py-2 text-base text-slate-100 ${backgroundColors[color]}`}
			>
				{icon}
				<p>{text}</p>
			</div>
		);
	}

	return (
		<section className='flex flex-col'>
			<HeaderDivider text='JUKEBOXD LETS YOU...' />
			<div className='grid grid-cols-3 gap-4 pt-4 md:grid-cols-2 lg:grid-cols-3'>
				<Card
					text="Keep track of every album you've ever listened (or just start from the
					day you join)"
					color='primary'
					icon={<Eye size={100} />}
				/>
				<Card
					text='Show some love for your favourite albums, playlists, and reviews with
					a "like"'
					color='secondary'
					icon={<Heart size={100} />}
				/>
				<Card
					text='Write and share reviews and follow friends and other members to read
					theirs'
					color='accent'
					icon={<NotebookText size={100} />}
				/>
				<Card
					text='Rate each album on a five-start scale (with halves) to record and share
					your reaction'
					color='primary'
					icon={<Star size={100} />}
				/>
				<Card
					text='Keep a diary of your film watching and look back on what you felt about that album'
					color='secondary'
					icon={<Calendar size={100} />}
				/>
				<Card
					text='Compile and share lists of albums on any genre and keep a watch list of
					albums to listen to'
					color='accent'
					icon={<TableProperties size={100} />}
				/>
			</div>
		</section>
	);
}

function RecentAlbums() {
	const {
		data: newAlbums,
		isPending,
		isError,
		error,
	} = useAlbumsBySearchQuery('genre:"pop"', 8);

	if (isPending) {
		return <p>Loading...</p>;
	}

	if (isError) {
		return <p>Error loading albums: {error.message}</p>;
	}

	return (
		<section>
			<HeaderDivider
				text='RECENT ALBUMS'
				className='mb-4'
			/>
			<div className='grid w-full grid-cols-4 justify-items-center gap-4'>
				{newAlbums.map((a) => (
					<CoverLink
						key={a.id}
						album={a}
						size={244}
					/>
				))}
			</div>
		</section>
	);
}
