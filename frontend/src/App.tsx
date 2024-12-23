import { useEffect } from 'react';
import Layout from './pages/Layout';
import Login from './pages/Login';
import Albums from './pages/Albums';
import SearchResults from './pages/SearchResults';
import Reviews from './pages/Reviews';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import supabase from './config/supabaseClient';

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
						element={<Login />}
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
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
