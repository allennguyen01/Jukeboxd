import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function decadeToRange(decade: number) {
	const start = decade - (decade % 10);
	const end = start + 9;
	return `${start}-${end}`;
}
