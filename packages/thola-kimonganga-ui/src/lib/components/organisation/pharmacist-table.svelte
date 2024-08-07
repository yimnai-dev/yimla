<script lang="ts">
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { addPagination, addSortBy, addTableFilter } from 'svelte-headless-table/plugins';
	import { type PharmacistDetails } from '$lib/types/thola-kimonganga.types';
	import { writable } from 'svelte/store';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import PharmacistsTableAction from './pharmacist-table-action.svelte';
	import { ArrowUpDown, ChevronRight } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';
	import { page } from '$app/stores';
	import dayjs from 'dayjs';
	import { organisationPharmacistListOptions } from '$lib/query/pharmacist.query';

	let { pharmacists }: { pharmacists: Array<PharmacistDetails> } = $props();
	let writablePharmacists = writable(pharmacists);
	const table = createTable(writablePharmacists, {
		page: addPagination({ initialPageSize: 10 }),
		sort: addSortBy(),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		})
	});
	const columns = table.createColumns([
		table.column({
			accessor: ({ pharmacistId }) =>
				pharmacists.indexOf(
					pharmacists.find((p) => p.pharmacistId === pharmacistId) as PharmacistDetails
				) + 1,
			header: ''
		}),
		table.column({ accessor: 'firstName', header: 'First Name' }),
		table.column({ accessor: 'lastName', header: 'Last Name' }),
		table.column({ accessor: 'username', header: 'Username' }),
		table.column({ accessor: 'phoneNumber', header: 'Phone Number' }),
		table.column({ accessor: 'pharmacyName', header: 'Pharmacy' }),
		table.column({
			accessor: 'joinedOn',
			header: 'Employed On',
			cell: ({ value }) => {
				return dayjs(value).format('MMM D, YYYY');
			}
		}),
		table.column({
			accessor: ({ pharmacistId, pharmacyId, firstName }) => {
				return {
					pharmacyId,
					pharmacistId,
					firstName
				};
			},
			header: 'Actions',
			cell: ({ value }) => {
				return createRender(PharmacistsTableAction, {
					pharmacistId: value.pharmacistId,
					pharmacyId: value.pharmacyId,
					firstName: value.firstName
				});
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	let { pageIndex, hasNextPage, hasPreviousPage } = $state(pluginStates.page);
	const { filterValue } = $state(pluginStates.filter);

	$effect(() => {
		const orgPharmacistsResponse = $page.data.queryClient.getQueryData(
			organisationPharmacistListOptions($page.data.tko.organisationPharmacistListResponse).queryKey
		);
		if (orgPharmacistsResponse && orgPharmacistsResponse.ok) {
			$writablePharmacists = orgPharmacistsResponse.pharmacists;
		}
	});
</script>

{#if $page.url.pathname === '/tko/pharmacists'}
	<div class="flex items-center">
		<Input
			class="max-w-sm"
			placeholder="Filter pharmacists..."
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
									{#if cell.id === 'firstName'}
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
		{#if $page.url.pathname === '/tko/pharmacists'}
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
			<Button variant="outline" size="sm" href="/tko/pharmacists"
				>View More
				<ChevronRight class="ml-2 h-4 w-4" />
			</Button>
		{/if}
	</div>
</div>
