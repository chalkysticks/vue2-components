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
			<header class="title">
				<h3 class="name">{{ venueModel.getName() }}</h3>
			</header>

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
				<a class="btn action" target="_blank" v-bind:href="'tel:' + venueModel.getPhone()" v-if="venueModel.getPhone()">
					<i class="icon fa fa-phone"></i>
					<span class="caption">{{ venueModel.getPhone() }}</span>
				</a>
				<a class="btn action" target="_blank" v-bind:href="venueModel.getWebsite()" v-if="venueModel.getWebsite()">
					<i class="icon fa fa-globe"></i>
					<span class="caption">Website</span>
				</a>
				<a class="btn action" target="_blank" v-bind:href="getMapUrl()" v-if="venueModel.getAddress()">
					<i class="icon fa fa-map-marker"></i>
					<span class="caption">Map</span>
				</a>
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

		header {
			h1 {
				font-size: 1.25em;
			}
		}

		.gallery {
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
			margin-bottom: 1.5rem;
		}

		.actions {
			align-items: center;
			display: flex;
			gap: 0.5rem;
			justify-content: space-between;

			.action {
				display: inline-block;
				// flex: 1;
				flex-grow: 1;
			}
		}
	}

	.chalky.venue-card:not(.list-item) {
	}
</style>
