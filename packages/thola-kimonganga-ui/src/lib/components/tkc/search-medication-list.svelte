<script lang="ts">
	import type { SearchMedicationSchema } from '$lib/forms/medication.form';
	import { ChevronRight, LucideRabbit } from 'lucide-svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Table from '$lib/components/ui/table';
	import { ArrowUpDown } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { addPagination, addSortBy, addTableFilter } from 'svelte-headless-table/plugins';
	import { writable } from 'svelte/store';
	import GoogleMapsLinkAction from './google-maps-link-action.svelte';
	import { page } from '$app/stores';

	type Props = {
		medications: Array<SearchMedicationSchema>;
		title?: string;
		filterPlaceholder?: string;
		fromSearch?: boolean;
	};

	let {
		medications,
		title = 'Search Results',
		filterPlaceholder = 'Filter medications...',
		fromSearch = false
	}: Props = $props();
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
				medications.indexOf(
					medications.find((p) => p.drugId === drugId) as SearchMedicationSchema
				) + 1,
			header: '',
			cell: ({ value }) => {
				return value.toString().padStart(2, '0');
			}
		}),
		table.column({
			accessor: 'name',
			header: 'Name',
			cell: ({ value }) => value.charAt(0).toUpperCase() + value.slice(1)
		}),
		table.column({
			accessor: 'quantity',
			header: 'Quantity In Stock',
			cell: ({ value }) => value.toString().padStart(2, '0')
		}),
		table.column({
			accessor: 'price',
			header: 'Price',
			cell: ({ value }) => {
				const numberFormat = new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'XAF'
				});
				return `${numberFormat.format(value)} /unit`;
			}
		}),
		table.column({
			accessor: 'pharmacyName',
			header: 'Pharmacy',
			cell: ({ value }) => value.charAt(0).toUpperCase() + value.slice(1)
		}),
		table.column({
			accessor: 'address',
			header: 'Pharmacy Address'
		}),
		table.column({
			accessor: ({ drugId }) => drugId,
			header: 'Maps Link',
			cell: ({ value }) => {
				const medication = medications.find((p) => p.drugId === value) as SearchMedicationSchema;
				// if(medication) {
				return createRender(GoogleMapsLinkAction, {
					googleMapsUrl: medication?.googleMapsUrl,
					fromSearch,
					medicationId: Boolean(title) && medication ? medication.drugId : undefined
				});
				// }
			}
		})
		// table.column({
		// 	accessor: 'drugId',
		// 	header: 'Add To Cart',
		// 	cell: ({ value }) => {
		// 		const medication = medications.find((p) => p.drugId === value) as SearchMedicationSchema;
		// 		return createRender(AddMedicationToCartTableAction, {
		// 			medication
		// 		});
		// 	}
		// })
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	let { pageIndex, hasNextPage, hasPreviousPage } = $state(pluginStates.page);
	const { filterValue } = $state(pluginStates.filter);

	$effect(() => {
		$writableMedications = medications;
	});
</script>

{#if !medications.length}
	<Separator class="my-2" />
	<div class="flex w-full flex-col items-center justify-center space-y-3">
		<h1 class="text-xl font-bold md:text-2xl lg:text-3xl">No Medications</h1>
		<LucideRabbit size={150} />
		<p>Search for a medication to start seeing results</p>
	</div>
	<Separator class="my-2" />
{:else}
	<Separator class="my-2" />
	<h1 class="py-3 text-xl font-bold md:text-2xl lg:text-3xl">{title}</h1>
	<div class="flex items-center pb-3">
		<Input class="max-w-sm" placeholder={filterPlaceholder} type="text" bind:value={$filterValue} />
	</div>
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
										{:else}
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
			{#if $page.url.pathname !== '/tkc'}
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
				{@const href = title.toLowerCase().includes('recommendations')
					? '/tkc/recommendations'
					: '/tkc/search-history'}
				<Button variant="outline" size="sm" {href}
					>View More
					<ChevronRight class="ml-2 h-4 w-4" />
				</Button>
			{/if}
		</div>
	</div>
{/if}
