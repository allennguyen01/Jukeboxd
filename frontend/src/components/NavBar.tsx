import { useState, MouseEvent, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaMagnifyingGlass, FaAngleDown } from 'react-icons/fa6';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import supabase from '@/config/supabaseClient';

export default function NavBar() {
	const [userSignedIn, setUserSignedIn] = useState<boolean>(false);

	useEffect(() => {
		async function checkUser() {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				setUserSignedIn(true);
			} else {
				setUserSignedIn(false);
			}
		}

		checkUser();
	}, []);

	return (
		<section className='navbar justify-center bg-zinc-900'>
			<div className='flex w-[1024px] items-center justify-between'>
				<NavLink to='/'>
					<button className='btn h-full gap-4 bg-transparent'>
						<img
							src='../../public/logo.svg'
							className='h-10'
						/>
						<p className='text-3xl font-bold text-white'>Jukeboxd</p>
					</button>
				</NavLink>
				<div className='flex items-center gap-6'>
					{userSignedIn ? <ProfileDropdown /> : <SignInDialog />}
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

function SignInDialog() {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [formFeedback, setFormFeedback] = useState<{
		error: string;
		success: string;
	}>({
		error: '',
		success: '',
	});

	const handleSignIn = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			console.error('Sign in error:', error.message);
			setFormFeedback({ error: error.message, success: '' });
			return;
		}

		if (data) {
			setFormFeedback({ error: '', success: 'Signed in successfully!' });
			window.location.reload();
		}
	};

	const inputs = [
		{
			label: 'Email',
			type: 'email',
			id: 'email',
		},
		{
			label: 'Password',
			type: 'password',
			id: 'password',
		},
	];

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className='p-0 text-neutral-300 hover:text-white'>
					SIGN IN
				</Button>
			</DialogTrigger>
			<DialogContent
				className='border-0 bg-slate-700 sm:max-w-[425px]'
				aria-describedby='Sign in form'
			>
				<DialogHeader>
					<DialogTitle className='font-light'>SIGN IN TO JUKEBOXD</DialogTitle>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					{inputs.map(({ label, type, id }) => (
						<div
							key={label}
							className='flex flex-col gap-2'
						>
							<Label
								htmlFor={id}
								className='font-normal text-white'
							>
								{label}
							</Label>
							<Input
								id={id}
								type={type}
								onChange={(e) =>
									label === 'Email'
										? setEmail(e.target.value)
										: setPassword(e.target.value)
								}
								className='focus:border-1 col-span-3 rounded-sm bg-slate-300 text-slate-600 focus:bg-white focus:text-black'
							/>
						</div>
					))}

					{formFeedback.error && (
						<p className='text-red-500'>{formFeedback.error}</p>
					)}
					{formFeedback.success && (
						<p className='text-green-500'>{formFeedback.success}</p>
					)}
				</div>
				<DialogFooter>
					<Button
						type='submit'
						className='h-8 rounded-sm bg-primary-600 py-2 font-semibold hover:bg-primary-800'
						onClick={handleSignIn}
					>
						SIGN IN
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
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
