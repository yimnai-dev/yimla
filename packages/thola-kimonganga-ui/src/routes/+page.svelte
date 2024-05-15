<script lang="ts">
	import { page } from '$app/stores';
	import { dev } from '$app/environment';

	let subdomain = $derived.by(() => {
		const host = $page.url.host;
		const [subdomain] = host.split('.');
		if (dev) {
			return 'thola-client';
		}
		return subdomain;
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the {subdomain}</p>
