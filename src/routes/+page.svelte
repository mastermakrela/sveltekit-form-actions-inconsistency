<script>
	import { enhance } from '$app/forms';

	export let data;
	export let form;
</script>

<pre>{JSON.stringify(data, null, 2)}</pre>

<pre>{JSON.stringify(form, null, 2)}</pre>

<!-- <form method="post" action="?/value" use:enhance> -->
<form method="post" action="?/value" use:enhance>
	<input type="text" name="title" value="test" />

	<button type="submit">Save</button>

	<button type="submit" formaction="?/fail">fail</button>

	<button type="submit" formaction="?/error">Error</button>

	<button type="submit" formaction="?/redirect">Redirect</button>
</form>
