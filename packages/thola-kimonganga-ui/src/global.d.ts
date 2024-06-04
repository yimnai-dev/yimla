declare global {
	namespace svelteHTML {
		interface HTMLAttributes {
			'stripe-pricing-table': {
				pricingTableId: string;
				publishableKey: string;
			};
		}
		
		// style attributes interface? 

	}
}

interface CSSStyleDeclaration {
	'--pt-color-primary': string;
}

interface Document {
	startViewTransition: (...args: unknown[]) => Promise<void>;
}