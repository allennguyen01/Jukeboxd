import SignUpModal from '../components/SignUpModal';

export default function Home() {
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
