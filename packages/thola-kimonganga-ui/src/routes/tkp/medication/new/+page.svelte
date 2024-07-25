<script lang="ts">
	import { goto } from '$app/navigation';
	import { type ToastState } from '$lib/components/toast/toast-state.svelte';
	import { CONTEXT_KEYS } from '$lib/context-keys';
	import { createMedicationSchema } from '$lib/forms/medication.form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import { getContext, onMount } from 'svelte';
	import { page } from '$app/stores';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Popover from '$lib/components/ui/popover';
	import { DateFormatter, getLocalTimeZone, type DateValue } from '@internationalized/date';
	import { CalendarIcon } from 'lucide-svelte';
	import * as Select from '$lib/components/ui/select';
	import Spinner from '$lib/components/spinner/Spinner.svelte';
	import { Textarea } from '$lib/components/ui/textarea';

	let { data } = $props();

	let noMedicationDefaultImage =
		'https://imgs.search.brave.com/f6k3j-9KDPyQ2aCYUWC5MywQocGi1-P-xq5Q4IO8res/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTA5/Mzk2ODkwMC9waG90/by9waWxsLWFuZC1i/bGlzdGVyLXBhY2su/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PWd1TWZENFNHeDdh/TURVNEFoU0NMWjdY/ZGxEdGtaSW5KLW1m/MF94R0t6RVE9';

	const dosageForms = [
		'tablet',
		'capsule',
		'powder',
		'liquid',
		'inhalation',
		'injection',
		'other'
	] as const;
	let creatingMedication = $state(false);

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let expiryDate: DateValue | undefined = $state(undefined);

	let toastState = getContext<ToastState>(CONTEXT_KEYS.TOAST);

	let form = superForm(data.createMedicationForm, {
		validators: zodClient(createMedicationSchema),
		resetForm: true,
		onSubmit: () => {
			creatingMedication = true;
		},
		onError: ({ result }) => {
			creatingMedication = false;
			toastState.addToast({
				type: 'error',
				message: result.error.message,
				title: 'Operation failed'
			});
		},
		onResult: ({ result }) => {
			creatingMedication = false;
			if (result.type === 'success') {
				toastState.addToast({
					type: 'success',
					message: 'Medication created successfully',
					title: 'Success'
				});
				goto('/tkp/medication', {
					invalidateAll: true
				});
				$page.data.queryClient.invalidateQueries();
				return;
			}

			if (result.type === 'failure') {
				const errors = result.data?.form.errors;
				for (const key in errors) {
					toastState.addToast({
						type: 'error',
						message: errors[key][0]
					});
				}
				return;
			}
			if (result.type === 'redirect') {
				toastState.addToast({
					type: 'success',
					message: 'Medication created successfully',
					title: 'Success'
				});
				goto(result.location, {
					invalidateAll: true
				});
				$page.data.queryClient.invalidateQueries();
			}
		}
	});

	let { form: formData, enhance } = form;


	$effect(() => {
		if (expiryDate) {
			$formData.expiryDate = expiryDate.toDate(getLocalTimeZone());
		}
	});

	onMount(() => {
		$formData.pharmacyId = $page.data.tkp.pharmacistInfo.pharmacyId;
	});
</script>

