<script lang="ts">
	import type { MedicationDetails, MedicationListResponse } from '$lib';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { addPagination, addSortBy, addTableFilter } from 'svelte-headless-table/plugins';
	import { ArrowUpDown, ChevronRight, PlusCircleIcon } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import MedicationAvatarAction from './medication-avatar-action.svelte';
	import dayjs from 'dayjs';
	import MedicationMoreActions from './medication-more-actions.svelte';
	import { medicationListOptions } from '$lib/query/medication.query';

	type Props = {
		medications: Array<MedicationDetails>;
	};

	let { medications }: Props = $props();

	let writableMedications = writable(medications);

	const table = createTable(writableMedications, {
		page: addPagination({ initialPageSize: 10 }),
		sort: addSortBy(),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		})
	});

	const columns = table.createColumns([
		table.column({
			accessor: ({ drugId }) =>
				medications.indexOf(medications.find((p) => p.drugId === drugId) as MedicationDetails) + 1,
			header: ''
		}),
		table.column({
			accessor: ({ drugId }) => drugId,
			header: 'Avatar',
			cell: ({ value }) => {
				return createRender(MedicationAvatarAction, { drugId: value });
			}
		}),
		table.column({ accessor: 'name', header: 'Name' }),
		table.column({
			accessor: 'description',
			header: 'Description',
			cell: ({ value }) => value.substring(0, 140) + (value.length > 140 ? '...' : '')
		}),
		table.column({ accessor: 'dosageForm', header: 'Form' }),
		table.column({ accessor: 'quantity', header: 'Quantity' }),
		table.column({
			accessor: 'price',
			header: 'Price',
			cell: ({ value }) => {
				const numberFormat = new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'XAF',
					minimumFractionDigits: 2
				}).format(value);
				return numberFormat;
			}
		}),
		table.column({
			accessor: 'expiryDate',
			header: 'Expiry Data',
			cell: ({ value }) => {
				return dayjs(value).format('MMM D, YYYY');
			}
		}),
		table.column({
			accessor: 'drugId',
			header: 'More',
			cell: ({ value }) => {
				return createRender(MedicationMoreActions, { drugId: value });
			}
		})
	]);

	let urlPrefix = $derived.by(() => {
		if ($page.data.tholaApp === 'thola-org') return '/tko';
		return '/tkp';
	});

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	let { pageIndex, hasNextPage, hasPreviousPage } = $state(pluginStates.page);
	const { filterValue } = $state(pluginStates.filter);

	$effect(() => {
		let medicationListResponse = $page.data.queryClient.getQueryData<MedicationListResponse>(
			medicationListOptions($page.data.medicationListStream).queryKey
		);
		if (!medicationListResponse || !medicationListResponse.ok) return;
		$writableMedications = medicationListResponse.medications;
	});
</script>

{#if $page.data.tholaApp === 'thola-pharmacy' && $page.url.pathname.includes('medication')}
	<div
		class="container mx-auto mt-5 flex items-center justify-center rounded-md border-2 border-dashed py-6"
	>
		<Button variant="outline" href="/tkp/medication/new">
			Add A New Medication
			<PlusCircleIcon class="ml-2 h-4 w-4" />
		</Button>
	</div>
{/if}

{#if $page.url.pathname === `${urlPrefix}/medication`}
	<div class="flex items-center">
		<Input
			class="max-w-sm"
			placeholder="Filter medication..."
			type="text"
			bind:value={$filterValue}
		/>
	</div>
{/if}
<div class="rounded-md border">
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
								<Table.Head {...attrs}>
									{#if cell.id === 'name'}
										<Button variant="ghost" onclick={props.sort.toggle}>
											<Render of={cell.render()} />
											<ArrowUpDown class={'ml-2 h-4 w-4'} />
										</Button>
									{:else if $page.data.tholaApp === 'thola-org' && cell.id !== 'drugId'}
										<Render of={cell.render()} />
									{:else if $page.data.tholaApp === 'thola-pharmacy'}
										<Render of={cell.render()} />
									{/if}
								</Table.Head>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		<Table.Body {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<Table.Row {...rowAttrs}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<Table.Cell {...attrs}>
									<Render of={cell.render()} />
								</Table.Cell>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>
	<div class="flex items-center justify-center space-x-4 py-2">
		{#if $page.url.pathname === `${urlPrefix}/medication`}
			<Button
				variant="outline"
				size="sm"
				onclick={() => ($pageIndex = $pageIndex - 1)}
				disabled={!$hasPreviousPage}>Previous</Button
			>
			<Button
				variant="outline"
				size="sm"
				disabled={!$hasNextPage}
				onclick={() => ($pageIndex = $pageIndex + 1)}>Next</Button
			>
		{:else}
			<Button variant="outline" size="sm" href={`${urlPrefix}/medication`}
				>View More
				<ChevronRight class="ml-2 h-4 w-4" />
			</Button>
		{/if}
	</div>
</div>
