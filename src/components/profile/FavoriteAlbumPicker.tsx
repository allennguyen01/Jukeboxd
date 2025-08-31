import { useState } from 'react';
import {
	Command,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandItem,
} from '@/components/ui/command';
import { LoaderCircle } from 'lucide-react';
import { useSearchAlbums } from '@/config/spotifyClient';
import { useDebounce } from '@/lib/hooks';

export default function FavoriteAlbumPicker() {
	const [query, setQuery] = useState('');
	const debouncedQuery = useDebounce(query, 500);

	const {
		isLoading,
		isError,
		error,
		data: albums = [],
	} = useSearchAlbums(debouncedQuery);

	return (
		<Command shouldFilter={false}>
			<CommandInput
				onValueChange={setQuery}
				placeholder='Name of album'
			/>
			<CommandList className='max-h-60 overflow-y-auto'>
				{isLoading && (
					<CommandEmpty className='flex h-60 items-center justify-center'>
						<LoaderCircle className='animate-spin' />
					</CommandEmpty>
				)}
				{isError && (
					<CommandEmpty>Error searching: {error.message}</CommandEmpty>
				)}
				{!isLoading && !isError && albums.length === 0 && (
					<CommandEmpty>No results found.</CommandEmpty>
				)}
				{albums.map((album) => (
					<CommandItem
						key={album.id}
						value={album.name}
						onSelect={() => alert(`Selected ${album.name}`)}
					>
						<div>
							<p className='font-medium'>
								{album.name}{' '}
								<span className='font-light'>
									({album.release_date.slice(0, 4)})
								</span>
							</p>
							<p className='text-muted-foreground text-sm'>
								{album.artists.map((artist) => artist.name).join(', ')}
							</p>
						</div>
					</CommandItem>
				))}
			</CommandList>
		</Command>
	);
}
