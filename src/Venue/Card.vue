<template>
	<div class="chalky venue-card glass-panel" v-bind:class="'type-' + venueModel.getType()">
		<section class="gallery">
			<picture v-bind:key="index" v-for="(media, index) in venueModel.media">
				<source v-bind:srcset="media.getUrl()" />
				<img src="https://map.chalkysticks.com/image/backgrounds/no-photos-venue.jpg" alt="" />
			</picture>

			<picture v-if="venueModel.media.length == 0">
				<img src="https://map.chalkysticks.com/image/backgrounds/no-photos-venue.jpg" alt="" />
			</picture>
		</section>

		<section class="content" v-if="venueModel.getName()">
			<section class="title">
				<h3 class="name">{{ venueModel.getName() }}</h3>
			</section>

			<section class="rating">
				<span>{{ rating }}</span>
			</section>

			<address class="address">
				<span class="address">{{ venueModel.getAddress() }}</span>
			</address>

			<section class="details">
				<span
					class="detail tag badge"
					v-bind:class="venueDetailModel.getKey()"
					v-bind:key="venueDetailModel.getKey()"
					v-for="venueDetailModel in venueModel.detail"
				>
					{{ venueDetailModel.getValue() }}
				</span>
			</section>

			<section class="description">
				<p>{{ venueModel.getDescription() }}</p>
			</section>

			<section class="actions">
				<a
					class="btn button-tertiary size-small action"
					target="_blank"
					v-bind:href="'tel:' + venueModel.getPhone()"
					v-if="venueModel.getPhone()"
				>
					<i class="icon fa fa-phone"></i>
					<span class="caption">Call</span>
				</a>
				<a class="btn button-tertiary size-small action" target="_blank" v-bind:href="venueModel.getWebsite()" v-if="venueModel.getWebsite()">
					<i class="icon fa fa-globe"></i>
					<span class="caption">Website</span>
				</a>
				<a class="btn button-tertiary size-small action" target="_blank" v-bind:href="getMapUrl()" v-if="venueModel.getAddress()">
					<i class="icon fa fa-map-marker"></i>
					<span class="caption">Map</span>
				</a>
			</section>

			<section class="is-open" v-if="false">
				<span class="detail tag badge type-dark">Open Now</span>
			</section>

			<section class="distance" v-if="$store.getters['location/hasPosition']">
				<svg width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 438.536 438.536">
					<g>
						<path
							d="M322.621,42.825C294.073,14.272,259.619,0,219.268,0c-40.353,0-74.803,14.275-103.353,42.825 c-28.549,28.549-42.825,63-42.825,103.353c0,20.749,3.14,37.782,9.419,51.106l104.21,220.986 c2.856,6.276,7.283,11.225,13.278,14.838c5.996,3.617,12.419,5.428,19.273,5.428c6.852,0,13.278-1.811,19.273-5.428 c5.996-3.613,10.513-8.562,13.559-14.838l103.918-220.986c6.282-13.324,9.424-30.358,9.424-51.106 C365.449,105.825,351.176,71.378,322.621,42.825z M270.942,197.855c-14.273,14.272-31.497,21.411-51.674,21.411 s-37.401-7.139-51.678-21.411c-14.275-14.277-21.414-31.501-21.414-51.678c0-20.175,7.139-37.402,21.414-51.675 c14.277-14.275,31.504-21.414,51.678-21.414c20.177,0,37.401,7.139,51.674,21.414c14.274,14.272,21.413,31.5,21.413,51.675 C292.355,166.352,285.217,183.575,270.942,197.855z"
						/>
					</g>
				</svg>

				<span>{{ distance }} mi</span>
			</section>
		</section>
	</div>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * @class VenueCard
	 * @package Venue
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class VenueCard extends ViewBase {
		/**
		 * @return string
		 */
		public get distance(): string {
			const myLatitude = this.$store.getters['location/latitude'];
			const myLongitude = this.$store.getters['location/longitude'];
			const venueLatitude = this.venueModel.getLatitude();
			const venueLongitude = this.venueModel.getLongitude();
			const distance = ChalkySticks.Utility.Geolocation.distanceBetween(myLatitude, myLongitude, venueLatitude, venueLongitude);

			return distance.toFixed(2);
		}

		/**
		 * @return string
		 */
		public get rating(): string {
			return '★ ★ ★ ★ ★';
		}

		/**
		 * @type ChalkySticks/Model/Venue
		 */
		@Prop({
			default: () => new ChalkySticks.Model.Venue(),
		})
		public venueModel!: ChalkySticks.Model.Venue;

		/**
		 * @return string
		 */
		protected getMapUrl(): string {
			let output: string;

			// Set root url
			output = 'https://www.google.com/maps/place/';

			// Set address
			output += encodeURIComponent(this.venueModel.getAddress());

			return output;
		}
	}
