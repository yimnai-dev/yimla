<script lang="ts">
	import { generateCodeDefinition, soundexCodeGenerator } from '$lib/utils';
	import { fly } from 'svelte/transition';

	let word = $state('');

	let soundexCode = $derived.by(() => {
		if (!word) return;
		return soundexCodeGenerator(word);
	});

	let codeDefinition = $derived.by(() => {
		if (!word) return;
		return generateCodeDefinition(word);
	});
</script>

<div class="w-screen min-h-screen bg-[#080e3c] flex flex-col space-y-3 items-center p-4">
	<h1 class="font-bold text-3xl font-serif text-white">Soundex Code Generator And Visualizer</h1>
	<p class="text-2xl font-serif text-white">
		Generate and visualize soundex codes for any text input
	</p>
	<input
		placeholder="Enter text"
		type="text"
		class="w-full lg:w-1/2 md:w-3/4 h-12 rounded-md px-2"
		bind:value={word}
	/>
	<p class="font-serif text-2xl text-white font-bold" class:hidden={!soundexCode}>
		Soundex Code: {soundexCode}
	</p>

	{#if codeDefinition}
		<div
			class="relative lg:w-1/2 md:w-3/4 w-full rounded-md overflow-hidden"
			in:fly={{ y: 100 }}
			out:fly={{ y: 100 }}
		>
			<table
				class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 overflow-hidden"
			>
				<thead class="text-xsuppercase bg-[#131b60] text-white">
					<tr>
						<th scope="col" class="px-6 py-3"> Character </th>
						<th scope="col" class="px-6 py-3"> Soundex Code </th>
						<th scope="col" class="px-6 py-3"> Explanation </th>
					</tr>
				</thead>
				<tbody>
					{#each codeDefinition as { char, code, reason } (`${char}-${code}-${reason}-${Math.random()}`)}
						<tr class="border-b even:bg-[#252279] odd:bg-[#254e86] border-gray-700">
							<th scope="row" class="px-6 py-4 font-medium whitespace-nowrap text-white">
								{char}
							</th>
							<td class="px-6 py-4 text-white"> {code} </td>
							<td class="px-6 py-4 text-white"> {reason} </td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
