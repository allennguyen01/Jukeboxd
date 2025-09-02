import Layout from '@/pages/Layout';
import Landing from '@/pages/Landing';
import Albums from '@/pages/Albums';
import Album from '@/pages/Album';
import SearchResults from '@/pages/SearchResults';
import Reviews from '@/pages/Reviews';
import Profile from './pages/profile/Profile';
import ProfileEdit from './pages/profile/ProfileEdit';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

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
						path='/:username'
						element={<Profile />}
					/>
					<Route
						path='/settings'
						element={<ProfileEdit />}
					/>
					<Route
						path='/404'
						element={<p>Page not found</p>}
					/>
					<Route
						path='*'
						element={
							<Navigate
								to='/404'
								replace
							/>
						}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
