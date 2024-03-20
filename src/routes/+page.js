export const load = async ({ data }) => {
	const random = Math.floor(Math.random() * 100);

	console.log('UNIVERSAL LOAD', random);

	return {
		...data,
		data2: 'hello from +page.js',
		universal_random: random
	};
};
