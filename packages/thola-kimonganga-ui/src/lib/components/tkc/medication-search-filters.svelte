<script lang="ts">
	import Spinner from '$lib/components/spinner/Spinner.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { SearchIcon, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import {
		searchMedicationParametersSchema,
		type SearchMedicationParametersSchema,
		type SearchMedicationSchema
	} from '$lib/forms/medication.form';
	import { getContext, onMount } from 'svelte';
	import { CONTEXT_KEYS } from '$lib/context-keys';
	import type { ToastState } from '../toast/toast-state.svelte';
	import { fade } from 'svelte/transition';
	import MapBox from '../shared/map-box.svelte';

	type Props = {
		medications: Array<SearchMedicationSchema>;
	};

	let { medications = $bindable() }: Props = $props();

	type SelectValue<U> = {
		label: string;
		value: U extends number | SearchMedicationParametersSchema['dosageForm'] ? U : never;
	};

	let mapOpen = $state(false);

	const toastState = getContext<ToastState>(CONTEXT_KEYS.TOAST);

	const searchMedicationForm =
		$page.data.tholaApp === 'thola-client'
			? $page.data.tkc.searchMedicationForm
			: $page.data.tkp.searchMedicationForm;

	const mapBoxApiKey =
		$page.data.tholaApp === 'thola-client'
			? $page.data.tkc.mapBoxApiKey
			: $page.data.tkp.mapBoxApiKey;

	const form = superForm(searchMedicationForm, {
		validators: zodClient(searchMedicationParametersSchema),
		onError: ({ result }) => {
			toastState.addToast({
				type: 'error',
				message: result.error.message,
				title: 'Search Failed'
			});
		},
		onResult: ({ result }) => {
			if (result.type === 'failure') {
				const errors = result.data?.form.errors;
				for (const key in errors) {
					toastState.addToast({
						type: 'error',
						message: errors[key][0],
						title: 'Search Failed'
					});
				}
				return;
			}
			if (result.type === 'success') {
				medications = result.data?.tkc?.searchMedicationList as Array<SearchMedicationSchema>;
			}
		}
	});

	const searchRadiusList: Array<SelectValue<number>> = [
		{ value: 100000, label: 'Select Search Radius' },
		{ value: 1000, label: '1 KM' },
		{ value: 5000, label: '5 KM' },
		{ value: 10000, label: '10 KM' },
		{ value: 25000, label: '25 KM' }
	];

	const dosageFormList: Array<SelectValue<SearchMedicationParametersSchema['dosageForm']>> = [
		{ value: 'tablet', label: 'Tablet' },
		{ value: 'capsule', label: 'Capsule' },
		{ value: 'powder', label: 'Powder' },
		{ value: 'liquid', label: 'Liquid' },
		{ value: 'inhalation', label: 'Inhalation' },
		{ value: 'injection', label: 'Injection' },
		{ value: 'other', label: 'Other' }
	];

	let { form: formData, submitting, enhance } = form;

	const onSearch = (e: Event) => {
		e.preventDefault();
		const target = e.target;
		if (!(target instanceof HTMLInputElement)) return;
		if (!target.value) {
			$page.url.searchParams.delete('query');
			goto($page.url, { keepFocus: true, noScroll: true });
			return;
		}
		$page.url.searchParams.set('query', encodeURIComponent(target.value));
		$formData.searchTerm = target.value;
		goto($page.url, { keepFocus: true, noScroll: true });
	};

	const onSearchRadius = (value: number | undefined) => {
		if (!value) {
			$page.url.searchParams.delete('searchRadius');
			$formData.searchRadius = Number.parseInt(
				$page.url.searchParams.get('searchRadius') ?? '100000'
			);
			goto($page.url, { keepFocus: true, noScroll: true });
			return;
		}
		$page.url.searchParams.set('searchRadius', encodeURIComponent(value.toString()));
		goto($page.url, { keepFocus: true, noScroll: true });
	};

	const onDosageForm = (value: SearchMedicationParametersSchema['dosageForm'] | undefined) => {
		if (!value) {
			$page.url.searchParams.delete('dosageForm');
			if ($page.url.searchParams.has('dosageForm')) {
				const dosageForm = $page.url.searchParams.get(
					'dosageForm'
				) as SearchMedicationParametersSchema['dosageForm'];
				$formData.dosageForm = dosageForm;
			}
			goto($page.url, { keepFocus: true, noScroll: true });
			return;
		}
		$page.url.searchParams.set('dosageForm', encodeURIComponent(value.toString()));
		goto($page.url, { keepFocus: true, noScroll: true });
	};

	let defaultDosageForm = $derived.by(() => {
		if ($formData.dosageForm) {
			const d = dosageFormList.find((d) => d.value === $formData.dosageForm);
			if (!d) return dosageFormList[0];
			return d;
		}
		return dosageFormList[0];
	});

	let defaultSearchRadius = $derived.by(() => {
		if ($formData.searchRadius) {
			const d = searchRadiusList.find((d) => d.value === $formData.searchRadius);
			if (!d) return searchRadiusList[0];
			return d;
		}
		return searchRadiusList[0];
	});

	onMount(() => {
		const locationInfo =
			$page.data.tholaApp === 'thola-client'
				? $page.data.tkc.locationInfo
				: $page.data.tkp.locationInfo;
		$formData.latitude = locationInfo.lat;
		$formData.longitude = locationInfo.lon;
		$formData.userId = $page.data.tholaApp == 'thola-client' ? $page.data.tkc.userInfo.userId : '';
		if ($page.url.searchParams.has('searchRadius')) {
			const searchRadius = Number.parseInt($page.url.searchParams.get('searchRadius') ?? '100000');
			$formData.searchRadius = searchRadius;
		}
		if ($page.url.searchParams.has('dosageForm')) {
			const dosageForm = $page.url.searchParams.get(
				'dosageForm'
			) as SearchMedicationParametersSchema['dosageForm'];
			$formData.dosageForm = dosageForm;
		}
		if ($page.url.searchParams.has('query')) {
			$formData.searchTerm = $page.url.searchParams.get('query') ?? '';
		}
	});

	$effect(() => {
		if (medications.length === 0) {
			mapOpen = false;
		}
	});