</script>

<style lang="scss">
	.chalky.venue-card {
		border-radius: var(--rounded-corner-outer);
		padding: 0.5rem;
		position: relative;
		max-width: 480px;

		.title {
			float: left;
			margin-right: 1rem;
			max-width: 50%;

			h1 {
				font-size: 1.25em;
			}
		}

		.description {
			clear: both;
		}

		.rating {
			display: block;
			transform: translate(0, 2px);
		}

		.gallery {
			background-color: rgba(255, 255, 255, 0.75);
			border-radius: var(--rounded-corner);
			overflow: hidden;

			picture {
				aspect-ratio: 16 / 9;
				display: none;

				&:first-child {
					display: block;
					width: 100%;

					img {
						height: 100%;
						object-fit: cover;
						width: 100%;
					}
				}
			}

			&:not(:last-child) {
				border-bottom-left-radius: 0;
				border-bottom-right-radius: 0;
			}
		}

		.gallery + .content {
			background: rgba(255, 255, 255, 0.75);
			color: var(--chalky-blue);
			padding: 1rem;
		}

		.content {
			border-radius: var(--rounded-corner-outer);
			border-top-left-radius: 0;
			border-top-right-radius: 0;

			&:empty {
				display: none;
			}
		}

		.address {
			clear: both;
			margin-bottom: 1.5rem;
		}

		.actions {
			align-items: center;
			display: flex;
			gap: 0.5rem;
			justify-content: space-between;
			margin-top: 3em;

			.action {
				display: inline-block;
				// flex: 1;
				flex-grow: 1;
			}
		}

		.is-open {
			position: absolute;
			right: 1.125rem;
			top: 1rem;
		}

		.distance {
			align-items: center;
			display: flex;
			flex-direction: column;
			font-size: var(--font-size-small);
			font-weight: var(--font-weight-bold);
			justify-content: center;
			letter-spacing: -0.05em;
			gap: 0.25rem;
		}
	}

	// Variations
	// ---------------------------------------------------------------------------

	.chalky.venue-card:not(.list-item) {
		.distance {
			display: none;
		}
	}

	.chalky.venue-card.list-item {
		display: grid;
		grid-column-gap: 0px;
		grid-row-gap: 0px;
		grid-template-columns: auto 1fr;
		grid-template-rows: auto auto auto;
		// height: var(--thumbnail-size);
		max-width: 100%;
		padding: 0;

		.gallery {
			align-items: center;
			display: flex;
			padding: 0;

			picture {
				border-radius: var(--rounded-corner);
				height: var(--thumbnail-size);
				overflow: hidden;
				width: calc(var(--thumbnail-size) * 1.5);
			}
		}

		.content {
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding: 0 1rem;
			padding-right: 60px;

			.title {
				align-content: flex-end;
				max-width: 100%;

				h3 {
					font-size: var(--font-size-medium);
				}
			}

			.address {
				align-content: flex-start;
				font-size: var(--font-size-small);
				line-height: 1.25;
				margin-bottom: 0;
			}

			.distance {
				position: absolute;
				right: 1rem;
				top: 50%;
				transform: translate(0, -50%);
			}
		}

		.gallery,
		.content {
			border-radius: 0;
		}

		.gallery {
			border-top-left-radius: var(--rounded-corner);
			border-bottom-left-radius: var(--rounded-corner);
		}

		.content {
			border-top-right-radius: var(--rounded-corner);
			border-bottom-right-radius: var(--rounded-corner);
		}

		.details,
		.description,
		.rating,
		.actions {
			display: none;
		}
	}

	// Media Queries
	// ---------------------------------------------------------------------------

	@container (min-width: 400px) {
		.chalky.venue-card {
			--thumbnail-size: 60px;
		}
	}
</style>
