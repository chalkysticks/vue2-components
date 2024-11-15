<template>
	<section class="chalky venue-gallery">
		<picture v-bind:key="index" v-for="(media, index) in venueModel.media">
			<source v-bind:srcset="media.getUrl()" />
			<img src="https://map.chalkysticks.com/image/backgrounds/no-photos-venue.jpg" alt="" />
		</picture>

		<picture v-if="venueModel.media.length == 0">
			<img src="https://map.chalkysticks.com/image/backgrounds/no-photos-venue.jpg" alt="" />
		</picture>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package Venue
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class VenueGallery extends ViewBase {
		/**
		 * @type ChalkySticks/Model/Venue
		 */
		@Prop({
			default: () => new ChalkySticks.Model.Venue(),
		})
		public venueModel!: ChalkySticks.Model.Venue;
	}
</script>

<style lang="scss">
	.venue-gallery {
		// Not implemented
	}
</style>