</script>

<h1 class="py-2 text-xl font-bold max-sm:text-center md:text-2xl lg:text-3xl">
	Search For Medications
</h1>
<form method="POST" action="?/search" use:enhance>
	<div
		class="flex w-full flex-col items-center justify-center space-y-3 py-2 md:flex-row md:justify-between md:space-x-0 md:space-y-0"
	>
		<div class="relative w-full sm:w-1/2">
			<Input
				placeholder="Search medications by name, description or category..."
				oninput={onSearch}
				name="searchTerm"
				bind:value={$formData.searchTerm}
			/>
			<SearchIcon class="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
		</div>
		<Input
			oninput={onSearch}
			name="dosageForm"
			hidden
			class="hidden"
			bind:value={$formData.dosageForm}
		/>
		<Input
			oninput={onSearch}
			name="searchRadius"
			hidden
			class="hidden"
			bind:value={$formData.searchRadius}
		/>
		<Input name="latitude" hidden class="hidden" bind:value={$formData.latitude} />
		<Input name="longitude" hidden class="hidden" bind:value={$formData.longitude} />
		<Input name="userId" hidden class="hidden" bind:value={$formData.userId} />
		<div class="flex w-full items-center justify-center space-x-3 sm:w-1/2">
			<Select.Root
				portal={null}
				onSelectedChange={(e) => onSearchRadius(e?.value)}
				selected={defaultSearchRadius}
			>
				<Select.Trigger class="w-[180px]">
					<Select.Value placeholder="search radius" />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Search Radius</Select.Label>
						{#each searchRadiusList as radius}
							<Select.Item value={radius.value} label={radius.label}>{radius.label}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
				<Select.Input name="searchRadius" bind:value={$formData.searchRadius} />
			</Select.Root>
			<Select.Root
				portal={null}
				onSelectedChange={(e) => onDosageForm(e?.value)}
				selected={defaultDosageForm}
			>
				<Select.Trigger class="w-[180px]">
					<Select.Value placeholder="Dosage Form" />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Drug Dosage Form</Select.Label>
						{#each dosageFormList as dosageForm}
							<Select.Item value={dosageForm.value} label={dosageForm.label}
								>{dosageForm.label}</Select.Item
							>
						{/each}
					</Select.Group>
				</Select.Content>
				<Select.Input name="dosageForm" bind:value={$formData.dosageForm} />
			</Select.Root>
			<Button variant="outline" onclick={() => (mapOpen = !mapOpen)}>
				{#if mapOpen}
					Close Map <ChevronUp class="ml-2 h-4 w-4" />
				{:else}
					Open Map <ChevronDown class="ml-2 h-4 w-4" />
				{/if}
			</Button>
		</div>
	</div>
	{#if mapOpen && mapBoxApiKey}
		<span transition:fade>
			<MapBox
				bind:latitude={$formData.latitude}
				bind:longitude={$formData.longitude}
				accessToken={mapBoxApiKey}
			/>
		</span>
	{/if}
	<div class="flex w-full items-center justify-center p-2">
		<Button variant="outline" class="w-full md:w-1/2 lg:w-64" type="submit">
			{#if $submitting}
				<Spinner />
				Searching...
			{:else}
				Search
				<SearchIcon class="ml-2 h-4 w-4" />
			{/if}
		</Button>
	</div>
</form>
