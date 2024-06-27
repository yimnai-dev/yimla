<script lang="ts">
	import { page } from '$app/stores';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';

	type Props = {
		latitude: number;
		longitude: number;
		accessToken: string;
	};

	let searchContainer: HTMLDivElement;

	let map: mapboxgl.Map | null = $state(null);

	let search: import('@mapbox/search-js-web').MapboxSearchBox | null = $state(null);

	let { latitude = $bindable(), longitude = $bindable(), accessToken }: Props = $props();
	onMount(() => {
		const locationInfo =
			$page.data.tholaApp === 'thola-org'
				? $page.data.tko.locationInfo
				: $page.data.tholaApp === 'thola-pharmacy'
					? $page.data.tkp.locationInfo
					: $page.data.tkc.locationInfo;
		latitude = locationInfo.lat;
		longitude = locationInfo.lon;
		mapboxgl.accessToken = accessToken;
		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/streets-v12',
			zoom: 15,
			center: [locationInfo.lon, locationInfo.lat]
		});
		import('@mapbox/search-js-web').then((mapboxglsearch) => {
			search = new mapboxglsearch.MapboxSearchBox();
			search.accessToken = accessToken;
			search.options = {
				language: 'en',
				country: 'CM'
			};
			search.mapboxgl = mapboxgl;
			search.marker = true;
			if (map) {
				search.bindMap(map);
			}
			searchContainer.appendChild(search as unknown as Node);
		});
		map.addControl(
			new mapboxgl.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true
				},
				trackUserLocation: true,
				showUserHeading: true
			})
		);
		if (search) {
			map.addControl(search);
		}
		map.on('click', (e: { lngLat: { lat: number; lng: number } }) => {
			const coordinates = e.lngLat;
			latitude = coordinates.lat;
			longitude = coordinates.lng;
		});
	});

	const removeExistingMarkers = () => {
		const els = document.querySelectorAll('.marker');
		els.forEach((el) => el.remove());
	};

	$effect(() => {
		if (!map) return;
		removeExistingMarkers();
		const markerEl = document.createElement('div');
		markerEl.classList.add('marker');
		new mapboxgl.Marker(markerEl).setLngLat({ lng: longitude, lat: latitude }).addTo(map);
	});
</script>

<div class="py-2" bind:this={searchContainer}></div>
<div class="h-[400px] w-full rounded-md shadow-md" id="map"></div>

<style>
	:global(.marker) {
		background-image: url('/images/mapbox-icon.svg');
		background-size: cover;
		width: 42px;
		height: 55px;
		cursor: pointer;
	}
</style>
