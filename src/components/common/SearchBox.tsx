import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaMagnifyingGlass } from 'react-icons/fa6';

export default function SearchBox({
	onSearch,
}: { onSearch?: () => void } = {}) {
	const [searchInput, setSearchInput] = useState('');
	const navigate = useNavigate();

	const handleSearch = () => {
		onSearch?.();
		navigate(`/search/${searchInput}`);
	};

	function performSearch() {
		setSearchInput(
			(document.getElementById('search-input') as HTMLInputElement).value,
		);
		handleSearch();
	}

	return (
		<div className='flex rounded-full'>
			<Input
				id='search-input'
				type='text'
				className='min-w-40 rounded-l-full border-0 focus:bg-white focus:text-black'
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						performSearch();
					}
				}}
				onChange={(e) => setSearchInput(e.target.value)}
			/>
			<Button
				variant='secondary'
				className='rounded-r-full border-0 focus:bg-white'
				onClick={() => {
					performSearch();
				}}
			>
				<FaMagnifyingGlass />
			</Button>
		</div>
	);
}
