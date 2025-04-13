import { openAIConfig } from '@/config/openAI';
import { reviewsToString } from '@/lib/utils';
import { AlbumReview } from '@/types/supabaseTypes';

export type Recommendation = {
	album: string;
	artist: string;
};

const exampleTasteProfile =
	'The user has a preference for popular music, with a particular liking for pop and R&B. They appreciate high-quality music, often referring to albums as "masterpieces". They have a fondness for live music, as shown by their positive review of a concert. They also value artists from the past, as seen in their praise for Michael Jackson and older Kanye West music. However, they appear to be critical of more recent works by Kanye West. They also show a high regard for SZA, appreciating her contribution to the R&B genre.';

const exampleRecommendations = [
	{
		album: 'Off the Wall',
		artist: 'Michael Jackson',
	},
	{
		album: 'The Fame Monster',
		artist: 'Lady Gaga',
	},
	{
		album: '25',
		artist: 'Adele',
	},
	{
		album: 'Ctrl',
		artist: 'SZA',
	},
	{
		album: 'Late Registration',
		artist: 'Kanye West',
	},
];

const fetchTasteProfile = async (reviews: AlbumReview[]): Promise<string> => {
	const reviewsString = reviewsToString(reviews);

	const promptTaste = `Below are the reviews and ratings for albums a user has listened to:
${reviewsString}

Please provide a concise summary of the user's musical tastes and preferences, highlighting key genres, moods, and unique characteristics.`;

	const response = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			// TODO: create proxy server to NOT expose API key in production client-side code!
			Authorization: `Bearer ${openAIConfig.apiKey}`,
		},
		body: JSON.stringify({
			model: 'gpt-4', // You may use "gpt-3.5-turbo" if preferred
			messages: [{ role: 'user', content: promptTaste }],
			temperature: 0.5,
			max_tokens: 150,
		}),
	});
	const data = await response.json();
	return data.choices[0].message.content;
};

const fetchRecommendations = async (
	tasteProfile: string,
	reviews: string,
): Promise<Recommendation[] | string> => {
	const promptRec = `Based on the following user taste profile:
${tasteProfile}

And the following album reviews:
${reviews}

Please recommend 5 albums that match these tastes, but do not recommend albums that are already in the list above. Return your response in JSON format as an array where each element is an object with keys "album" and "artist".`;

	const response = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${openAIConfig.apiKey}`,
		},
		body: JSON.stringify({
			model: 'gpt-4',
			messages: [{ role: 'user', content: promptRec }],
			temperature: 0.7,
			max_tokens: 250,
		}),
	});
	const data = await response.json();
	const content: string = data.choices[0].message.content;

	// Parse the returned JSON; if parsing fails, return the raw content
	try {
		const jsonResponse: Recommendation[] = JSON.parse(content);
		return jsonResponse;
	} catch (error) {
		console.error('JSON parsing error:', error);
		return content;
	}
};

export { fetchTasteProfile, fetchRecommendations };
