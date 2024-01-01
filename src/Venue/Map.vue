<template>
	<div class="chalky venue-map">
		venue map
	</div>
</template>

<script lang="ts">
	import ViewBase from '../Core/Base';
	import { Venues } from '@chalkysticks/sdk';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * @class VenueMap
	 * @package Venue
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class VenueMap extends ViewBase {
		/**
		 * @type ChalkySticks/Collection/Venue
		 */
		@Prop({
			default: () => new Venues.Collection.Venue(),
		})
		public venueCollection!: Venues.Collection.Venue;
	}
</script>

<style lang="scss">
	.chalky.venue-map {
		// Not implemented
	}
</style>
