import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaMagnifyingGlass, FaAngleDown } from 'react-icons/fa6';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import supabase, { useUser } from '@/config/supabaseClient';
import AuthDialog from './AuthDialog';

export default function NavBar() {
	const { data: user } = useUser();

	return (
		<section className='navbar justify-center bg-zinc-900'>
			<div className='flex w-[1024px] items-center justify-between'>
				<NavLink to='/'>
					<button className='btn h-full gap-4 bg-transparent'>
						<img
							src='/logo.svg'
							className='h-10'
						/>
						<p className='text-3xl font-bold text-white'>Jukeboxd</p>
					</button>
				</NavLink>
				<div className='flex items-center gap-6'>
					{user ? <ProfileDropdown /> : <AuthDialog />}
					<NavLink
						to='/albums'
						className='text-sm font-semibold text-neutral-300 hover:text-white'
					>
						ALBUMS
					</NavLink>
					<NavLink
						to='/reviews'
						className='text-sm font-semibold text-neutral-300 hover:text-white'
					>
						REVIEWS
					</NavLink>
					<SearchBox />
				</div>
			</div>
		</section>
	);
}

function SearchBox() {
	const [searchInput, setSearchInput] = useState('');
	const navigate = useNavigate();

	const handleSearch = () => {
		navigate(`/search/${searchInput}`);
	};

	function performSearch() {
		setSearchInput(
			(document.getElementById('search-input') as HTMLInputElement).value,
		);
		handleSearch();
	}

	return (
		<div className='join rounded-full'>
			<input
				id='search-input'
				type='text'
				className='input join-item input-sm w-24 focus:bg-white focus:text-black md:w-auto'
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						performSearch();
					}
				}}
				onChange={(e) => setSearchInput(e.target.value)}
			/>
			<button
				className='btn join-item btn-sm border-0 focus:bg-white'
				onClick={() => {
					performSearch();
				}}
			>
				<FaMagnifyingGlass />
			</button>
		</div>
	);
}

function ProfileDropdown() {
	async function handleSignOut() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('Sign out error:', error.message);
			return;
		}

		window.location.reload();
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className='flex h-8 w-32 items-center justify-center gap-2 rounded p-0 text-sm font-semibold text-neutral-300 hover:text-white data-[state=open]:bg-slate-400 data-[state=open]:text-white'>
				PROFILE <FaAngleDown />
			</DropdownMenuTrigger>
			<DropdownMenuContent className='rounded-sm border-0 bg-slate-400 p-0 text-slate-900'>
				<DropdownMenuItem className='m-0 rounded-none hover:cursor-pointer hover:bg-slate-500 hover:text-slate-300'>
					Edit profile
				</DropdownMenuItem>
				<DropdownMenuItem
					className='m-0 rounded-none hover:cursor-pointer hover:bg-slate-500 hover:text-slate-300'
					onClick={handleSignOut}
				>
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
