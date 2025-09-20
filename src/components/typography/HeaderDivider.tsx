import { Separator } from '@/components/ui/separator';

export default function HeaderDivider({
	text,
	className = '',
}: {
	text: string;
	className?: string;
}) {
	return (
		<div className={`${className}`}>
			<p className='mt-4'>{text}</p>

			<Separator orientation='horizontal' />
		</div>
	);
}
