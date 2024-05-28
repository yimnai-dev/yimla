<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';

	type Props = {
		pharmacyId: string;
	};

	let { pharmacyId }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">Open menu</span>
			<Ellipsis class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>More actions</DropdownMenu.Label>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
	
		<DropdownMenu.Item
			class="cursor-pointer"
			onclick={() => {
				goto(`/app/pharmacies/${pharmacyId}/pharmacists`);
			}}
		>
			View pharmacists
		</DropdownMenu.Item>
        <DropdownMenu.Item
			class="cursor-pointer"
			onclick={() => {
				goto(`/app/pharmacies/${pharmacyId}/edit`);
			}}
		>
			Edit Pharmacy Details
		</DropdownMenu.Item>
        <DropdownMenu.Item
        class="cursor-pointer"
        onclick={() => {
            goto(`/app/pharmacies/${pharmacyId}`);
        }}
    >
        View pharmacy details
    </DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
