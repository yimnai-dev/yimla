interface Document {
	startViewTransition: (...args: unknown[]) => Promise<void>;
}