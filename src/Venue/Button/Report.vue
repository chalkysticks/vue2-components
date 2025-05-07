<template>
	<a class="chalky venue-button-report btn button-tertiary size-small" v-bind:href="'javascript:void(0)'" v-on:click="Handle_OnClickReport">
		<i class="icon fa fa-flag"></i>
		<span>Report</span>
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
	export default class VenueButtonReport extends ViewBase {
		/**
		 * @type ChalkySticks/Model/Venue
		 */
		@Prop({
			default: () => new ChalkySticks.Model.Venue(),
		})
		public venueModel!: ChalkySticks.Model.Venue;

		/**
		 * @type string[]
		 */
		public reportReasons: string[] = [
			'Incorrect information',
			'Venue permanently closed',
			'Venue temporarily closed',
			'Inappropriate content',
			'Duplicate venue',
			'Other',
		];

		/**
		 * Submit a report for this venue
		 * This method would typically be called from a parent component
		 * after the user has selected a reason and provided details
		 *
		 * @param reason string - The reason for the report
		 * @param details string - Additional details provided by the user
		 * @return Promise<boolean>
		 */
		public async submitReport(reason: string, details: string): Promise<boolean> {
			try {
				// Here you would typically make an API call to submit the report
				// For example:
				// await ChalkySticks.Api.Venue.Report.create({
				//   venueId: this.venueModel.id,
				//   reason,
				//   details,
				// });

				// For now, just emit a success event
				this.$emit('report:success', {
					venueId: this.venueModel.id,
					reason,
					details,
				});

				return true;
			} catch (error) {
				this.$emit('report:error', error);
				return false;
			}
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * Handler for when user clicks the report button
		 *
		 * @return Promise<void>
		 */
		protected async Handle_OnClickReport(): Promise<void> {
			this.$emit('report:click', {
				reportReasons: this.reportReasons,
				venueId: this.venueModel.id,
				venueName: this.venueModel.getName(),
			});
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.venue-button-report {
		align-items: center;
		display: inline-flex;
		flex-grow: 1;
		gap: 0.5em;
		justify-content: center;
	}
</style>
