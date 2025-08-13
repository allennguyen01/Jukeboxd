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

const usernameSchema = z
	.string()
	.min(3, 'Username must be at least 3 characters')
	.max(20, 'Username must be at most 20 characters')
	.regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed')
	.regex(/^[a-zA-Z]/, 'Username must start with a letter')
	.refine((val) => !val.includes(' '), {
		message: 'Username must not contain spaces',
	});

const formSchema = z.object({
	username: usernameSchema,
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	email: z.email('Invalid email address'),
	location: z.string().optional(),
	website: z.url('Invalid URL').optional(),
	bio: z.string().optional(),
});

export default function Profile() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: '',
			firstName: '',
			lastName: '',
			email: '',
			location: '',
			website: '',
			bio: '',
		},
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
				onSubmit={handleSubmit(onSubmit)}
				className='m-4 grid w-lg grid-cols-2 gap-2 gap-x-4'
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
