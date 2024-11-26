<template>
	<section class="chalky venue-map">
		<GmapMap
			map-type-id="terrain"
			style="width: 100%; height: 100%"
			ref="map"
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
			v-on:bounds_changed="Handle_OnBoundsChanged"
			v-on:click="Handle_OnClickMap"
		>
			<div class="marker-container" v-bind:key="index" v-for="(marker, index) in markers.map" v-on:click="Handle_OnClickMarkerContainer">
				<GmapMarker
					class="icon icon-marker"
					v-bind:clickable="true"
					v-bind:draggable="false"
					v-bind:icon="getMarkerIcon(marker)"
					v-bind:position="marker.position"
					v-on:click="Handle_OnClickMarker($event, marker)"
				/>
			</div>

			<div class="beacon-container" v-bind:key="index" v-for="(beacon, index) in markers.beacon" v-on:click="Handle_OnClickMarkerContainer">
				<GmapMarker
					class="icon icon-beacon"
					v-bind:clickable="true"
					v-bind:draggable="false"
					v-bind:icon="getMarkerIcon(beacon)"
					v-bind:position="beacon.position"
					v-on:click="Handle_OnClickBeacon($event, beacon)"
				/>
			</div>
		</GmapMap>
		<slot></slot>
	</section>
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
		 * @type number
		 */
		public static MARKER_SIZE: number = 40;

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
		public icons: Record<string, string> = {
			beacon: require('../Assets/image/markers/pool-player-2.png'),
			default: require('../Assets/image/markers/marker.svg'),
			one: require('../Assets/image/markers/pin-1.svg'),
			three: require('../Assets/image/markers/pin-3.svg'),
			two: require('../Assets/image/markers/pin-2.svg'),
		};

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
		 * @type ChalkySticks/Collection/Beacon
		 */
		@Prop({
			default: () =>
				new ChalkySticks.Collection.Beacon({
					baseUrl: ChalkySticks.Core.Constants.API_URL_V1,
				}),
		})
		public beaconCollection!: ChalkySticks.Collection.Beacon;

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
		 * @type Record<stirng, IGoogleMapMarker[]>
		 */
		protected markers: Record<string, IGoogleMapMarker[]> = {
			beacon: [],
			map: [],
		};

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

			// Set range for the beacon search
			this.beaconCollection.setQueryParams({
				d: 1000 * 5,
				lat: this.latitude,
				lon: this.longitude,
			});

			// Check if we need to load data
			if (!this.venueCollection.length) {
				this.beaconCollection.fetch();
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
			this.beaconCollection.on('add', this.Handle_OnAddBeacon);
			this.venueCollection.on('add', this.Handle_OnAddVenue);
		}

		/**
		 * @return void
		 */
		@beforeDestroy
		public detachEvents(): void {
			this.beaconCollection.off('add', this.Handle_OnAddBeacon);
			this.venueCollection.off('add', this.Handle_OnAddVenue);
		}

		/**
		 * @param IGoogleMapMarker marker
		 * @return IGoogleMapMarkerIcon
		 */
		protected getMarkerIcon(marker: IGoogleMapMarker): IGoogleMapMarkerIcon {
			let url: string = this.icons.default;

			if (marker.model instanceof ChalkySticks.Model.Beacon) {
				url = this.icons.beacon;
			} else {
				// switch (marker.model.getType()) {
				// 	case 'bar':
				// 		url = this.icons.one;
				// 		break;

				// 	case 'hall':
				// 		url = this.icons.two;
				// 		break;

				// 	case 'hotel':
				// 		url = this.icons.three;
				// 		break;
				// }

				url = this.icons.default;
			}

			return {
				scaledSize: {
					height: VenueMap.MARKER_SIZE,
					width: VenueMap.MARKER_SIZE,
				},
				url: url,
			};
		}

		/**
		 * @return void
		 */
		protected populateBeacons(): void {
			this.markers.beacon = [];

			for (const beaconModel of this.beaconCollection) {
				this.markers.beacon.push({
					model: beaconModel,
					name: beaconModel.user.getName(),
					position: {
						lat: beaconModel.getLatitude(),
						lng: beaconModel.getLongitude(),
					},
				});
			}
		}

		/**
		 * @return void
		 */
		protected populateMarkers(): void {
			this.markers.map = [];

			for (const venueModel of this.venueCollection) {
				this.markers.map.push({
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
		protected async Handle_OnAddBeacon(): Promise<void> {
			this.populateBeacons();
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnAddVenue(): Promise<void> {
			this.populateMarkers();
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnBoundsChanged(): Promise<void> {
			ChalkySticks.Core.Utility.Debounce.exec(
				this.symbol,
				() => {
					if (!this.$refs.map || !(this.$refs.map as any)?.$mapObject) {
						return;
					}

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
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickMap(e: PointerEvent): Promise<void> {
			this.$emit('click', e);
		}

		/**
		 * @param Event e
		 * @param IGoogleMapMarker marker
		 * @return Promise<void>
		 */
		protected async Handle_OnClickBeacon(e: any, marker: IGoogleMapMarker): Promise<void> {
			this.$emit('beacon:click', marker.model);
		}

		/**
		 * @param Event e
		 * @param IGoogleMapMarker marker
		 * @return Promise<void>
		 */
		protected async Handle_OnClickMarker(e: any, marker: IGoogleMapMarker): Promise<void> {
			this.$emit('marker:click', marker.model);
		}

		/**
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickMarkerContainer(e: PointerEvent): Promise<void> {
			e.stopPropagation();
		}

		/**
		 * @param IMapPosition e
		 * @return Promise<void>
		 */
		protected async Handle_OnMapMove(position: IMapPosition): Promise<void> {
			if (this.autoFetch) {
				this.venueCollection
					.setQueryParams({
						lat: position.latitude || 0,
						lon: position.longitude || 0,
					})
					.fetch();

				this.beaconCollection
					.setQueryParams({
						lat: position.latitude || 0,
						lon: position.longitude || 0,
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

		.icon-marker,
		.icon-beacon {
			height: 32px;
			width: 32px;
		}

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

	// Variations
	// ---------------------------------------------------------------------------

	.chalky.venue-map.hide-streetview button[title*='Street View'] {
		display: none;
	}
</style>
