<template>
	<section class="chalky tv-livelist">
		<section class="list" v-if="scheduleCollection.length">
			<ChalkyTvVideoPreview
				class="item"
				v-for="scheduleModel in scheduleCollection.models"
				v-bind:key="scheduleModel.cid"
				v-bind:scheduleModel="scheduleModel"
			/>
		</section>

		<section class="no-content" v-else>
			<p>No live streams available.</p>
		</section>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package TV
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class TVLiveList extends ViewBase {
		/**
		 * @type ChalkySticks/Collection/Schedule
		 */
		@Prop({
			default: () => {
				return new ChalkySticks.TV.Collection.Live({
					// ChalkySticks.Core.Constants.API_URL_DEV_V1,
					baseUrl: ChalkySticks.Core.Constants.API_URL_V1,
				});
			},
		})
		public scheduleCollection!: ChalkySticks.Collection.Schedule;

		/**
		 * @constructor
		 */
		constructor() {
			super();

			// Fetch the schedule collection
			this.scheduleCollection.fetch();
		}

		/**
		 * @return void
		 */
		@mounted
		public attachEvents(): void {
			ChalkySticks.Core.Utility.Interval.add(() => this.Handle_OnInterval(), 1000, this.cid);
		}

		/**
		 * @return void
		 */
		@beforeDestroy
		public detachEvents(): void {
			ChalkySticks.Core.Utility.Interval.remove(this.cid);
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnInterval(): Promise<void> {
			// Do nothing
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.tv-livelist {
		.list {
			display: flex;
			flex-wrap: wrap;
			gap: 1rem;
			justify-content: space-between;
			margin: 0 auto;
			max-width: 100%;
			padding: 1rem;

			.item {
				display: inline-block;
			}
		}
	}
</style>
