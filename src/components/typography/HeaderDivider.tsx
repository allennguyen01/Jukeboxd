export default function HeaderDivider({
	text,
	icon,
	className = '',
}: {
	text: string;
	icon?: JSX.Element;
	className?: string;
}) {
	return (
		<div className={`${className}`}>
			<div className='mt-4 flex items-center gap-2'>
				{icon}
				<p>{text}</p>
			</div>
			<div className='divider m-0 h-2 before:bg-neutral-600 after:bg-neutral-600'></div>
		</div>
	);
}
