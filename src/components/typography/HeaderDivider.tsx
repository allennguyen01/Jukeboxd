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

			<div className='divider m-0 h-2 before:bg-neutral-600 after:bg-neutral-600'></div>
		</div>
	);
}
