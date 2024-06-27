import { LOCAL_STORAGE_KEYS } from '$lib/cookie-keys';
import { cartSchema, type CartSchema, type CartItem } from '$lib/forms/medication.form';
import { toast } from 'svelte-sonner';

export function createCart() {
	let cart: CartSchema = $state([]);

	const cartTotal = $derived.by(() => {
		return cart
			.map((item) => item.unitPrice * item.quantity)
			.reduce((acc, subtotal) => acc + subtotal, 0);
	});

	function init() {
		const cartFromStorageString = localStorage.getItem(LOCAL_STORAGE_KEYS.CART);
		if (!cartFromStorageString) return;
		try {
			const json = JSON.parse(cartFromStorageString);
			cartSchema
				.parseAsync(json)
				.then((data) => {
					cart = data;
				})
				.catch(() => {
					localStorage.removeItem(LOCAL_STORAGE_KEYS.CART);
				});
		} catch (error) {
			localStorage.removeItem(LOCAL_STORAGE_KEYS.CART);
		}
	}

	function add(medication: CartItem) {
		cart = [...cart, medication];
		localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cart));
		toast.success('Medication added to cart');
	}

	function remove(drugId: string) {
		cart = cart.filter((item) => item.drugId !== drugId);
		localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cart));
		toast.info('Medication removed from cart');
	}

	function clear() {
		cart = [];
		localStorage.removeItem(LOCAL_STORAGE_KEYS.CART);
		toast.info('Cart cleared');
	}

	function updateItem(drugId: string, quantity: number) {
		cart = cart
			.map((item) => {
				if (item.drugId === drugId) {
					item.quantity = quantity;
				}
				return item;
			})
			.filter((item) => item.quantity > 0);
		localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cart));
		toast.info('Medication quantity updated');
	}

	function getCartItem(drugId: string) {
		return cart.find((item) => item.drugId === drugId);
	}

	return {
		get cart() {
			return cart;
		},
		get cartTotal() {
			return cartTotal;
		},
		init,
		add,
		clear,
		remove,
		updateItem,
		getCartItem
	};
}

export type CartState = ReturnType<typeof createCart>;
