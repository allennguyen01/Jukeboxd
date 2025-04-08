/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'selector',
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				playfair: ['"Playfair Display"', 'serif'],
				inter: ['Inter', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			colors: {
				primary: {
					50: '#fff0f3',
					100: '#ffdde4',
					200: '#ffc0cd',
					300: '#ff94aa',
					400: '#ff577a',
					500: '#ff2350',
					600: '#ff073a',
					700: '#d7002c',
					800: '#b10327',
					900: '#920a26',
					950: '#500010',
				},
				secondary: {
					50: '#fcf2ff',
					100: '#f8e3ff',
					200: '#f1c6ff',
					300: '#eb9aff',
					400: '#e05eff',
					500: '#ce22ff',
					600: '#bc13fe',
					700: '#9900ce',
					800: '#7e00a8',
					900: '#6b0788',
					950: '#48005e',
				},
				accent: {
					50: '#fff7ec',
					100: '#ffeed3',
					200: '#ffd9a5',
					300: '#ffbd6d',
					400: '#ff9532',
					500: '#ff760a',
					600: '#ff5c00',
					700: '#cc4102',
					800: '#a1330b',
					900: '#822c0c',
					950: '#461304',
				},
			},
			boxShadow: {
				white: '0 0 0 3px rgba(0, 0, 0, 0.05)',
			},
		},
	},
	daisyui: {
		themes: [
			{
				dark: {
					...require('daisyui/src/theming/themes')['dark'],
					primary: '#FF073A',
					secondary: '#BC13FE',
					accent: '#FF5C00',
				},
			},
		],
	},
	plugins: [require('daisyui'), require('tailwindcss-animate')],
};
