import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useProfileInfoById } from '@/config/supabaseClient';
import { UserProfile } from '@/types/supabaseTypes';

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
	bio: emptyToNull(z.string().max(160, 'Bio must be at most 160 characters')),
});

export default function Profile() {
	// You can fetch the user's profile data here and set it as default values
	const { isLoading: isLoadingUserData, data: userData } = useProfileInfoById();

	if (isLoadingUserData || !userData) {
		return (
			<div className='flex h-full items-center justify-center'>Loading...</div>
		);
	}

	return <ProfileForm userData={userData} />;
}

function ProfileForm({ userData }: { userData: UserProfile }) {
	const { username, first_name, last_name, email, location, website, bio } =
		userData;

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
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	}

	return (
		<Form {...form}>
			<form
				key={userData.id} // Ensure the form re-renders when userData changes
				onSubmit={handleSubmit(onSubmit)}
				className='m-4 grid w-md grid-cols-2 gap-2 gap-x-4'
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
				{isTextarea ? <Textarea {...field} /> : <Input {...field} />}
			</FormControl>
			<FormMessage />
		</FormItem>
	);
}
