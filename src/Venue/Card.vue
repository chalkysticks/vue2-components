<template>
	<div class="chalky venue-card" :class="'type-' + venueModel.getType()">
		<section class="gallery">
			<picture v-for="media in venueModel.media">
				<source :srcset="media.getUrl()">
				<img src="https://map.chalkysticks.com/image/backgrounds/no-photos-venue.jpg" alt="">
			</picture>
			<picture v-if="venueModel.media.length == 0">
				<img src="https://map.chalkysticks.com/image/backgrounds/no-photos-venue.jpg" alt="">
			</picture>
		</section>

		<header class="title">
			<h1 class="name">{{ venueModel.getName() }}</h1>
		</header>

		<section class="details">
			<span class="detail tag" :class="venueDetailModel.getKey()" v-for="venueDetailModel in venueModel.detail">
				{{ venueDetailModel.getValue() }}
			</span>
		</section>

		<section class="description">
			<p>{{ venueModel.getDescription() }}</p>
		</section>

		<section class="actions">
			<a class="action" target="_blank" :href="'tel:' + venueModel.getPhone()" v-if="venueModel.getPhone()">
				<i class="icon fa fa-phone"></i>
				<span class="caption">{{ venueModel.getPhone() }}</span>
			</a>
			<a class="action" target="_blank" :href="venueModel.getWebsite()" v-if="venueModel.getWebsite()">
				<i class="icon fa fa-globe"></i>
				<span class="caption">Website</span>
			</a>
			<a class="action" target="_blank" :href="getMapUrl()" v-if="venueModel.getAddress()">
				<i class="icon fa fa-map-marker"></i>
				<span class="caption">View Map</span>
			</a>
		</section>

		<address class="address">
			<span class="address">{{ venueModel.getAddress() }}</span>
		</address>
	</div>
</template>

<script lang="ts">
	import ViewBase from '../Core/Base';
	import { Core, Venues } from '@chalkysticks/sdk';
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
			default: () => new Venues.Model.Venue,
		})
		public venueModel!: Venues.Model.Venue;

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
		max-width: 480px;

		header {
			h1 {
				font-size: 1.25em;
			}
		}

		.gallery {
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
		}

		.details {
			.tag {
				border-radius: 0.25em;
				font-size: 0.75em;
				padding: 0.25em 0.5em;
				margin: 0.25em;

				&:first-child {
					margin-left: 0;
				}
			}
		}

		.actions {
			.action {
				display: inline-block;
			}
		}
	}
</style>
