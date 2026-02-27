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
		<Toggle
			aria-checked={checked}
			onClick={handleToggle}
			className='data-[state=on]:text-neutral-content flex h-full w-20 flex-col p-0 hover:cursor-pointer hover:bg-transparent data-[state=on]:bg-transparent'
		>
			<Label className='text-sm font-medium text-slate-300 sm:text-base'>
				{!checked ? 'Listen' : 'Listened'}
			</Label>
			<Ear
				className={clsx('size-6 stroke-white stroke-1', {
					'fill-secondary-600': checked,
				})}
			/>
		</Toggle>
	);
}
