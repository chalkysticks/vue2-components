<template>
	<section class="chalky venue-hours">
		<div class="today">
			<!-- Add timeline of todays hours -->
		</div>

		<dl>
			<dt class="hours-monday">Monday</dt>
			<dd class="hours-monday">{{ venueModel.hours.getHoursForDay('monday')?.formatHours() }}</dd>

			<dt class="hours-tuesday">Tuesday</dt>
			<dd class="hours-tuesday">{{ venueModel.hours.getHoursForDay('tuesday')?.formatHours() }}</dd>

			<dt class="hours-wednesday">Wednesday</dt>
			<dd class="hours-wednesday">{{ venueModel.hours.getHoursForDay('wednesday')?.formatHours() }}</dd>

			<dt class="hours-thursday">Thursday</dt>
			<dd class="hours-thursday">{{ venueModel.hours.getHoursForDay('thursday')?.formatHours() }}</dd>

			<dt class="hours-friday">Friday</dt>
			<dd class="hours-friday">{{ venueModel.hours.getHoursForDay('friday')?.formatHours() }}</dd>

			<dt class="hours-saturday">Saturday</dt>
			<dd class="hours-saturday">{{ venueModel.hours.getHoursForDay('saturday')?.formatHours() }}</dd>

			<dt class="hours-sunday">Sunday</dt>
			<dd class="hours-sunday">{{ venueModel.hours.getHoursForDay('sunday')?.formatHours() }}</dd>
		</dl>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * @class VenueHours
	 * @package Venue
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({
		components: {},
	})
	export default class VenueHours extends ViewBase {
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
	.chalky.venue-hours {
		.inner {
			margin-top: 1rem;
		}

		dl {
			margin: 1rem 0;

			dt {
				float: left;
				margin-right: 0.5rem;
			}
		}
	}
</style>
