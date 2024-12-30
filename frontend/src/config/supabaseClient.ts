import { createClient } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchUser() {
	const { data: user, error } = await supabase.auth.getUser();
	if (error) {
		throw new Error(error.message);
	}
	return user;
}

function useUser() {
	return useQuery({
		queryKey: ['userSession'],
		queryFn: fetchUser,
		staleTime: 1000 * 60 * 5,
		retry: false,
	});
}

export default supabase;
export { useUser };
