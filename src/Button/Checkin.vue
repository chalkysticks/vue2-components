<template>
	<button class="chalky button-checkin btn button-primary size-small" name="btnCheckin" type="submit" v-on:click="Handle_OnClick">
		<span>I'm Here</span>
	</button>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * @author ChalkySticks LLC
	 * @package Button
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class ButtonLogin extends ViewBase {
		/**
		 * @type ChalkySticks/Model/Venue
		 */
		@Prop({
			default: () => new ChalkySticks.Model.Venue(),
		})
		public venueModel!: ChalkySticks.Model.Venue;

		/**
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClick(e: PointerEvent): Promise<void> {
			e.preventDefault();

			// Checkin
			await this.venueModel.checkin();

			// Event
			this.$emit('checkin');
		}
	}
</script>

<style lang="scss">
	.chalky.button-login {
		// Not implemented
	}
</style>
