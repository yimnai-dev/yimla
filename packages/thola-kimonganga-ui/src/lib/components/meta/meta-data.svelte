<script context="module">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.data?.meta?.title || $page.error?.message + '.' + $page.error?.status}</title>
	<meta
		name="description"
		content={$page.data?.meta?.description || $page.error?.message + '.' + $page.error?.status}
	/>
	{#if $page.data?.meta?.url}
		<meta name="url" content={$page.data.meta.url} />
	{/if}
	<meta name="image" content="/logo/logo.svg" />
</svelte:head>
