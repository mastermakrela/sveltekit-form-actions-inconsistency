<script>
	import { page } from '$app/stores';

	export let data;
	export let form;
</script>

<pre>{JSON.stringify(data, null, 2)}</pre>

<pre>{JSON.stringify(form, null, 2)}</pre>

<h1>{$page.status}</h1>

<h2>{$page.error.message}</h2>

<a href="/">back</a>
