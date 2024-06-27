<script lang="ts">
	import { type SearchMedicationSchema } from '$lib/forms/medication.form';

    type Props = {
        medication: SearchMedicationSchema;
    }

    let { medication }: Props = $props()
</script>

<h1>Item 1 on search list</h1>