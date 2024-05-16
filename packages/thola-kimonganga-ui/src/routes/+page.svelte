<script lang="ts">
	import { dev } from '$app/environment';
	import { page } from '$app/stores';

	let app = $derived.by(() => {
		if (dev) {
			return 'thola-client';
		}
		const [subdomain] = $page.url.host.split('.');
		return subdomain;
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>
	Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation for
	tholaKimonganga: {app}
</p>
