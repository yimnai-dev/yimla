<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Avatar from '$lib/components/ui/avatar';
</script>

<Avatar.Root
	class="cursor-pointer"
	onclick={() => {
		goto(`/app`);
	}}
>
	<Avatar.Image src="/logo/logo.svg" alt="Thola Kimonganga" />
	<Avatar.Fallback>TK</Avatar.Fallback>
</Avatar.Root>
