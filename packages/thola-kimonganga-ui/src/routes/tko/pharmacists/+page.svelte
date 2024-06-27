<script lang="ts">
	import PharmacistsTableWrapper from '$lib/components/organisation/pharmacist-table-wrapper.svelte';
    import {Button} from '$lib/components/ui/button'
    import {PlusCircleIcon} from 'lucide-svelte'

</script>

<div class="flex flex-col gap-5 px-5">
	<div
		class="container mx-auto mt-5 flex items-center justify-center rounded-md border-2 border-dashed py-6"
	>
		<Button variant="outline" href="/tko/pharmacists/new">
			Add New Pharmacist
			<PlusCircleIcon class="ml-2 h-4 w-4" />
		</Button>
	</div>
	<PharmacistsTableWrapper />
</div>
