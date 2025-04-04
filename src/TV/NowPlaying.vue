<template>
	<section
		class="chalky tv-nowplaying"
		v-bind:class="{
			'state-has-video': hasVideo,
		}"
	>
		<slot name="before"></slot>

		<ChalkyTvScheduleItem v-if="hasVideo" v-bind:scheduleModel="currentVideo">
			<slot></slot>
		</ChalkyTvScheduleItem>

		<ChalkyTvScheduleItem v-else title="" subtitle="Nothing Playing" />

		<slot name="after"></slot>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { created, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package TV
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class TVNowPlaying extends ViewBase {
		/**
		 * @return ChalkySticks.Model.Schedule
		 */
		protected get currentVideo(): ChalkySticks.Model.Schedule {
			return this.scheduleCollection.getCurrentVideo();
		}

		/**
		 * @return boolean
		 */
		protected get hasVideo(): boolean {
			return !!this.currentVideo;
		}

		/**
		 * @type ChalkySticks.Enum.GameType
		 */
		@Prop({
			default: ChalkySticks.Enum.GameType.All,
		})
		public gameType!: ChalkySticks.Enum.GameType;

		/**
		 * @type ChalkySticks/Collection/Schedule
		 */
		@Prop({
			default: () => ChalkySticks.Factory.Schedule.collection(),
		})
		public scheduleCollection!: ChalkySticks.Collection.Schedule;

		/**
		 * @return Promise<void>
		 */
		@created
		protected async afterCreate(): Promise<void> {
			// Set the query parameter for the game type
			this.scheduleCollection.setChannel(this.gameType);

			// Fetch the schedule
			if (this.scheduleCollection.shouldFetch()) {
				await this.scheduleCollection.fetch();
			}
		}
	}
</script>

<style lang="scss">
	.tv-nowplaying {
		width: 100%;
	}
</style>
