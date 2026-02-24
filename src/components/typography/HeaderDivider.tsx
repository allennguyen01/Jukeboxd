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
		<div className={clsx('flex flex-col gap-1', className)}>
			<p className='text-sm sm:text-base'>{text}</p>
			<Separator orientation='horizontal' />
		</div>
	);
}
