
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
	export const SHELL: string;
	export const LSCOLORS: string;
	export const SESSION_MANAGER: string;
	export const COLORTERM: string;
	export const LESS: string;
	export const NVM_INC: string;
	export const XDG_MENU_PREFIX: string;
	export const LC_ADDRESS: string;
	export const LC_NAME: string;
	export const SSH_AUTH_SOCK: string;
	export const MEMORY_PRESSURE_WRITE: string;
	export const XMODIFIERS: string;
	export const DESKTOP_SESSION: string;
	export const LC_MONETARY: string;
	export const EDITOR: string;
	export const PWD: string;
	export const LOGNAME: string;
	export const XDG_SESSION_DESKTOP: string;
	export const QT_QPA_PLATFORMTHEME: string;
	export const XDG_SESSION_TYPE: string;
	export const PNPM_HOME: string;
	export const SYSTEMD_EXEC_PID: string;
	export const XAUTHORITY: string;
	export const MOTD_SHOWN: string;
	export const GDM_LANG: string;
	export const HOME: string;
	export const USERNAME: string;
	export const LC_PAPER: string;
	export const LANG: string;
	export const LS_COLORS: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const MEMORY_PRESSURE_WATCH: string;
	export const VTE_VERSION: string;
	export const WAYLAND_DISPLAY: string;
	export const GNOME_TERMINAL_SCREEN: string;
	export const NVM_DIR: string;
	export const GNOME_SETUP_DISPLAY: string;
	export const XDG_SESSION_CLASS: string;
	export const TERM: string;
	export const LC_IDENTIFICATION: string;
	export const ZSH: string;
	export const USER: string;
	export const GNOME_TERMINAL_SERVICE: string;
	export const DISPLAY: string;
	export const SHLVL: string;
	export const NVM_CD_FLAGS: string;
	export const PAGER: string;
	export const LC_TELEPHONE: string;
	export const QT_IM_MODULE: string;
	export const LC_MEASUREMENT: string;
	export const XDG_RUNTIME_DIR: string;
	export const NODE_PATH: string;
	export const DEBUGINFOD_URLS: string;
	export const LC_TIME: string;
	export const QT_AUTO_SCREEN_SCALE_FACTOR: string;
	export const XDG_DATA_DIRS: string;
	export const PATH: string;
	export const GDMSESSION: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const NVM_BIN: string;
	export const MAIL: string;
	export const LC_NUMERIC: string;
	export const OLDPWD: string;
	export const NODE_ENV: string;
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
	export const PUBLIC_MAPBOX_API_KEY: string;
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
		SHELL: string;
		LSCOLORS: string;
		SESSION_MANAGER: string;
		COLORTERM: string;
		LESS: string;
		NVM_INC: string;
		XDG_MENU_PREFIX: string;
		LC_ADDRESS: string;
		LC_NAME: string;
		SSH_AUTH_SOCK: string;
		MEMORY_PRESSURE_WRITE: string;
		XMODIFIERS: string;
		DESKTOP_SESSION: string;
		LC_MONETARY: string;
		EDITOR: string;
		PWD: string;
		LOGNAME: string;
		XDG_SESSION_DESKTOP: string;
		QT_QPA_PLATFORMTHEME: string;
		XDG_SESSION_TYPE: string;
		PNPM_HOME: string;
		SYSTEMD_EXEC_PID: string;
		XAUTHORITY: string;
		MOTD_SHOWN: string;
		GDM_LANG: string;
		HOME: string;
		USERNAME: string;
		LC_PAPER: string;
		LANG: string;
		LS_COLORS: string;
		XDG_CURRENT_DESKTOP: string;
		MEMORY_PRESSURE_WATCH: string;
		VTE_VERSION: string;
		WAYLAND_DISPLAY: string;
		GNOME_TERMINAL_SCREEN: string;
		NVM_DIR: string;
		GNOME_SETUP_DISPLAY: string;
		XDG_SESSION_CLASS: string;
		TERM: string;
		LC_IDENTIFICATION: string;
		ZSH: string;
		USER: string;
		GNOME_TERMINAL_SERVICE: string;
		DISPLAY: string;
		SHLVL: string;
		NVM_CD_FLAGS: string;
		PAGER: string;
		LC_TELEPHONE: string;
		QT_IM_MODULE: string;
		LC_MEASUREMENT: string;
		XDG_RUNTIME_DIR: string;
		NODE_PATH: string;
		DEBUGINFOD_URLS: string;
		LC_TIME: string;
		QT_AUTO_SCREEN_SCALE_FACTOR: string;
		XDG_DATA_DIRS: string;
		PATH: string;
		GDMSESSION: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		NVM_BIN: string;
		MAIL: string;
		LC_NUMERIC: string;
		OLDPWD: string;
		NODE_ENV: string;
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
		PUBLIC_MAPBOX_API_KEY: string;
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
