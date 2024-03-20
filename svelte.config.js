import cloudflare from '@sveltejs/adapter-cloudflare';
import adapter from '@sveltejs/adapter-auto';

export default {
	kit: {
		// adapter: cloudflare({
		// 	// See below for an explanation of these options
		// 	routes: {
		// 		include: ['/*'],
		// 		exclude: ['<all>']
		// 	}
		// })
		adapter: adapter()
	}
};
