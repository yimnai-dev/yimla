<script lang="ts">
    import { Checkbox } from "$lib/components/ui/checkbox";
   
     type Props = {
        checked: boolean;
     }

     let {checked = $bindable()}: Props  = $props()
  </script>
   
  <Checkbox bind:checked />