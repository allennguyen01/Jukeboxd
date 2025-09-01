import { clsx } from 'clsx';

export default function FormFeedback({
	formFeedback,
	className,
}: {
	formFeedback: { message: string; isSuccess: boolean } | null;
	className?: string;
}) {
	if (!formFeedback) return null;

	return (
		<p
			className={clsx(
				'col-span-2 mt-2 text-sm',
				{
					'text-green-500': formFeedback.isSuccess,
					'text-red-500': !formFeedback.isSuccess,
				},
				className,
			)}
		>
			{formFeedback.message}
		</p>
	);
}
