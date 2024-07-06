<script context="module">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.data.meta.title}</title>
	<meta name="description" content={$page.data.meta.description} />
	<meta name="url" content={$page.data.meta.url} />
	<meta name="image" content="/logo/logo.svg" />
</svelte:head>
