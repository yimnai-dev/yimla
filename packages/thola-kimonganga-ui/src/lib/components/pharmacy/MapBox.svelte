<script lang="ts">
	import type { CreatePharmacySchema } from '$lib/forms/pharmacy.form';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	import type { SuperForm } from 'sveltekit-superforms';
	import { dev } from '$app/environment';
	import { env } from '$env/dynamic/private';

	type Props = {
		formData: SuperForm<CreatePharmacySchema>['form'];
	};

	let bueaLongitude = $state(9.243536);
	let bueaLatitude = $state(4.159302);

	let { formData = $bindable() }: Props = $props();
	onMount(() => {
		formData.update(($prev) => {
			return { ...$prev, longitude: bueaLongitude, latitude: bueaLatitude };
		});
		mapboxgl.accessToken = dev ? import.meta.env.VITE_MAPBOX_API_KEY : env.VITE_MAPBOX_API_KEY;
		const map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/streets-v12',
			zoom: 15,
			center: [bueaLongitude, bueaLatitude]
		});
		map.on('click', (e: { lngLat: { lat: number; lng: number } }) => {
			const coordinates = e.lngLat;
			formData.update(($prev) => {
				return { ...$prev, longitude: coordinates.lng, latitude: coordinates.lat };
			});
		});
	});
</script>

<div class="h-[400px] w-full rounded-md shadow-md" id="map"></div>
