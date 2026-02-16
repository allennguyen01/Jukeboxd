import { Toggle } from './ui/toggle';
import { Ear } from 'lucide-react';
import clsx from 'clsx';
import { Label } from '@radix-ui/react-dropdown-menu';

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
				className='data-[state=on]:text-neutral-content flex h-full flex-col hover:bg-transparent data-[state=on]:bg-transparent'
			>
				<Label className='text-base font-medium text-slate-300'>
					{!checked ? 'Listen' : 'Listened'}
				</Label>
				<Ear
					className={clsx('stroke-white', {
						'fill-secondary-600': checked,
					})}
				/>
			</Toggle>
		</div>
	);
}