<form class="container mx-auto p-5" method="POST" use:enhance enctype="multipart/form-data">
	<h1 class="text-2xl font-bold max-md:text-center md:text-3xl">
		Add New Medication To Your Stock
	</h1>
	<Form.Field {form} name="pharmacyId" class="w-full sm:w-1/2">
		<Form.Control let:attrs>
			<Input hidden class="hidden" name={attrs.name} bind:value={$formData.pharmacyId} />
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors />
	</Form.Field>
	<div class="flex w-full flex-col items-start py-3 max-sm:space-y-3 sm:flex-row sm:space-x-3">
		<Form.Field {form} name="name" class="w-full sm:w-1/2">
			<Form.Control let:attrs>
				<Form.Label>Drug Name</Form.Label>
				<Input {...attrs} bind:value={$formData.name} />
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="instructions" class="w-full sm:w-1/2">
			<Form.Control let:attrs>
				<Form.Label>Instructions</Form.Label>
				<Input {...attrs} bind:value={$formData.instructions} />
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<div class="flex w-full flex-col items-start py-3 max-sm:space-y-3 sm:flex-row sm:space-x-3">
		<Form.Field {form} name="manufacturer" class="w-full sm:w-1/2">
			<Form.Control let:attrs>
				<Form.Label>Manufacturer</Form.Label>
				<Input {...attrs} bind:value={$formData.manufacturer} />
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="category" class="w-full sm:w-1/2">
			<Form.Control let:attrs>
				<Form.Label>Drug Category</Form.Label>
				<Input {...attrs} bind:value={$formData.category} />
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<div class="flex w-full flex-col items-start py-3 max-sm:space-y-3 sm:flex-row sm:space-x-3">
		<Form.Field {form} name="strength" class="w-full sm:w-1/2">
			<Form.Control let:attrs>
				<Form.Label>Strength</Form.Label>
				<Input {...attrs} bind:value={$formData.strength} />
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="quantity" class="w-full sm:w-1/2">
			<Form.Control let:attrs>
				<Form.Label>Initial Quantity</Form.Label>
				<Input type="number" min={1} {...attrs} bind:value={$formData.quantity} />
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<div class="flex w-full flex-col items-start py-3 max-sm:space-y-3 sm:flex-row sm:space-x-3">
		<Form.Field {form} name="description" class="w-full sm:w-1/2">
			<Form.Control let:attrs>
				<Form.Label>Description</Form.Label>
				<Textarea {...attrs} bind:value={$formData.description} />
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="storageConditions" class="w-full sm:w-1/2">
			<Form.Control let:attrs>
				<Form.Label>Storage Conditions</Form.Label>
				<Textarea {...attrs} bind:value={$formData.storageConditions} />
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<div class="flex w-full flex-col items-start py-3 max-sm:space-y-3 sm:flex-row sm:space-x-3">
		<Form.Field {form} name="price" class="w-full sm:w-1/2">
			<Form.Control let:attrs>
				<Form.Label>Price</Form.Label>
				<Input type="number" min={1} {...attrs} bind:value={$formData.price} />
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="expiryDate" class="w-full sm:w-1/2">
			<Form.Control let:attrs>
				<Input name={attrs.name} hidden class="hidden" bind:value={$formData.expiryDate} />
				<Form.Label>Expiry Date</Form.Label>
				<Popover.Root>
					<Popover.Trigger asChild let:builder class="w-full sm:w-1/2">
						<Button
							variant="outline"
							class={cn(
								'w-full justify-start text-left font-normal',
								!expiryDate && 'text-muted-foreground'
							)}
							builders={[builder]}
						>
							<CalendarIcon class="mr-2 h-4 w-4" />
							{expiryDate ? df.format(expiryDate.toDate(getLocalTimeZone())) : 'Pick a date'}
						</Button>
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0">
						<Calendar bind:value={expiryDate} initialFocus />
					</Popover.Content>
				</Popover.Root>
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<div class="flex w-full flex-col items-start py-3 max-sm:space-y-3 sm:flex-row sm:space-x-3">
		<Form.Field {form} name="dosageForm" class="w-full sm:w-1/2">
			<Form.Control let:attrs>
				<Form.Label>Dosage Form</Form.Label>
				<Select.Root
					{...attrs}
					onSelectedChange={(v) => {
					if(!v) return
					formData.update(($prev) => {
						return { ...$prev, dosageForm: v.value as typeof dosageForms[number] };
					})
				}}
				>
					<Select.Trigger class="w-full">
						<Select.Value placeholder="Select Dosage Form" />
					</Select.Trigger>
					<Select.Content>
						{#each dosageForms as dosageForm (dosageForm)}
							<Select.Item value={dosageForm}>
								{dosageForm}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<Input hidden name={attrs.name} class="hidden" bind:value={$formData.dosageForm} />
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="image" class="w-full sm:w-1/2">
			<Form.Control let:attrs>
				<Form.Label>Drug Image</Form.Label>
				<Input
					type="file"
					{...attrs}
					onchange={(e) => {
					const target = e.target as HTMLInputElement
					if(!target.files || target.files.length === 0) return
					const file = target.files[0]
					if(!file) return;
					formData.update(($prev) => {
						return { ...$prev, image: file};
					})

				}}
				/>
				<Input hidden name={attrs.name} class="hidden" bind:value={$formData.image} />
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<div class="flex w-full items-center justify-center">
		<div class="relative w-full md:w-1/2 lg:w-3/4">
			{#if !$formData.image}
				<h1
					class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-background p-2 text-center text-3xl font-bold"
				>
					The image of the drug will be shown here
				</h1>
			{/if}

			<img
				alt="Medication"
				class="max-h-[400px] w-full rounded-lg object-cover object-center shadow-md"
				src={$formData.image ? URL.createObjectURL($formData.image) : noMedicationDefaultImage}
			/>
		</div>
	</div>
	<div class="flex w-full items-center justify-center py-2">
		<Button
			disabled={creatingMedication}
			type="submit"
			variant="secondary"
			class="w-full md:w-1/2 lg:w-64"
		>
			{#if creatingMedication}
				<Spinner />
			{/if}
			{creatingMedication ? 'Creating...' : 'Create'}
		</Button>
	</div>
</form>
