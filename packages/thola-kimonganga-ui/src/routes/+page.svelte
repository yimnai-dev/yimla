<script lang="ts">
	import { page } from '$app/stores';

	$effect(() => {
		console.log('tholaApp: ', $page.data.tholaApp);
	});
</script>

<h1>Thola Kimonganga Landing Page</h1>
<p>
	Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation for
	tholaKimonganga: {$page.data.tholaApp}
</p>
