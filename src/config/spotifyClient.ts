import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from 'axios';
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

async function getAccessToken() {
	const headers = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		auth: {
			username: SPOTIFY_CLIENT_ID,
			password: SPOTIFY_CLIENT_SECRET,
		},
	};

	const data = {
		grant_type: 'client_credentials',
	};

	const response = await axios.post(
		'https://accounts.spotify.com/api/token',
		data,
		headers,
	);
	return response.data.access_token;
}

async function createSpotifyClient() {
	const accessToken = await getAccessToken();

	const instance = axios.create({
		baseURL: 'https://api.spotify.com/v1/',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});

	return instance;
}

function useAlbum(id: string): UseQueryResult<SpotifyApi.SingleAlbumResponse> {
	function getAlbum() {
		return spotifyClient.get(`albums/${id}`).then((res) => res.data);
	}

	return useQuery({
		queryKey: ['album', id],
		queryFn: getAlbum,
	});
}

function useAlbumGenres(
	album: SpotifyApi.SingleAlbumResponse,
): UseQueryResult<string[]> {
	function getAlbumGenres(album: SpotifyApi.SingleAlbumResponse) {
		const artistsList = album.artists.map((artist) => artist.id).join(',');

		const artistGenres = spotifyClient
			.get(`artists?ids=${artistsList}`)
			.then((res) =>
				res.data.artists
					.map((artist: SpotifyApi.ArtistObjectFull) => artist.genres)
					.flat()
					.join(', '),
			);

		return artistGenres;
	}

	return useQuery({
		queryKey: ['albumGenres', album.id],
		queryFn: () => {
			return getAlbumGenres(album);
		},
	});
}

function useSearchAlbums(searchInput: string) {
	function search(): Promise<SpotifyApi.AlbumObjectSimplified[]> {
		return spotifyClient
			.get(`https://api.spotify.com/v1/search?type=album&q=${searchInput}`)
			.then((res) =>
				res.data.albums.items.filter(
					(item: { album_type: string }) => item.album_type === 'album',
				),
			);
	}

	return useQuery({
		queryKey: ['search', searchInput],
		queryFn: search,
	});
}

function useAlbumsBySearchQuery(searchQuery: string, limit = 20) {
	function filterNAlbums(
		data: SpotifyApi.SearchResponse,
		n: number,
	): SpotifyApi.AlbumObjectSimplified[] {
		const items = data.tracks?.items;
		if (!items) return [];

		const itemAlbums = items.map((item) => item.album);
		const seen = new Set();
		const itemsFiltered = itemAlbums.filter((album) => {
			const duplicate = seen.has(album.id);
			seen.add(album.id);
			return !duplicate && album.album_type === 'album';
		});
		return itemsFiltered.slice(0, n);
	}

	async function fetchAlbumsBySearchQuery(query: string, n: number) {
		const res = await spotifyClient.get(
			`/search?q=${query}&type=track&market=US&limit=50`,
		);
		return filterNAlbums(res.data, n);
	}

	return useQuery({
		queryKey: ['spotifyAlbums', searchQuery, limit],
		queryFn: () => fetchAlbumsBySearchQuery(searchQuery, limit),
		enabled: !!searchQuery, // only fetch when query is non-empty
	});
}

const spotifyClient = await createSpotifyClient();
export default spotifyClient;
export { useAlbum, useAlbumGenres, useSearchAlbums, useAlbumsBySearchQuery };
