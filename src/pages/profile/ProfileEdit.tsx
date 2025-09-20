import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import FavoriteAlbumPicker from '@/components/profile/FavoriteAlbumPicker';
import { PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import FormFeedback from '@/components/common/FormFeedback';

import {
	useProfileInfo,
	useUpsertProfile,
	useFavoriteAlbumByRank,
} from '@/config/supabaseClient';
import { UserProfile } from '@/types/supabaseTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { z } from 'zod';

const usernameSchema = z
	.string()
	.min(3, 'Username must be at least 3 characters')
	.max(20, 'Username must be at most 20 characters')
	.regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed')
	.regex(/^[a-zA-Z]/, 'Username must start with a letter')
	.refine((val) => !val.includes(' '), {
		message: 'Username must not contain spaces',
	});

function emptyToNull<T extends z.ZodTypeAny>(schema: T) {
	return z.union([z.literal('').transform(() => null), schema.nullable()]);
}

const formSchema = z.object({
	username: usernameSchema,
	firstName: emptyToNull(
		z.string().max(50, 'First name must be at most 50 characters'),
	),
	lastName: emptyToNull(
		z.string().max(50, 'Last name must be at most 50 characters'),
	),
	email: emptyToNull(z.email()),
	location: emptyToNull(z.string()),
	website: emptyToNull(z.url()),
	bio: emptyToNull(z.string().max(250, 'Bio must be at most 250 characters')),
});

export default function ProfileEdit() {
	const { isLoading: isLoadingUserData, data: userData } = useProfileInfo();

	if (isLoadingUserData || !userData) {
		return (
			<div className='flex h-full items-center justify-center'>Loading...</div>
		);
	}

	return (
		<div className='my-8 flex w-5xl flex-col gap-4'>
			<h1 className='text-2xl font-semibold'>Your Profile</h1>
			<hr className='border-t border-slate-500'></hr>
			<div className='flex justify-between'>
				<ProfileForm userData={userData} />
				<FourFavoriteAlbums />
			</div>
		</div>
	);
}

function ProfileForm({ userData }: { userData: UserProfile }) {
	const { mutate: updateProfile } = useUpsertProfile();
	const [formFeedback, setFormFeedback] = useState<{
		message: string;
		isSuccess: boolean;
	} | null>(null);

	const {
		id: currentUserID,
		username,
		first_name,
		last_name,
		email,
		location,
		website,
		bio,
	} = userData;

	const defaultValues = {
		username: username,
		firstName: first_name ?? '',
		lastName: last_name ?? '',
		email: email ?? '',
		location: location ?? '',
		website: website ?? '',
		bio: bio ?? '',
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const { handleSubmit, control } = form;

	function onSubmit(values: z.infer<typeof formSchema>) {
		setFormFeedback(null);

		const {
			username,
			firstName: first_name,
			lastName: last_name,
			email,
			location,
			website,
			bio,
		} = values;

		const newProfile = {
			id: currentUserID,
			username,
			first_name,
			last_name,
			email,
			location,
			website,
			bio,
		};

		updateProfile(newProfile, {
			onSuccess: () => {
				setFormFeedback({
					message: 'Profile updated successfully!',
					isSuccess: true,
				});
			},
			onError: (error) => {
				console.error(error);
				setFormFeedback({
					message: `Failed to update profile: ${error.message}`,
					isSuccess: false,
				});
			},
		});
	}

	return (
		<Form {...form}>
			<form
				key={userData.id} // Ensure the form re-renders when userData changes
				onSubmit={handleSubmit(onSubmit)}
				className='grid grid-cols-2 gap-2 gap-x-4'
			>
				<FormField
					control={control}
					name='username'
					render={({ field }) => (
						<ProfileInput
							field={field}
							label='Username'
							className='col-span-2'
						/>
					)}
				/>
				<FormField
					control={control}
					name='firstName'
					render={({ field }) => (
						<ProfileInput
							field={field}
							label='First name'
						/>
					)}
				/>
				<FormField
					control={control}
					name='lastName'
					render={({ field }) => (
						<ProfileInput
							field={field}
							label='Last name'
						/>
					)}
				/>
				<FormField
					control={control}
					name='email'
					render={({ field }) => (
						<ProfileInput
							field={field}
							label='Email address'
							className='col-span-2'
						/>
					)}
				/>
				<FormField
					control={control}
					name='location'
					render={({ field }) => (
						<ProfileInput
							field={field}
							label='Location'
						/>
					)}
				/>
				<FormField
					control={control}
					name='website'
					render={({ field }) => (
						<ProfileInput
							field={field}
							label='Website'
						/>
					)}
				/>
				<FormField
					control={control}
					name='bio'
					render={({ field }) => (
						<ProfileInput
							field={field}
							label='Bio'
							isTextarea
							className='col-span-2'
						/>
					)}
				/>
				<FormFeedback formFeedback={formFeedback} />
				<Button
					type='submit'
					size='sm'
					className='mt-4'
				>
					Save Changes
				</Button>
			</form>
		</Form>
	);
}

function ProfileInput({
	field,
	label,
	isTextarea = false,
	className = '',
}: {
	field: ControllerRenderProps<any, any>;
	label: string;
	isTextarea?: boolean;
	className?: string;
}) {
	return (
		<FormItem className={className}>
			<FormLabel>{label}</FormLabel>
			<FormControl>
				{isTextarea ? (
					<Textarea
						{...field}
						className='h-48'
					/>
				) : (
					<Input {...field} />
				)}
			</FormControl>
			<FormMessage />
		</FormItem>
	);
}

function FourFavoriteAlbums() {
	return (
		<div className='flex flex-col gap-2'>
			<h3 className='text-lg'>Favorite Albums</h3>
			<div className='grid grid-cols-2 gap-4'>
				<FavoriteAlbum rank={1} />
				<FavoriteAlbum rank={2} />
				<FavoriteAlbum rank={3} />
				<FavoriteAlbum rank={4} />
			</div>
		</div>
	);
}

function FavoriteAlbum({ rank }: { rank: number }) {
	const [open, setOpen] = useState(false);
	const [formFeedback, setFormFeedback] = useState<{
		message: string;
		isSuccess: boolean;
	} | null>(null);

	const { data: favAlbum } = useFavoriteAlbumByRank(rank);

	function closeDialog() {
		setOpen(false);
	}

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger className='flex size-[200px] items-center justify-center rounded-lg bg-slate-600 hover:cursor-pointer hover:bg-slate-700'>
				{favAlbum ? (
					<img
						src={favAlbum.images[0].url}
						alt={`${favAlbum.name} album cover`}
						className='rounded'
					/>
				) : (
					<PlusCircle size={24} />
				)}
			</DialogTrigger>
			<DialogContent
				className='flex flex-col gap-4'
				aria-describedby='Pick a favorite album'
			>
				<DialogHeader>
					<DialogTitle>Pick a favorite album</DialogTitle>
				</DialogHeader>
				<FavoriteAlbumPicker
					rank={rank}
					closeDialog={closeDialog}
					setFormFeedback={setFormFeedback}
				/>
				<FormFeedback
					formFeedback={formFeedback}
					className='rounded bg-red-50 px-1 py-2'
				/>
			</DialogContent>
		</Dialog>
	);
}
