/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly MAPBOX_API_KEY: string;
	readonly STRIPE_PUBLISHABLE_TEST_KEY: string;
	readonly STRIPE_PRICING_TABLE_TEST_ID: string;
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
