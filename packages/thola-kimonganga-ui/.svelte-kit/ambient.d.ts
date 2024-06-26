
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const MAPBOX_API_KEY: string;
	export const STRIPE_PUBLISHABLE_TEST_KEY: string;
	export const STRIPE_PRICING_TABLE_TEST_ID: string;
	export const VITE_IP_IPA_KEY: string;
	export const APP_NAME: string;
	export const NODE_ENV: string;
	export const SHELL: string;
	export const LSCOLORS: string;
	export const npm_command: string;
	export const SESSION_MANAGER: string;
	export const npm_package_dependencies_mode_watcher: string;
	export const COLORTERM: string;
	export const LESS: string;
	export const NVM_INC: string;
	export const XDG_MENU_PREFIX: string;
	export const npm_package_devDependencies_eslint_plugin_svelte: string;
	export const npm_package_devDependencies_prettier_plugin_tailwindcss: string;
	export const npm_package_dependencies_lucide_svelte: string;
	export const NODE: string;
	export const npm_package_devDependencies_tslib: string;
	export const npm_package_dependencies__mapbox_search_js_web: string;
	export const npm_package_devDependencies_autoprefixer: string;
	export const LC_ADDRESS: string;
	export const npm_package_devDependencies_tailwindcss: string;
	export const npm_package_scripts_check_watch: string;
	export const LC_NAME: string;
	export const SSH_AUTH_SOCK: string;
	export const npm_package_private: string;
	export const npm_package_devDependencies__stripe_stripe_js: string;
	export const MEMORY_PRESSURE_WRITE: string;
	export const XMODIFIERS: string;
	export const DESKTOP_SESSION: string;
	export const LC_MONETARY: string;
	export const EDITOR: string;
	export const npm_package_scripts_test_unit: string;
	export const npm_package_scripts_cf_typegen: string;
	export const GIT_INDEX_FILE: string;
	export const PWD: string;
	export const npm_package_devDependencies_svelte_headless_table: string;
	export const npm_package_devDependencies_vite: string;
	export const XDG_SESSION_DESKTOP: string;
	export const LOGNAME: string;
	export const QT_QPA_PLATFORMTHEME: string;
	export const XDG_SESSION_TYPE: string;
	export const npm_package_devDependencies__typescript_eslint_parser: string;
	export const PNPM_HOME: string;
	export const SYSTEMD_EXEC_PID: string;
	export const npm_package_scripts_build: string;
	export const npm_package_dependencies_mapbox_gl: string;
	export const XAUTHORITY: string;
	export const npm_package_devDependencies_stripe: string;
	export const npm_package_devDependencies_prettier: string;
	export const npm_package_devDependencies_eslint_config_prettier: string;
	export const GIT_AUTHOR_DATE: string;
	export const MOTD_SHOWN: string;
	export const GDM_LANG: string;
	export const GIT_EXEC_PATH: string;
	export const HOME: string;
	export const USERNAME: string;
	export const LC_PAPER: string;
	export const LANG: string;
	export const npm_package_devDependencies_typescript: string;
	export const LS_COLORS: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const npm_package_version: string;
	export const MEMORY_PRESSURE_WATCH: string;
	export const VTE_VERSION: string;
	export const npm_package_devDependencies__typescript_eslint_eslint_plugin: string;
	export const WAYLAND_DISPLAY: string;
	export const npm_package_dependencies__tanstack_react_query_devtools: string;
	export const npm_package_scripts_test_integration: string;
	export const npm_package_devDependencies_svelte_stripe: string;
	export const GNOME_TERMINAL_SCREEN: string;
	export const npm_package_dependencies_clsx: string;
	export const npm_package_devDependencies_prettier_plugin_svelte: string;
	export const npm_package_devDependencies__cloudflare_workers_types: string;
	export const GIT_AUTHOR_EMAIL: string;
	export const GIT_PREFIX: string;
	export const INIT_CWD: string;
	export const npm_package_scripts_format: string;
	export const npm_package_devDependencies_wrangler: string;
	export const npm_package_scripts_preview: string;
	export const npm_lifecycle_script: string;
	export const NVM_DIR: string;
	export const GNOME_SETUP_DISPLAY: string;
	export const npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
	export const npm_package_devDependencies_svelte_check: string;
	export const XDG_SESSION_CLASS: string;
	export const TERM: string;
	export const LC_IDENTIFICATION: string;
	export const npm_package_name: string;
	export const ZSH: string;
	export const npm_package_type: string;
	export const USER: string;
	export const npm_config_frozen_lockfile: string;
	export const npm_package_devDependencies_vitest: string;
	export const GNOME_TERMINAL_SERVICE: string;
	export const npm_package_devDependencies_sveltekit_superforms: string;
	export const npm_package_dependencies_dotenv: string;
	export const DISPLAY: string;
	export const npm_lifecycle_event: string;
	export const SHLVL: string;
	export const NVM_CD_FLAGS: string;
	export const npm_package_scripts_deploy: string;
	export const npm_package_dependencies__internationalized_date: string;
	export const GIT_EDITOR: string;
	export const PAGER: string;
	export const npm_package_devDependencies_eslint: string;
	export const LC_TELEPHONE: string;
	export const QT_IM_MODULE: string;
	export const LC_MEASUREMENT: string;
	export const npm_config_user_agent: string;
	export const npm_package_scripts_lint: string;
	export const PNPM_SCRIPT_SRC_DIR: string;
	export const npm_execpath: string;
	export const npm_package_devDependencies__sveltejs_adapter_auto: string;
	export const npm_package_devDependencies_svelte: string;
	export const npm_package_scripts_test: string;
	export const XDG_RUNTIME_DIR: string;
	export const npm_package_dependencies_tailwind_variants: string;
	export const NODE_PATH: string;
	export const npm_package_devDependencies_zod: string;
	export const DEBUGINFOD_URLS: string;
	export const npm_package_devDependencies__sveltejs_adapter_cloudflare: string;
	export const npm_package_dependencies_bits_ui: string;
	export const LC_TIME: string;
	export const npm_package_scripts_dev: string;
	export const npm_package_devDependencies__tailwindcss_typography: string;
	export const npm_package_devDependencies__types_mapbox_gl: string;
	export const QT_AUTO_SCREEN_SCALE_FACTOR: string;
	export const XDG_DATA_DIRS: string;
	export const npm_package_dependencies_tailwind_merge: string;
	export const npm_package_scripts_check: string;
	export const GIT_AUTHOR_NAME: string;
	export const PATH: string;
	export const npm_package_devDependencies__types_eslint: string;
	export const npm_package_dependencies_svelte_sonner: string;
	export const npm_config_node_gyp: string;
	export const GDMSESSION: string;
	export const npm_package_devDependencies__sveltejs_kit: string;
	export const npm_package_dependencies_dayjs: string;
	export const npm_package_dependencies_formsnap: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const npm_package_devDependencies__playwright_test: string;
	export const npm_package_dependencies__tanstack_svelte_query: string;
	export const NVM_BIN: string;
	export const MAIL: string;
	export const npm_config_registry: string;
	export const npm_package_devDependencies_postcss: string;
	export const npm_node_execpath: string;
	export const npm_config_engine_strict: string;
	export const LC_NUMERIC: string;
	export const OLDPWD: string;
	export const VITE_USER_NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		MAPBOX_API_KEY: string;
		STRIPE_PUBLISHABLE_TEST_KEY: string;
		STRIPE_PRICING_TABLE_TEST_ID: string;
		VITE_IP_IPA_KEY: string;
		APP_NAME: string;
		NODE_ENV: string;
		SHELL: string;
		LSCOLORS: string;
		npm_command: string;
		SESSION_MANAGER: string;
		npm_package_dependencies_mode_watcher: string;
		COLORTERM: string;
		LESS: string;
		NVM_INC: string;
		XDG_MENU_PREFIX: string;
		npm_package_devDependencies_eslint_plugin_svelte: string;
		npm_package_devDependencies_prettier_plugin_tailwindcss: string;
		npm_package_dependencies_lucide_svelte: string;
		NODE: string;
		npm_package_devDependencies_tslib: string;
		npm_package_dependencies__mapbox_search_js_web: string;
		npm_package_devDependencies_autoprefixer: string;
		LC_ADDRESS: string;
		npm_package_devDependencies_tailwindcss: string;
		npm_package_scripts_check_watch: string;
		LC_NAME: string;
		SSH_AUTH_SOCK: string;
		npm_package_private: string;
		npm_package_devDependencies__stripe_stripe_js: string;
		MEMORY_PRESSURE_WRITE: string;
		XMODIFIERS: string;
		DESKTOP_SESSION: string;
		LC_MONETARY: string;
		EDITOR: string;
		npm_package_scripts_test_unit: string;
		npm_package_scripts_cf_typegen: string;
		GIT_INDEX_FILE: string;
		PWD: string;
		npm_package_devDependencies_svelte_headless_table: string;
		npm_package_devDependencies_vite: string;
		XDG_SESSION_DESKTOP: string;
		LOGNAME: string;
		QT_QPA_PLATFORMTHEME: string;
		XDG_SESSION_TYPE: string;
		npm_package_devDependencies__typescript_eslint_parser: string;
		PNPM_HOME: string;
		SYSTEMD_EXEC_PID: string;
		npm_package_scripts_build: string;
		npm_package_dependencies_mapbox_gl: string;
		XAUTHORITY: string;
		npm_package_devDependencies_stripe: string;
		npm_package_devDependencies_prettier: string;
		npm_package_devDependencies_eslint_config_prettier: string;
		GIT_AUTHOR_DATE: string;
		MOTD_SHOWN: string;
		GDM_LANG: string;
		GIT_EXEC_PATH: string;
		HOME: string;
		USERNAME: string;
		LC_PAPER: string;
		LANG: string;
		npm_package_devDependencies_typescript: string;
		LS_COLORS: string;
		XDG_CURRENT_DESKTOP: string;
		npm_package_version: string;
		MEMORY_PRESSURE_WATCH: string;
		VTE_VERSION: string;
		npm_package_devDependencies__typescript_eslint_eslint_plugin: string;
		WAYLAND_DISPLAY: string;
		npm_package_dependencies__tanstack_react_query_devtools: string;
		npm_package_scripts_test_integration: string;
		npm_package_devDependencies_svelte_stripe: string;
		GNOME_TERMINAL_SCREEN: string;
		npm_package_dependencies_clsx: string;
		npm_package_devDependencies_prettier_plugin_svelte: string;
		npm_package_devDependencies__cloudflare_workers_types: string;
		GIT_AUTHOR_EMAIL: string;
		GIT_PREFIX: string;
		INIT_CWD: string;
		npm_package_scripts_format: string;
		npm_package_devDependencies_wrangler: string;
		npm_package_scripts_preview: string;
		npm_lifecycle_script: string;
		NVM_DIR: string;
		GNOME_SETUP_DISPLAY: string;
		npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
		npm_package_devDependencies_svelte_check: string;
		XDG_SESSION_CLASS: string;
		TERM: string;
		LC_IDENTIFICATION: string;
		npm_package_name: string;
		ZSH: string;
		npm_package_type: string;
		USER: string;
		npm_config_frozen_lockfile: string;
		npm_package_devDependencies_vitest: string;
		GNOME_TERMINAL_SERVICE: string;
		npm_package_devDependencies_sveltekit_superforms: string;
		npm_package_dependencies_dotenv: string;
		DISPLAY: string;
		npm_lifecycle_event: string;
		SHLVL: string;
		NVM_CD_FLAGS: string;
		npm_package_scripts_deploy: string;
		npm_package_dependencies__internationalized_date: string;
		GIT_EDITOR: string;
		PAGER: string;
		npm_package_devDependencies_eslint: string;
		LC_TELEPHONE: string;
		QT_IM_MODULE: string;
		LC_MEASUREMENT: string;
		npm_config_user_agent: string;
		npm_package_scripts_lint: string;
		PNPM_SCRIPT_SRC_DIR: string;
		npm_execpath: string;
		npm_package_devDependencies__sveltejs_adapter_auto: string;
		npm_package_devDependencies_svelte: string;
		npm_package_scripts_test: string;
		XDG_RUNTIME_DIR: string;
		npm_package_dependencies_tailwind_variants: string;
		NODE_PATH: string;
		npm_package_devDependencies_zod: string;
		DEBUGINFOD_URLS: string;
		npm_package_devDependencies__sveltejs_adapter_cloudflare: string;
		npm_package_dependencies_bits_ui: string;
		LC_TIME: string;
		npm_package_scripts_dev: string;
		npm_package_devDependencies__tailwindcss_typography: string;
		npm_package_devDependencies__types_mapbox_gl: string;
		QT_AUTO_SCREEN_SCALE_FACTOR: string;
		XDG_DATA_DIRS: string;
		npm_package_dependencies_tailwind_merge: string;
		npm_package_scripts_check: string;
		GIT_AUTHOR_NAME: string;
		PATH: string;
		npm_package_devDependencies__types_eslint: string;
		npm_package_dependencies_svelte_sonner: string;
		npm_config_node_gyp: string;
		GDMSESSION: string;
		npm_package_devDependencies__sveltejs_kit: string;
		npm_package_dependencies_dayjs: string;
		npm_package_dependencies_formsnap: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		npm_package_devDependencies__playwright_test: string;
		npm_package_dependencies__tanstack_svelte_query: string;
		NVM_BIN: string;
		MAIL: string;
		npm_config_registry: string;
		npm_package_devDependencies_postcss: string;
		npm_node_execpath: string;
		npm_config_engine_strict: string;
		LC_NUMERIC: string;
		OLDPWD: string;
		VITE_USER_NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
