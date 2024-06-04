import { sveltekit } from '@sveltejs/kit/vite';
// import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import {config} from 'dotenv'

// export default defineConfig({
// 	plugins: [sveltekit()],
// 	test: {
// 		include: ['src/**/*.{test,spec}.{js,ts}']
// 	},
// })

export default defineConfig(({ mode }) => {
	config({ path: `./.env.${mode}` })
	return {
		plugins: [sveltekit()],
		test: {
			include: ['src/**/*.{test,spec}.{js,ts}']
		},
	}
}) 