<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea';
	import { page } from '$app/stores';
	import { medicationListOptions } from '$lib/query/medication.query';
	import type {
		MedicationDetails,
		MedicationListResponse
	} from '$lib/types/thola-kimonganga.types';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { updateMedicationSchema, type UpdateMedicationSchema } from '$lib/forms/medication.form';
	import { CalendarIcon } from 'lucide-svelte';
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Popover from '$lib/components/ui/popover';
	import { getContext, onMount } from 'svelte';
	import { CONTEXT_KEYS } from '$lib/context-keys';
	import type { ToastState } from '../toast/toast-state.svelte';

	import {
		DateFormatter,
		getLocalTimeZone,
		type DateValue,
		fromDate
	} from '@internationalized/date';
	import { cn } from '$lib/utils';
	import RemoteImage from '../img/remote-image.svelte';
	import Spinner from '../spinner/Spinner.svelte';

	type Props = {
		drugId: string;
		open: boolean;
	};
	let { drugId, open = $bindable() }: Props = $props();

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let expiryDate: DateValue | undefined = $state(undefined);

	let medicationListResponse = $page.data.queryClient.getQueryData<MedicationListResponse>(
		medicationListOptions($page.data.tholaApp === 'thola-org' ? $page.data.tko.medicationListStream : $page.data.tkp.medicationListStream).queryKey
	);

	let medication = $derived.by(() => {
		if (!medicationListResponse || !medicationListResponse.ok) return;
		const med = medicationListResponse.medications.find((m) => m.drugId === drugId);
		return med;
	});

	let toastState = getContext<ToastState>(CONTEXT_KEYS.TOAST);

	let updatingMedication = $state(false);

	let form = superForm($page.data.tkp.updateMedicationForm, {
		id: `update_medication_form_${drugId}`,
		validators: zodClient(updateMedicationSchema),
		onSubmit: ({ formData }) => {
			const updateDetails = Object.fromEntries(
				formData.entries()
			) as unknown as UpdateMedicationSchema;
			updatingMedication = true;
			$page.data.queryClient.setQueryData<MedicationListResponse>(
				medicationListOptions($page.data.medicationListStream).queryKey,
				(old) => {
					if (!old || !old.ok) return;
					if (!medication) return;
					const med: MedicationDetails = {
						...medication,
						price:
							updateDetails.price && updateDetails.price !== medication.price
								? updateDetails.price
								: medication.price,
						quantity:
							updateDetails.quantity && updateDetails.quantity !== medication.quantity
								? updateDetails.quantity
								: medication.quantity,
						expiryDate:
							updateDetails.expiryDate &&
							updateDetails.expiryDate.toString() !== medication.expiryDate
								? updateDetails.expiryDate.toString()
								: medication.expiryDate,
						description:
							updateDetails.description && updateDetails.description !== medication.description
								? updateDetails.description
								: medication.description,
						instructions:
							updateDetails.instructions && updateDetails.instructions !== medication.instructions
								? updateDetails.instructions
								: medication.instructions,
						storageConditions:
							updateDetails.storageConditions &&
							updateDetails.storageConditions !== medication.storageConditions
								? updateDetails.storageConditions
								: medication.storageConditions
					};
					return {
						...old,
						medications: old.medications.map((m) => {
							if (m.drugId === medication.drugId) {
								return med;
							}
							return m;
						})
					};
				}
			);
			open = false;
			toastState.addToast({
				type: 'info',
				message: 'Medication is being updated in the background',
				title: 'Update In Progress'
			});
		},
		onError: ({ result }) => {
			updatingMedication = false;
			toastState.addToast({ message: result.error.message, type: 'error' });
			$page.data.queryClient.setQueryData<MedicationListResponse>(
				medicationListOptions($page.data.medicationListStream).queryKey,
				(old) => {
					if (!old || !old.ok) return;
					if (!medication) return;
					return {
						...old,
						medications: old.medications.map((m) => {
							if (m.drugId === medication.drugId) {
								return medication;
							}
							return m;
						})
					};
				}
			);
		},
		onResult: ({ result }) => {
			updatingMedication = false;
			open = false;
			if (result.type === 'failure') {
				const errors = result.data?.form.errors;
				for (const key in errors) {
					toastState.addToast({ message: errors[key][0], type: 'error' });
				}
				$page.data.queryClient.setQueryData<MedicationListResponse>(
					medicationListOptions($page.data.medicationListStream).queryKey,
					(old) => {
						if (!old || !old.ok) return;
						if (!medication) return;
						return {
							...old,
							medications: old.medications.map((m) => {
								if (m.drugId === medication.drugId) {
									return medication;
								}
								return m;
							})
						};
					}
				);
				return;
			}
			if (result.type === 'success') {
				toastState.addToast({ message: 'Medication updated successfully', type: 'success' });
				return;
			}
		}
	});

	let { form: formData, enhance, isTainted, tainted } = form;

	onMount(() => {
		$formData.drugId = drugId;
		if (medication) {
			if (medication.description) $formData.description = medication.description;
			if (medication.instructions) $formData.instructions = medication.instructions;
			if (medication.quantity) $formData.quantity = medication.quantity;
			if (medication.price) $formData.price = medication.price;
			if (medication.expiryDate)
				expiryDate = fromDate(new Date(medication.expiryDate), getLocalTimeZone());
			if (medication.storageConditions) $formData.storageConditions = medication.storageConditions;
		}
	});
