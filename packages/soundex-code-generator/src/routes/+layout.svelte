<script>
	import { soundexCodeGenerator } from '$lib/utils';
	import '../app.css';
	import { onMount } from 'svelte';
	import en_dict from '$lib/dict/en.json?raw';

	let { children, data } = $props();

	onMount(() => {
		const words = Object.values(en_dict).map(word => {
			return {
				word,
				code: soundexCodeGenerator(word)
			}
		});
		console.log('WORDS', words);
	})
	
</script>

{@render children()}
