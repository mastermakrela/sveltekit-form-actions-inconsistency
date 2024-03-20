import { error, fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	console.log('🚀 ~ load ~ locals:', locals);
	const random = Math.floor(Math.random() * 100);

	console.log('SERVER LOAD', random);

	return {
		data1: 'hello from +page.server.svelte',
		server_random: random
	};
};

export const actions = {
	value: async (event) => {
		const formData = await event.request.formData();
		const title = formData.get('title');

		event.locals.title = title;

		console.log('ACTION: value', title);

		return {
			success: true,
			title
		};
	},
	fail: async (event) => {
		console.log('ACTION: fail');

		event.locals.fail = 'fail';

		return fail(400, { message: 'Bad request' });
	},
	error: async (event) => {
		console.log('ACTION: error');

		event.locals.error = 'I am a teapot';

		error(418, "I'm a teapot");
	},
	redirect: async (event) => {
		console.log('ACTION: redirect');

		event.locals.redirect = '/other';

		redirect(301, '/other');
	}
};
