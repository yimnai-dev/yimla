<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Avatar from '$lib/components/ui/avatar';
	import {page} from '$app/stores';

	const href = $page.data.userRole === 'pharmacist' ? '/tkp' : $page.data.userRole === 'user' ? '/tkc' : '/tko'
</script>

<Avatar.Root
	class="cursor-pointer"
	onclick={() => {
		goto(href);
	}}
>
	<Avatar.Image src="/logo/logo.svg" alt="Thola Kimonganga" />
	<Avatar.Fallback>TK</Avatar.Fallback>
</Avatar.Root>
