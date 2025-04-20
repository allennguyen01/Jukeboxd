import { Toggle } from './ui/toggle';
import { Ear } from 'lucide-react';
import clsx from 'clsx';

export default function IconToggle({
	checked,
	setChecked,
}: {
	checked: boolean;
	setChecked: (checked: boolean) => void;
}) {
	function handleToggle() {
		setChecked(!checked);
	}

	return (
		<div className='flex w-20 flex-col items-center gap-1'>
			<Toggle
				aria-checked={checked}
				onClick={handleToggle}
				className='flex h-full flex-col dark:hover:bg-transparent dark:data-[state=on]:bg-transparent dark:data-[state=on]:text-neutral-content'
			>
				<p className='text-base font-normal'>
					{!checked ? 'Listen' : 'Listened'}
				</p>
				<Ear
					className={clsx('stroke-white', {
						'fill-secondary-600': checked,
					})}
				/>
			</Toggle>
		</div>
	);
}
