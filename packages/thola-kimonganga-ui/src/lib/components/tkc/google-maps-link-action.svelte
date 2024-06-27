<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { MapPin } from 'lucide-svelte';
	import { page } from '$app/stores';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';

	type Props = {
		googleMapsUrl: string;
		medicationId?: string;
		fromSearch?: boolean;
	};

	let { googleMapsUrl, medicationId, fromSearch }: Props = $props();

	let loading = $state(false);

	const updateRecommendation: SubmitFunction = ({ formData }) => {
		if (!medicationId || !fromSearch) {
			return;
		}
		loading = true;
		formData.set('medicationId', medicationId);
		formData.set('userId', $page.data.tkc.userInfo.userId);
		window.open(googleMapsUrl, '_blank');
		return async ({ update }) => {
			await update();
			loading = false;
		};
	};
</script>

{#if medicationId && fromSearch && $page.url.pathname.startsWith('/tkc')}
	<form method="POST" action="tkc?/updateRecommendation" use:enhance={updateRecommendation}>
		<Button type="submit" variant="outline" disabled={loading}>
			{loading ? 'Please wait...' : 'See on Google Maps'} &nbsp; <MapPin /></Button
		>
	</form>
{:else}
	<Button href={googleMapsUrl} target="_blank" variant="outline"
		>See on Google Maps &nbsp; <MapPin /></Button
	>
{/if}
