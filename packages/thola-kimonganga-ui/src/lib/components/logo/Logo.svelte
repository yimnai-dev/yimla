<script lang="ts">
	import { mode } from 'mode-watcher';
</script>

{#if $mode === 'dark'}
	<h1>Dark Logo</h1>
{:else}
	<h1>Light Logo</h1>
{/if}
