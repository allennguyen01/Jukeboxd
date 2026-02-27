import NavBar from '../components/NavBar.jsx';
import { Outlet } from 'react-router-dom';

export default function Layout() {
	return (
		<div className='font-inter flex flex-col items-center justify-center'>
			<NavBar />
			<main className='flex w-full max-w-5xl flex-col items-center justify-center overflow-x-visible px-4 py-6 lg:py-8'>
				<Outlet />
			</main>
		</div>
	);
}
