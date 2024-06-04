/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_MAPBOX_API_KEY: string;
	readonly VITE_STRIPE_PUBLISHABLE_TEST_KEY: string;
	readonly VITE_STRIPE_PRICING_TABLE_TEST_ID: string;
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
