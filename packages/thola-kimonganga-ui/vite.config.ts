import { sveltekit } from '@sveltejs/kit/vite';
// import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
})


// export default defineConfig(({ mode }) => {
// 	const env = loadEnv(mode, process.cwd());
// 	process.env = { ...process.env, ...env };
// 	return {
// 		plugins: [sveltekit()],
// 	test: {
// 		include: ['src/**/*.{test,spec}.{js,ts}']
// 	},
// 	}
// })
