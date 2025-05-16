<template>
	<a
		class="chalky venue-button-directions"
		target="_blank"
		v-bind:class="[`button-${type}`, `size-${size}`]"
		v-bind:href="getMapUrl()"
		v-if="venueModel.getAddress()"
	>
		<i v-if="useIcon" class="icon fa fa-map-marker"></i>
		<span>Directions</span>
	</a>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * @author ChalkySticks LLC
	 * @package Venue/Button
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class VenueButtonDirections extends ViewBase {
		/**
		 * @type string
		 */
		@Prop({ default: 'x-small' })
		public size!: string;

		/**
		 * @type string
		 */
		@Prop({ default: 'secondary' })
		public type!: string;

		/**
		 * @type boolean
		 */
		@Prop({ default: false })
		public useIcon!: boolean;

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
	.chalky.venue-button-directions {
		align-items: center;
		display: inline-flex;
		flex-grow: 1;
		gap: 0.5em;
		justify-content: center;
	}
</style>
