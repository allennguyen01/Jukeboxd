import Layout from '@/pages/Layout';
import Landing from '@/pages/Landing';
import Albums from '@/pages/Albums';
import Album from '@/pages/Album';
import SearchResults from '@/pages/SearchResults';
import Reviews from '@/pages/Reviews';
import Profile from '@/pages/Profile';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path='/'
					element={<Layout />}
				>
					<Route
						index
						element={<Landing />}
					/>
					<Route
						path='/search/:searchInput'
						element={<SearchResults />}
					/>
					<Route
						path='/albums'
						element={<Albums />}
					/>
					<Route
						path='/reviews'
						element={<Reviews />}
					/>
					<Route
						path='/album/:id'
						element={<Album />}
					/>
					<Route
						path='/profile'
						element={<Profile />}
					/>
					<Route
						path='*'
						element={<p>Page not found</p>}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
