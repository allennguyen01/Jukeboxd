import { useState, MouseEvent, FormEvent } from 'react';
import { Button } from './ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsTrigger, TabsList, TabsContent } from './ui/tabs';
import supabase from '@/config/supabaseClient';
import { cn } from '@/lib/utils';

type AuthDialogProps = {
	TriggerButton: JSX.Element;
};

export default function AuthDialog({ TriggerButton }: AuthDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>{TriggerButton}</DialogTrigger>
			<Tabs
				defaultValue='sign-in'
				className='w-full'
			>
				<DialogContent
					className='border-0 bg-slate-700 px-8 py-8 sm:max-w-[425px]'
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
					<TabsContent value='sign-in'>
						<SignInForm />
					</TabsContent>
					<TabsContent value='create-account'>
						<CreateAccountForm />
					</TabsContent>
				</DialogContent>
			</Tabs>
		</Dialog>
	);
}

function SignInForm() {
	const [formFeedback, setFormFeedback] = useState<{
		error: string;
		success: string;
	}>({
		error: '',
		success: '',
	});

	const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();

		if (!email || !password) {
			setFormFeedback({
				error: 'Please fill in all fields.',
				success: '',
			});
			return;
		}

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
			setTimeout(() => {
				window.location.reload();
			}, 2000);
		}
	};

	return (
		<>
			<DialogHeader className='flex flex-col gap-1'>
				<DialogTitle className='font-light text-slate-100'>
					SIGN IN TO JUKEBOXD
				</DialogTitle>
				<DialogDescription className='text-sm dark:text-slate-300'>
					Enter your email and password to sign in.
				</DialogDescription>
			</DialogHeader>
			<form
				id='sign-in'
				className='grid gap-4 py-8'
				onSubmit={handleSignIn}
			>
				<AuthInput
					label='Email address'
					type='email'
					id='email'
				/>
				<AuthInput
					label='Password'
					type='password'
					id='password'
				/>

				{formFeedback.error && (
					<p className='text-red-500'>{formFeedback.error}</p>
				)}
				{formFeedback.success && (
					<p className='text-green-500'>{formFeedback.success}</p>
				)}
			</form>
			<DialogFooter>
				<Button
					type='submit'
					form='sign-in'
					className='w-1/2 rounded-sm py-2 font-semibold dark:bg-primary-600 dark:text-white dark:hover:bg-primary-800'
				>
					SIGN IN
				</Button>
			</DialogFooter>
		</>
	);
}

function CreateAccountForm() {
	const [formFeedback, setFormFeedback] = useState<{
		error: string | null;
		success: string | null;
	}>({
		error: null,
		success: null,
	});

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();
		const confirmPassword = formData.get('confirm-password')?.toString();

		if (!email || !password) {
			setFormFeedback({
				error: 'Please fill in all fields.',
				success: null,
			});
			return;
		}

		if (password !== confirmPassword) {
			setFormFeedback({
				error: 'Passwords do not match.',
				success: null,
			});
			return;
		}

		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
		});

		if (error) {
			console.error('Error inserting user:', error);
			setFormFeedback({
				error: `Error signing up. Please try again. Error: ${error.message}`,
				success: null,
			});
		}

		if (data.user) {
			console.log('User inserted:', data);
			setFormFeedback({
				success: 'User signed up successfully!',
				error: null,
			});
			setTimeout(() => {
				window.location.reload();
			}, 2000);
		}
	}

	return (
		<>
			<DialogHeader>
				<DialogTitle className='font-light text-slate-200'>
					JOIN JUKEBOXD
				</DialogTitle>
				<DialogDescription className='text-sm dark:text-slate-300'>
					Enter your email, username, and password to create an account.
				</DialogDescription>
			</DialogHeader>
			<form
				id='create-account-form'
				onSubmit={handleSubmit}
				className='flex flex-col gap-4 py-8'
			>
				<AuthInput
					label='Email address'
					id='email'
					type='email'
				/>
				<AuthInput
					label='Password'
					id='password'
					type='password'
				/>
				<AuthInput
					label='Confirm password'
					id='confirm-password'
					type='password'
				/>

				{formFeedback.error && (
					<p className='text-red-500'>{formFeedback.error}</p>
				)}
				{formFeedback.success && (
					<p className='text-green-500'>{formFeedback.success}</p>
				)}
			</form>
			<DialogFooter className='flex flex-col items-center justify-center'>
				<Button
					type='submit'
					form='create-account-form'
					className='w-1/2 rounded-sm dark:bg-secondary-600 dark:text-white dark:hover:bg-secondary-800'
				>
					CREATE ACCOUNT
				</Button>
			</DialogFooter>
		</>
	);
}

type AuthInputProps = {
	label: string;
	type: string;
	id: string;
};

function AuthInput({ label, type, id }: AuthInputProps) {
	const inputWidth: { [key: string]: string } = {
		email: 'max-w-md',
		password: 'max-w-xs',
	};

	return (
		<div className='flex flex-col gap-2'>
			<Label
				htmlFor={id}
				className='font-normal text-white'
			>
				{label}
			</Label>
			<Input
				required
				id={id}
				name={id}
				type={type}
				className={cn(
					'w-full rounded-sm text-neutral-700 focus:bg-white dark:bg-slate-200',
					inputWidth[type],
				)}
			/>
		</div>
	);
}
