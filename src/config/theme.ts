/**
 * Theme color palette. Mirrors the CSS variables in src/index.css @theme block.
 * Use these when you need color values in JS/TS (e.g. charts, inline styles, Canvas).
 */

export const themeColors = {
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
};

/** Main brand colors (500 shade) for quick access */
export const themeBrand = {
	primary: themeColors.primary[500],
	secondary: themeColors.secondary[500],
	accent: themeColors.accent[500],
};
