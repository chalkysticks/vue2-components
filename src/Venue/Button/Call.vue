<template>
	<a
		class="chalky venue-button-call"
		target="_blank"
		v-bind:class="[`button-${type}`, `size-${size}`]"
		v-bind:disabled="!venueModel.getPhone()"
		v-bind:href="'tel:' + venueModel.getPhone()"
		v-if="venueModel.getPhone()"
	>
		<i v-if="useIcon" class="icon fa fa-phone"></i>
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
		 * @type string
		 */
		@Prop({ default: 'small' })
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
