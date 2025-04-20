import { useState, MouseEvent } from 'react';
import { Button } from './ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsTrigger, TabsList, TabsContent } from './ui/tabs';
import supabase from '@/config/supabaseClient';

export default function AuthDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					className='p-4 text-neutral-300 hover:bg-transparent hover:text-white'
					variant='ghost'
				>
					SIGN IN
				</Button>
			</DialogTrigger>
			<Tabs
				defaultValue='sign-in'
				className='w-full'
			>
				<DialogContent
					className='border-0 bg-slate-700 sm:max-w-[425px]'
					aria-describedby='Sign in form'
				>
					<TabsList className='mb-2 w-full justify-between'>
						<TabsTrigger
							value='sign-in'
							className='w-full'
						>
							SIGN IN
						</TabsTrigger>
						<TabsTrigger
							value='create-account'
							className='w-full'
						>
							CREATE ACCOUNT
						</TabsTrigger>
					</TabsList>
					<TabsContent
						value='sign-in'
						className='flex flex-col gap-6'
					>
						<SignInForm />
					</TabsContent>
					<TabsContent value='create-account'>
						<div>Create account</div>
					</TabsContent>
				</DialogContent>
			</Tabs>
		</Dialog>
	);
}

function SignInForm() {
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
		<>
			<DialogHeader className='flex flex-row items-center justify-between'>
				<DialogTitle className='font-light text-slate-200'>
					SIGN IN TO JUKEBOXD
				</DialogTitle>
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
					className='h-8 w-1/3 rounded-sm py-2 font-semibold dark:bg-primary-600 dark:text-white dark:hover:bg-primary-800'
					onClick={handleSignIn}
				>
					SIGN IN
				</Button>
			</DialogFooter>
		</>
	);
}
