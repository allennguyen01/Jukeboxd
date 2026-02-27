import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import supabase, { useUser, useProfileInfo } from '@/config/supabaseClient';
import { User } from '@supabase/supabase-js';

import { FaAngleDown } from 'react-icons/fa6';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetClose,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import AuthDialog from './AuthDialog';
import { Button } from './ui/button';
import SearchBox from './common/SearchBox';

export default function NavBar() {
	const { data: user } = useUser();

	return (
		<section className='flex min-h-20 w-full justify-center bg-zinc-900'>
			<div className='flex w-full max-w-[1024px] items-center justify-between px-4'>
				<NavLink to='/'>
					<LogoButton />
				</NavLink>
				{/* desktop nav */}
				<DesktopNav user={user} />
				{/* mobile nav */}
				<MobileMenu user={user} />
			</div>
		</section>
	);
}

function DesktopNav({ user }: { user: User | null | undefined }) {
	return (
		<section className='hidden items-center gap-6 lg:flex'>
			{user ? (
				<ProfileDropdown />
			) : (
				<AuthDialog
					TriggerButton={
						<Button
							className='p-4 text-neutral-300 hover:bg-transparent hover:text-white'
							variant='ghost'
						>
							SIGN IN
						</Button>
					}
				/>
			)}
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
		</section>
	);
}

function MobileMenu({ user }: { user: User | null | undefined }) {
	const [sheetOpen, setSheetOpen] = useState(false);

	return (
		<Sheet
			open={sheetOpen}
			onOpenChange={setSheetOpen}
		>
			<SheetTrigger asChild>
				<Button
					variant='ghost'
					className='p-2 text-white lg:hidden'
				>
					☰
				</Button>
			</SheetTrigger>

			<SheetContent
				side='right'
				className='bg-slate-900 text-white'
			>
				<SheetHeader>
					<SheetTitle>Menu</SheetTitle>
				</SheetHeader>
				<nav className='mt-8 flex flex-col gap-6'>
					<SearchBox onSearch={() => setSheetOpen(false)} />

					{user ? (
						<ProfileDropdown />
					) : (
						<AuthDialog
							TriggerButton={
								<Button
									variant='ghost'
									className='justify-start p-0 text-base'
								>
									SIGN IN
								</Button>
							}
						/>
					)}

					<section className='flex flex-col gap-4'>
						<SheetClose asChild>
							<NavLink
								to='/albums'
								className='font-semibold'
							>
								ALBUMS
							</NavLink>
						</SheetClose>

						<SheetClose asChild>
							<NavLink
								to='/reviews'
								className='font-semibold'
							>
								REVIEWS
							</NavLink>
						</SheetClose>
					</section>
				</nav>
			</SheetContent>
		</Sheet>
	);
}

function LogoButton() {
	return (
		<Button
			variant='ghost'
			className='h-full lg:gap-4'
		>
			<img
				src='/logo.svg'
				className='h-4 lg:h-10'
			/>
			<p className='text-xl font-bold text-white lg:text-3xl'>Jukeboxd</p>
		</Button>
	);
}

async function handleSignOut() {
	const { error } = await supabase.auth.signOut();
	if (error) {
		console.error('Sign out error:', error.message);
		return;
	}

	window.location.reload();
}

function ProfileDropdown() {
	const { isLoading: isLoadingUserData, data: userData } = useProfileInfo();
	const { username } = userData || {};

	if (isLoadingUserData) {
		return (
			<div className='flex h-8 w-28 animate-pulse items-center justify-center text-sm text-neutral-100'>
				LOADING...
			</div>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className='flex h-8 w-fit min-w-0 shrink-0 items-center justify-start gap-2 rounded px-2 py-0 text-sm font-semibold whitespace-nowrap text-neutral-300 hover:text-white data-[state=open]:bg-slate-400 data-[state=open]:text-white'>
				{username.toUpperCase()} <FaAngleDown />
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-[var(--radix-dropdown-menu-trigger-width)] min-w-[var(--radix-dropdown-menu-trigger-width)] rounded-sm border-0 bg-slate-800 p-0'>
				<NavLink to={`/${username}`}>
					<DropdownMenuItem className='h-12 rounded-none font-semibold hover:cursor-pointer hover:bg-slate-500 hover:text-slate-300'>
						PROFILE
					</DropdownMenuItem>
				</NavLink>
				<DropdownMenuItem
					className='h-12 rounded-none font-semibold hover:cursor-pointer hover:bg-slate-500 hover:text-slate-300'
					onClick={handleSignOut}
				>
					SIGN OUT
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
