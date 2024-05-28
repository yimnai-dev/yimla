<script lang="ts">
	import { page } from '$app/stores';
	import DashboardHeader from '$lib/components/dashboard/DashboardHeader.svelte';
	import OrganisationLayout from '$lib/components/dashboard/OrganisationLayout.svelte';
	import { CONTEXT_KEYS } from '$lib/context-keys.js';
	import { setContext } from 'svelte';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		data: LayoutData;
	};

	let { children, data }: Props = $props();

	setContext(CONTEXT_KEYS.PHARMACY_LIST_STREAM, data.pharmacyListStream)
	setContext(CONTEXT_KEYS.ORGANISATION_PHARMACIST_LIST_STREAM, data.organisationPharmacistListStream)
	setContext(CONTEXT_KEYS.DELETE_PHARMACIST_FORM, data.deletePharmacistForm);
</script>

{#if $page.data.tholaApp === 'thola-org'}
	<OrganisationLayout>
		<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
			<DashboardHeader/>
			{@render children()}
		</div>
	</OrganisationLayout>
{:else}
	{@render children()}
{/if}
