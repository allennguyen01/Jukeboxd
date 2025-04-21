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
			<DialogHeader className='flex flex-col gap-1'>
				<DialogTitle className='font-light text-slate-100'>
					SIGN IN TO JUKEBOXD
				</DialogTitle>
				<DialogDescription className='text-sm dark:text-slate-300'>
					Enter your email and password to sign in.
				</DialogDescription>
			</DialogHeader>
			<div className='grid gap-4 py-8'>
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
					className='w-1/2 rounded-sm py-2 font-semibold dark:bg-primary-600 dark:text-white dark:hover:bg-primary-800'
					onClick={handleSignIn}
				>
					SIGN IN
				</Button>
			</DialogFooter>
		</>
	);
}

function CreateAccountForm() {
	const [email, setEmail] = useState<string>('');
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [formError, setFormError] = useState<string | null>('');
	const [formSuccess, setFormSuccess] = useState<string | null>('');

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		console.log(
			`Email: ${email}, Username: ${username}, Password: ${password}`,
		);

		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
			options: {
				emailRedirectTo: 'http://localhost:3000/welcome',
			},
		});

		if (error) {
			console.error('Error inserting user:', error);

			setFormError(
				`Error signing up. Please try again. Error: ${error.message}`,
			);
			setFormSuccess(null);
		}

		if (data.user) {
			console.log('User inserted:', data);

			setFormSuccess('User signed up successfully!');
			setFormError(null);
		}
	}

	return (
		<>
			<DialogHeader>
				<DialogTitle className='font-light text-slate-200'>
					JOIN JUKEBOXD
				</DialogTitle>
				<DialogDescription className='text-sm text-slate-400'>
					Enter your email, username, and password to create an account.
				</DialogDescription>
			</DialogHeader>
			<form
				id='create-account-form'
				onSubmit={handleSubmit}
				className='flex flex-col gap-4 py-8'
			>
				<SignUpInput
					label='Email address'
					setValue={setEmail}
				/>
				<SignUpInput
					label='Username'
					setValue={setUsername}
				/>
				<SignUpInput
					label='Password'
					setValue={setPassword}
				/>

				{formError && <p className='text-red-500'>{formError}</p>}
				{formSuccess && <p className='text-green-500'>{formSuccess}</p>}
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

type SignUpInputProps = {
	label: string;
	setValue: (value: string) => void;
};

function SignUpInput({ label, setValue }: SignUpInputProps) {
	const inputWidth: { [key: string]: string } = {
		'Email address': 'max-w-md',
		Username: 'max-w-xs',
		Password: 'max-w-xs',
	};

	const type: { [key: string]: string } = {
		'Email address': 'email',
		Username: 'text',
		Password: 'password',
	};

	return (
		<div className='flex flex-col gap-2'>
			<Label className='font-normal text-white'>{label}</Label>
			<Input
				required
				type={type[label]}
				onChange={(e) => setValue(e.target.value)}
				className={`w-full ${inputWidth[label]} rounded-sm text-neutral-700 focus:bg-white dark:bg-slate-200`}
			/>
		</div>
	);
}
