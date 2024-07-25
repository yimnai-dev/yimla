<script lang="ts" context="module">
	import { Button } from '$lib/components/ui/button';
	import { PlusCircleIcon } from 'lucide-svelte';
</script>

<div
	class="container mx-auto mt-5 flex items-center justify-center rounded-md border-2 border-dashed py-6"
>
	<Button variant="outline" href="/tkp/pharmacists/new">
		Add New Pharmacist to Pharmacy
		<PlusCircleIcon class="ml-2 h-4 w-4" />
	</Button>
</div>
