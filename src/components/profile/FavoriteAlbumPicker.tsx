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
import { useUpsertFavorite } from '@/config/supabaseClient';

export default function FavoriteAlbumPicker({
	rank,
	closeDialog,
	setFormFeedback,
}: {
	rank: number;
	closeDialog: () => void;
	setFormFeedback: (
		feedback: { message: string; isSuccess: boolean } | null,
	) => void;
}) {
	const [query, setQuery] = useState('');
	const debouncedQuery = useDebounce(query, 500);

	const {
		isLoading,
		isError,
		error,
		data: albums = [],
	} = useSearchAlbums(debouncedQuery);

	const { mutate: addFavorite } = useUpsertFavorite();

	function onSelect(album: SpotifyApi.AlbumObjectSimplified) {
		const favorite = {
			album_id: album.id,
			rank,
		};

		addFavorite(favorite, {
			onSuccess: () => {
				setFormFeedback({
					message: 'Favorite added successfully!',
					isSuccess: true,
				});
				closeDialog();
			},
			onError: (error) => {
				console.error(error);
				setFormFeedback({
					message: `Failed to add favorite: ${error.message}`,
					isSuccess: false,
				});
			},
		});
	}

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
						onSelect={() => onSelect(album)}
						className='flex flex-col items-start gap-1 hover:cursor-pointer hover:text-slate-900'
					>
						<p className='font-medium'>
							{album.name}{' '}
							<span className='font-light'>
								({album.release_date.slice(0, 4)})
							</span>
						</p>
						<p className='text-xs'>
							{album.artists.map((artist) => artist.name).join(', ')}
						</p>
					</CommandItem>
				))}
			</CommandList>
		</Command>
	);
}
