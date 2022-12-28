<template>
	<div class="chalky venue-map" :class="{ }">
		venue map
	</div>
</template>

<script lang="ts">
	import ViewBase from '../Core/Base';
	import { Constants, CollectionVenue, ModelVenue, ModelUser } from '@chalkysticks/sdk';
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
			default: () => new CollectionVenue(),
		})
		public venueCollection!: CollectionVenue;

		/**
		 * @return void
		 */
		public attachEvents(): void {

		}

		/**
		 * @return void
		 */
		public detachEvents(): void {

		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.venue-map {
	}
</style>
