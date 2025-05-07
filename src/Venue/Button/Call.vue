<template>
	<a
		class="chalky venue-button-call btn button-tertiary size-small"
		target="_blank"
		v-bind:href="'tel:' + venueModel.getPhone()"
		v-if="venueModel.getPhone()"
	>
		<i class="icon fa fa-phone"></i>
		<span>Call</span>
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
	export default class VenueButtonCall extends ViewBase {
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
	.chalky.venue-button-call {
		align-items: center;
		display: inline-flex;
		flex-grow: 1;
		gap: 0.5em;
		justify-content: center;
	}
</style>
