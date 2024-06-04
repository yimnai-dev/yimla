<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index';
	import * as Dialog from '$lib/components/ui/dialog/index';

	type Props = {
		open: boolean;
	};

	let { open = $bindable() }: Props = $props();
</script>

<Dialog.Root {open} onOpenChange={() => (open = !open)}>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}
		>Purchase Subscription</Dialog.Trigger
	>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title class="text-center">Buy New Subscription</Dialog.Title>
			<Dialog.Description class="text-center">
				Buy a new subscription for your pharmacies to continue using Thola Kimonganga.
			</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/buySubscription">
			<!-- Form fields: select-bundle, select-pharmacies, make stripe payment -->
		</form>
		<Dialog.Footer>
			<Button type="submit">Save changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
