import SignUpModal from '@/components/SignUpModal';
import HeaderDivider from '@/components/typography/HeaderDivider';

export default function Landing() {
	return (
		<div className='mb-24 w-full max-w-screen-lg'>
			<Hero />
			<JukeboxdLetsYou />
		</div>
	);
}

function Hero() {
	return (
		<div
			className='blurred-edges hero min-h-[calc(99lvh-4rem)] max-w-screen-xl'
			style={{
				backgroundImage:
					'url(https://media.cnn.com/api/v1/images/stellar/prod/130907221429-jukebox-1942.jpg?q=w_3580,h_2340,x_0,y_0,c_fill)',
			}}
		>
			<div className='hero-overlay bg-opacity-40'></div>
			<div className='hero-content mb-10 items-end text-center'>
				<div className='flex flex-col items-center justify-center gap-6'>
					<p className='mb-5 font-playfair text-5xl font-bold text-white'>
						Track albums you&apos;ve listened to.
						<br />
						Save those you want to hear.
						<br />
						Tell your friends what&apos;s good.
					</p>
					<button
						className='btn btn-primary btn-wide text-lg font-semibold text-white'
						onClick={() =>
							(
								document.getElementById('sign-up-modal') as HTMLDialogElement
							).showModal()
						}
					>
						Get started — it&apos;s free!
					</button>
				</div>
			</div>
			<SignUpModal />
		</div>
	);
}

function JukeboxdLetsYou() {
	function Card({
		text,
		color,
	}: {
		text: string;
		color: 'primary' | 'secondary' | 'accent';
	}) {
		const backgroundColors = {
			primary: 'hover:bg-primary-500',
			secondary: 'hover:bg-secondary-500',
			accent: 'hover:bg-accent-500',
		};

		return (
			<div
				className={`rounded-sm bg-slate-600 p-4 text-slate-100 ${backgroundColors[color]}`}
			>
				{text}
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
				/>
				<Card
					text='Show some love for your favourite albums, playlists, and reviews with
					a "like"'
					color='secondary'
				/>
				<Card
					text='Write and share reviews and follow friends and other members to read
					theirs'
					color='accent'
				/>
				<Card
					text='Rate each album on a five-start scale (with halves) to record and share
					your reaction'
					color='primary'
				/>
				<Card
					text='Keep a diary of your film watching and look back on what you felt about that album'
					color='secondary'
				/>
				<Card
					text='Compile and share lists of albums on any genre and keep a watch list of
					albums to listen to'
					color='accent'
				/>
			</div>
		</section>
	);
}
