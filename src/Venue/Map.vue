<template>
	<section class="chalky venue-map">
		<GmapMap
			map-type-id="terrain"
			style="width: 100%; height: 100%"
			ref="map"
			v-bind:center="{
				lat: centerLatitude,
				lng: centerLongitude,
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
			v-on:drag="Handle_OnDragMap"
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

			<div class="user-container">
				<GmapMarker
					class="icon icon-user"
					v-bind:clickable="false"
					v-bind:draggable="false"
					v-bind:icon="getUserMarker()"
					v-bind:position="{
						lat: userLatitude,
						lng: userLongitude,
					}"
				/>
			</div>
		</GmapMap>
		<slot></slot>
	</section>
</template>

<script lang="ts">
	import * as UtilityMap from '../Utility/Map';
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import gsap from 'gsap';
	import { Component, Prop, Ref } from 'vue-property-decorator';
	import { beforeDestroy, created, mounted } from '../Utility/Decorators';

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
		public static DISTANCE: number = 1000 * 10;

		/**
		 * @type number
		 */
		public static MARKER_SIZE: number = 40;

		/**
		 * @type GmapMap
		 */
		protected get mapObject(): any {
			const mapRef = this.$refs.map as any;
			const center = mapRef.$mapObject;

			return mapRef.$mapObject;
		}

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
			noimages: require('../Assets/image/markers/marker-light.svg'),
			notable: require('../Assets/image/markers/marker-grey.svg'),
			user: require('../Assets/image/markers/user.svg'),
		};

		/**
		 * @type ChalkySticks/Collection/Beacon
		 */
		@Prop({
			default: () =>
				ChalkySticks.Factory.Beacon.collection({
					distance: VenueMap.DISTANCE,
				}),
		})
		public beaconCollection!: ChalkySticks.Collection.Beacon;

		/**
		 * @type number
		 */
		@Prop({ default: 10 })
		public centerLatitude!: number;

		/**
		 * @type number
		 */
		@Prop({ default: 10 })
		public centerLongitude!: number;

		/**
		 * @type boolean
		 */
		@Prop({ default: false })
		public centerOnMarker!: boolean;

		/**
		 * @type number
		 */
		@Prop({ default: 0 })
		public centerOffsetX!: number;

		/**
		 * @type number
		 */
		@Prop({ default: 0 })
		public centerOffsetY!: number;

		/**
		 * @type number
		 */
		@Prop({ default: 0 })
		public centerZoom!: number;

		/**
		 * @type number
		 */
		@Prop({ default: 10 })
		public userLatitude!: number;

		/**
		 * @type number
		 */
		@Prop({ default: 10 })
		public userLongitude!: number;

		/**
		 * @type ChalkySticks/Collection/Venue
		 */
		@Prop({
			default: () =>
				ChalkySticks.Factory.Venue.collection({
					limit: 64,
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

			// fixme
			this.beaconCollection.setQueryParams({
				d: VenueMap.DISTANCE,
				lat: this.centerLatitude,
				lon: this.centerLongitude,
			});
		}

		/**
		 * @return void
		 */
		@mounted
		public afterCreate() {
			if (this.venueCollection.shouldFetch()) {
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
				const hasMedia = marker.model.media.length > 0;
				const hasTable = !!marker.model.media.findWhere({
					subgroup: 'table',
				});

				url = hasMedia ? (hasTable ? this.icons.default : this.icons.noimages) : this.icons.notable;
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
		 * @return IGoogleMapMarkerIcon
		 */
		protected getUserMarker(): IGoogleMapMarkerIcon {
			return {
				scaledSize: {
					height: VenueMap.MARKER_SIZE,
					width: VenueMap.MARKER_SIZE,
				},
				url: this.icons.user,
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
				this.cid + ':bounds',
				() => {
					if (!this.mapObject) {
						return;
					}

					const center = this.mapObject?.getCenter();

					if (!center) {
						return;
					}

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

			if (this.centerOnMarker) {
				const mapCenter = this.mapObject?.getCenter();
				const oldPosition: IGoogleMapPosition = {
					lat: mapCenter?.lat() || this.centerLatitude,
					lng: mapCenter?.lng() || this.centerLongitude,
				};
				const position: IGoogleMapPosition = {
					lat: marker.position.lat,
					lng: marker.position.lng,
				};

				// Convert pixel offsets to coordinate deltas
				const currentMapZoom = this.mapObject?.getZoom() || this.zoom;
				const offsetY = UtilityMap.pixelsToLatitudeDelta(this.centerOffsetY, currentMapZoom);
				const offsetX = UtilityMap.pixelsToLongitudeDelta(this.centerOffsetX, currentMapZoom, position.lat);

				// Adjust position
				position.lat += offsetY;
				position.lng += offsetX;

				// Center on position (this.mapObject.setCenter(position);)
				if (this.mapObject) {
					gsap.to(oldPosition, {
						duration: 0.5,
						lat: position.lat,
						lng: position.lng,
						onUpdate: () => {
							this.mapObject.setCenter(oldPosition);
						},
					});
				}
			}
		}

		/**
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickMarkerContainer(e: PointerEvent): Promise<void> {
			e.stopPropagation();
		}

		/**
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnDragMap(e: PointerEvent): Promise<void> {
			ChalkySticks.Core.Utility.Debounce.exec(
				this.cid + ':drag',
				() => {
					if (!this.mapObject) {
						return;
					}

					const center = this.mapObject?.getCenter();

					if (!center) {
						return;
					}

					const lat = center.lat();
					const lng = center.lng();

					this.$emit('map:drag', {
						latitude: lat,
						longitude: lng,
					});
				},
				1000,
				true,
			);
		}

		/**
		 * @param IMapPosition e
		 * @return Promise<void>
		 */
		protected async Handle_OnMapMove(position: IMapPosition): Promise<void> {
			const coordinates = ChalkySticks.Utility.Geolocation.simplifyCoordinates(position, undefined, 1e2);

			if (this.autoFetch) {
				this.venueCollection.setQueryParams(coordinates).fetch();
				this.beaconCollection.setQueryParams(coordinates).fetch();
			}
		}
	}
</script>

<style lang="scss">
	.chalky.venue-map {
		height: var(--chalky-venue-map-height);
		width: var(--chalky-venue-map-width);

		.icon-marker,
		.icon-beacon {
			height: var(--chalky-venue-map-icon-size);
			width: var(--chalky-venue-map-icon-size);
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
