<script lang="ts">
	import { page } from '$app/stores';
	import { dev } from '$app/environment';

	const app = $derived.by(() => {
		if (dev) {
			return 'thola-client';
		}
		const [subdomain] = $page.url.host;
		return subdomain;
	});
</script>

<h1>Welcome to Thola Kimonganga App</h1>
<p>You are currently looking at the {app} UI</p>
