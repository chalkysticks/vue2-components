<template>
	<section class="chalky tv-schedulelist">
		<ChalkyTvScheduleItem
			v-bind:style="{
				height: `calc(var(--chalky-tv-hour-height) * (${model.getDuration()} / 3600) - var(--scheduleitem-margin))`,
			}"
			v-bind:key="index"
			v-bind:subtitle="model.getDescription()"
			v-bind:title="model.getTitle()"
			v-for="(model, index) in filteredScheduleCollection"
		/>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * @author ChalkySticks LLC
	 * @package TV
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class TVScheduleList extends ViewBase {
		/**
		 * Sort by time and truncate the collection
		 *
		 * @return ChalkySticks/Collection/Schedule
		 */
		public get filteredScheduleCollection(): ChalkySticks.Collection.Schedule {
			const currentModel: ChalkySticks.Model.Schedule = this.scheduleCollection.getCurrentVideo();
			const indexOfCurrent: number = this.scheduleCollection.models.indexOf(currentModel);
			const models: ChalkySticks.Model.Schedule[] = this.scheduleCollection.slice(indexOfCurrent);
			const collection: ChalkySticks.Collection.Schedule = ChalkySticks.Collection.Schedule.hydrate(models);

			return collection;
		}

		/**
		 * @type ChalkySticks/Collection/Schedule
		 */
		@Prop({
			default: () => {
				return new ChalkySticks.Collection.Schedule({
					baseUrl: ChalkySticks.Core.Constants.API_URL_V1,
				});
			},
		})
		public scheduleCollection!: ChalkySticks.Collection.Schedule;
	}
</script>

<style lang="scss">
	.tv-schedulelist {
		.tv-scheduleitem {
			margin: var(--chalky-tv-schedule-item-margin);
			min-width: var(--chalky-tv-schedule-item-width);
		}
	}
</style>
