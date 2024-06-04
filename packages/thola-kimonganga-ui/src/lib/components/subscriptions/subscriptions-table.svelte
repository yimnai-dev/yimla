<script lang="ts">
	import { page } from '$app/stores';
	import dayjs from 'dayjs';
	import Stripe from 'stripe';
	import { Render, Subscribe, createTable } from 'svelte-headless-table';
	import { addPagination, addSortBy, addTableFilter } from 'svelte-headless-table/plugins';
	import { readable } from 'svelte/store';
	import Button from '../ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table';
	import { ArrowUpDown } from 'lucide-svelte';

	type Props = {
		subscriptionList: Stripe.Subscription[];
	};

	let { subscriptionList }: Props = $props();

	const table = createTable(readable(subscriptionList), {
		page: addPagination({ initialPageSize: 10 }),
		sort: addSortBy(),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		})
	});
	const columns = table.createColumns([
		table.column({
			accessor: ({ id }) =>
				subscriptionList.indexOf(subscriptionList.find((p) => p.id === id) as Stripe.Subscription) +
				1,
			header: ''
		}),
		table.column({
			accessor: 'status',
			header: 'Status',
			cell: ({ value }) => {
				return value;
			}
		}),
		table.column({
			accessor: 'current_period_start',
			header: 'Start Date',
			cell: ({ value }) => {
				return dayjs(value).format('MMM D, YYYY, h:mm A');
			}
		}),
		table.column({
			accessor: 'current_period_end',
			header: 'End Date',
			cell: ({ value }) => {
				return dayjs(value).format('MMM D, YYYY, h:mm A');
			}
		}),
		table.column({
			accessor: 'days_until_due',
			header: 'Days Until Due',
			cell: ({ value }) => {
				if (!value) return 'N/A';
				return value.toString().padStart(2, '0');
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	let { pageIndex, hasNextPage, hasPreviousPage } = $state(pluginStates.page);
</script>

<div class="w-full rounded-md border">
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
								<Table.Head {...attrs}>
									{#if cell.id === 'status'}
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
		{#if $page.url.pathname === '/app/pharmacists'}
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
		{/if}
	</div>
</div>
