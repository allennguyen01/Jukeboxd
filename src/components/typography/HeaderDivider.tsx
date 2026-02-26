import { Separator } from '@/components/ui/separator';
import clsx from 'clsx';

export default function HeaderDivider({
	text,
	className = '',
}: {
	text: string;
	className?: string;
}) {
	return (
		<div
			className={clsx('flex flex-col gap-1 text-sm sm:text-base', className)}
		>
			<p>{text}</p>
			<Separator orientation='horizontal' />
		</div>
	);
}
