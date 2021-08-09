module.exports = {
	mode: 'jit',
	purge: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {}
	},
	variants: {
		extend: {
			colors: {
				orange: {
					50: '#FAE0D7',
					100: '#F9D6CA',
					200: '#F7C8B8',
					300: '#F4B5A0',
					400: '#F09D81',
					500: '#EB7B57',
					600: '#D3633E',
					700: '#B65232',
					800: '#954830',
					900: '#7B3F2D'
				}
			}
		}
	},
	plugins: []
};
