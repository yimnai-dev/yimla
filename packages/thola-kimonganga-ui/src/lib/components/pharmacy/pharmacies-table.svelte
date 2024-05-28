<script lang="ts">
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { addPagination, addSortBy, addTableFilter } from 'svelte-headless-table/plugins';
	import { type Pharmacy } from '$lib/types/thola-kimonganga.types';
	import { readable } from 'svelte/store';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import PharmaciesTableAction from './pharmacies-table-action.svelte';
	import { ArrowUpDown, ChevronRight } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';
	import { page } from '$app/stores';

	let { pharmacies }: { pharmacies: Array<Pharmacy> } = $props();
	const table = createTable(readable(pharmacies), {
		page: addPagination({ initialPageSize: 10 }),
		sort: addSortBy(),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		})
	});
	const columns = table.createColumns([
		table.column({
			accessor: ({ pharmacyId }) =>
				pharmacies.indexOf(pharmacies.find((p) => p.pharmacyId === pharmacyId) as Pharmacy) + 1,
			header: ''
		}),
		table.column({
			accessor: 'name',
			header: 'Name'
		}),
		table.column({ accessor: 'country', header: 'Country' }),
		table.column({ accessor: 'region', header: 'State' }),
		table.column({ accessor: 'city', header: 'City' }),
		table.column({ accessor: 'address', header: 'Address' }),
		table.column({
			accessor: ({ pharmacyId }) => pharmacyId,
			header: 'Actions',
			cell: ({ value }) => {
				return createRender(PharmaciesTableAction, { pharmacyId: value });
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	let { pageIndex, hasNextPage, hasPreviousPage } = $state(pluginStates.page);
	const { filterValue } = $state(pluginStates.filter);
</script>

{#if $page.url.pathname === '/app/pharmacies'}
	<div class="flex items-center">
		<Input
			class="max-w-sm"
			placeholder="Filter pharmacies..."
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
		{#if $page.url.pathname === '/app/pharmacies'}
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
			<Button
				variant="outline"
				size="sm"
				href="/app/pharmacies"
				>View More
					<ChevronRight class="ml-2 h-4 w-4" />
				</Button
			>
		{/if}
	</div>
</div>
