<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';

	type Props = {
		drugId: string;
	};

	let { drugId }: Props = $props();

	let avatar = $state(
		`https://kgzrdwvmmyjoutwoeggw.supabase.co/storage/v1/object/public/thola-kimonganga/medication/${drugId}`
	);
</script>

<Avatar.Root>
	<Avatar.Image src={avatar} alt="@medication" />
	<Avatar.Fallback>MD</Avatar.Fallback>
</Avatar.Root>
