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
	return (
		<div className='flex flex-col items-center gap-1'>
			<Toggle
				aria-checked={checked}
				onClick={() => {
					setChecked(!checked);
				}}
				className='flex h-min flex-col hover:bg-transparent data-[state=on]:bg-transparent data-[state=on]:text-neutral-content'
			>
				<p className='text-base font-normal'>
					{!checked ? 'Listen' : 'Listened'}
				</p>
				<Ear
					size={32}
					className={clsx({
						'fill-secondary-600 stroke-white': checked,
					})}
				/>
			</Toggle>
		</div>
	);
}
