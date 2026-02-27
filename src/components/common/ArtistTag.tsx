export default function ArtistTag({
	artist,
}: {
	artist: SpotifyApi.ArtistObjectSimplified;
}) {
	return (
		<a
			key={artist.id}
			className='hover:bg-accent-700 rounded-sm bg-gray-700 px-2 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-slate-300'
			href={`/search/${artist.name}`}
		>
			{artist.name}
		</a>
	);
}
