<template>
	<div class="chalky venue-map">
		<GmapMap
			map-type-id="terrain"
			style="width: 100%; height: 100%"
			ref="map"
			v-on:bounds_changed="Handle_OnBoundsChanged"
			v-bind:center="{
				lat: latitude,
				lng: longitude,
			}"
			v-bind:options="{
				disableDefaultUi: true,
				fullscreenControl: false,
				mapTypeControl: false,
				rotateControl: false,
				scaleControl: false,
				streetViewControl: true,
				styles: options,
				zoomControl: true,
			}"
			v-bind:zoom="zoom"
		>
			<GmapMarker
				v-bind:clickable="true"
				v-bind:draggable="false"
				v-bind:icon="defaultIcon"
				v-bind:key="index"
				v-bind:position="marker.position"
				v-for="(marker, index) in markers"
				v-on:click="Handle_OnClickMarker($event, marker)"
			/>
		</GmapMap>
	</div>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop, Ref } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '../Utility/Decorators';

	/**
	 * @class VenueMap
	 * @package Venue
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class VenueMap extends ViewBase {
		/**
		 * @type GmapMap
		 */
		@Ref('map')
		public readonly map!: any;

		/**
		 * @type boolean
		 */
		@Prop({
			default: true,
		})
		public autoFetch!: boolean;

		/**
		 * @type string
		 */
		public defaultIcon: string = require('../Assets/image/markers/pin-0.svg');

		/**
		 * @type number
		 */
		@Prop({
			default: 10,
		})
		public latitude!: number;

		/**
		 * @type number
		 */
		@Prop({
			default: 10,
		})
		public longitude!: number;

		/**
		 * @type ChalkySticks/Collection/Venue
		 */
		@Prop({
			default: () =>
				new ChalkySticks.Collection.Venue({
					baseUrl: ChalkySticks.Core.Constants.API_URL_V1,
				}),
		})
		public venueCollection!: ChalkySticks.Collection.Venue;

		/**
		 * @type number
		 */
		@Prop({
			default: 7,
		})
		public zoom!: number;

		/**
		 * @type IGoogleMapMarker[]
		 */
		protected markers: IGoogleMapMarker[] = [];

		/**
		 * @type IGoogleMapOption[]
		 */
		protected options: IGoogleMapOption[] = [
			{
				featureType: 'poi.business',
				stylers: [{ visibility: 'off' }],
			},
			{
				featureType: 'poi.medical',
				stylers: [{ visibility: 'off' }],
			},
			{
				featureType: 'poi.attraction',
				stylers: [{ visibility: 'off' }],
			},
			{
				featureType: 'poi.government',
				stylers: [{ visibility: 'off' }],
			},
			{
				featureType: 'poi.place_of_worship',
				stylers: [{ visibility: 'off' }],
			},
			{
				featureType: 'poi.school',
				stylers: [{ visibility: 'off' }],
			},
			{
				featureType: 'poi.sports_complex',
				stylers: [{ visibility: 'off' }],
			},
		];

		/**
		 * @constructor
		 */
		constructor() {
			super();

			// Check if we need to load data
			if (!this.venueCollection.length) {
				this.venueCollection.fetch();
			} else {
				this.populateMarkers();
			}
		}

		/**
		 * @return void
		 */
		@mounted
		public attachEvents(): void {
			this.venueCollection.on('add', this.Handle_OnAddVenue);
		}

		/**
		 * @return void
		 */
		@beforeDestroy
		public detachEvents(): void {
			this.venueCollection.off('add', this.Handle_OnAddVenue);
		}

		/**
		 * @return void
		 */
		protected populateMarkers(): void {
			this.markers = [];

			for (const venueModel of this.venueCollection) {
				this.markers.push({
					model: venueModel,
					name: venueModel.getName(),
					position: {
						lat: venueModel.getLatitude(),
						lng: venueModel.getLongitude(),
					},
				});
			}
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnAddVenue(): Promise<void> {
			this.populateMarkers();
		}

		/**
		 * @param Event e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickMarker(e: any, marker: IGoogleMapMarker): Promise<void> {
			this.$emit('marker:click', marker.model);
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnBoundsChanged(): Promise<void> {
			ChalkySticks.Core.Utility.Debounce.exec(
				this.symbol,
				() => {
					const mapRef = this.$refs.map as any;
					const center = mapRef.$mapObject.getCenter();
					const lat = center.lat();
					const lng = center.lng();

					this.$emit('map:move', {
						latitude: lat,
						longitude: lng,
					});

					this.Handle_OnMapMove({
						latitude: lat,
						longitude: lng,
					});
				},
				1000,
				true,
			);
		}

		/**
		 * @param object e
		 * @return Promise<void>
		 */
		protected async Handle_OnMapMove(e: { latitude: number; longitude: number }): Promise<void> {
			if (this.autoFetch) {
				this.venueCollection
					.setQueryParams({
						lat: e.latitude,
						lon: e.longitude,
					})
					.fetch();
			}
		}
	}
</script>

<style lang="scss">
	.chalky.venue-map {
		height: 512px;
		width: 512px;

		a[href^="http://maps.google.com/maps"],
		a[href^="https://maps.google.com/maps"]
		{
			display: none !important;
		}

		.gmnoprint a,
		.gmnoprint span,
		.gm-style-cc {
			display: none;
		}

		.gmnoprint div {
			// background: none !important;
		}
	}
</style>