</script>

{#if medication}
	<Sheet.Root {open} onOpenChange={() => (open = !open)}>
		<Sheet.Content side="right" class="overflow-y-scroll">
			<Sheet.Header>
				<Sheet.Title>Update {medication.name}</Sheet.Title>
				<Sheet.Description>
					Make changes to {medication.name} here. Click save when you're done.
				</Sheet.Description>
			</Sheet.Header>
			<form
				class="grid gap-4 py-4"
				method="POST"
				action="/tkp/?/updateMedication"
				use:enhance
				enctype="multipart/form-data"
			>
				<!-- Hidden Fields start-->
				<Form.Field {form} name="drugId" class="w-full sm:w-1/2">
					<Form.Control let:attrs>
						<Input hidden class="hidden" name={attrs.name} bind:value={$formData.drugId} />
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>
				<!-- Hidden fields end -->
				<div class="flex flex-col space-y-3">
					<Label>Drug Name</Label>
					<Input disabled value={medication.name} class="col-span-3" />
				</div>
				<Form.FormField {form} name="quantity" class="grid gap-2">
					<Form.Control let:attrs>
						<Form.Label>Quantity in stock</Form.Label>
						<Input {...attrs} min={1} type="number" bind:value={$formData.quantity} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.FormField>
				<Form.FormField {form} name="price" class="grid gap-2">
					<Form.Control let:attrs>
						<Form.Label>Price</Form.Label>
						<span class="relative w-full">
							<Input {...attrs} min={1} type="number" bind:value={$formData.price} />
							<p class="absolute right-2 top-1/2 translate-y-[-50%]">FCFA</p>
						</span>
					</Form.Control>
					<Form.FieldErrors />
				</Form.FormField>
				<Form.Field {form} name="expiryDate" class="w-full">
					<Form.Control let:attrs>
						<Input name={attrs.name} hidden class="hidden" bind:value={$formData.expiryDate} />
						<Form.Label>Expiry Date</Form.Label>
						<Popover.Root>
							<Popover.Trigger asChild let:builder class="w-full">
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
							<Popover.Content class="w-full p-0">
								<Calendar
									minValue={fromDate(new Date(), getLocalTimeZone())}
									bind:value={expiryDate}
									initialFocus
									class="w-full"
								/>
							</Popover.Content>
						</Popover.Root>
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>
				<Form.FormField {form} name="description" class="grid gap-2">
					<Form.Control let:attrs>
						<Form.Label>Drug Description</Form.Label>
						<Textarea {...attrs} bind:value={$formData.description} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.FormField>
				<Form.FormField {form} name="instructions" class="grid gap-2">
					<Form.Control let:attrs>
						<Form.Label>Instructions</Form.Label>
						<Textarea {...attrs} bind:value={$formData.instructions} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.FormField>

				<Form.FormField {form} name="storageConditions" class="grid gap-2">
					<Form.Control let:attrs>
						<Form.Label>Storage Conditions</Form.Label>
						<Textarea {...attrs} bind:value={$formData.storageConditions} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.FormField>
				<Form.Field {form} name="image" class="w-full">
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
				<div class="flex h-auto w-full flex-col items-center justify-center">
					<div class="relative w-full">
						{#if $formData.image}
							<img
								alt="Medication"
								class="w-full rounded-lg object-cover object-center shadow-md"
								src={URL.createObjectURL($formData.image)}
							/>
						{:else}
							<RemoteImage
								src={`https://kgzrdwvmmyjoutwoeggw.supabase.co/storage/v1/object/public/thola-kimonganga/medication/${drugId}`}
							/>
						{/if}
					</div>
				</div>
				<Button disabled={!isTainted($tainted) || updatingMedication} type="submit" class="py-3">
					{#if updatingMedication}
						<Spinner />
						Updating
					{:else}
						Save Changes
					{/if}
				</Button>
			</form>
		</Sheet.Content>
	</Sheet.Root>
{/if}
