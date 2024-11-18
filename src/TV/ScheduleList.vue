<template>
	<section class="chalky tv-schedulelist" v-bind:channel="channel" v-bind:class="{ 'state-active': active }" v-bind:key="activeVideoId">
		<ChalkyTvScheduleItem
			v-bind:class="{
				'state-active': activeVideoId == scheduleModel.getVideoId(),
			}"
			v-bind:channel="channel"
			v-bind:data-minutes="scheduleModel.getDuration() / 60"
			v-bind:key="index"
			v-bind:parentOffsetY="nowPositionY"
			v-bind:subtitle="scheduleModel.getDescription()"
			v-bind:title="scheduleModel.getTitle()"
			v-bind:style="{
				height: `calc(var(--chalky-tv-hour-height) * (${scheduleModel.getDuration()} / 3600))`,
			}"
			v-for="(scheduleModel, index) in filteredScheduleCollection"
			v-on:click.native="Handle_OnClickItem($event, scheduleModel, channel)"
		></ChalkyTvScheduleItem>
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
	export default class TVScheduleList extends ViewBase {
		/**
		 * Sort by time and truncate the collection
		 *
		 * @return ChalkySticks/Collection/Schedule
		 */
		public get filteredScheduleCollection(): ChalkySticks.Collection.Schedule {
			// const currentModel: ChalkySticks.Model.Schedule = this.scheduleCollection.getCurrentVideo();
			// const indexOfCurrent: number = this.scheduleCollection.models.indexOf(currentModel);
			// const models: ChalkySticks.Model.Schedule[] = this.scheduleCollection.slice(indexOfCurrent);
			// const collection: ChalkySticks.Collection.Schedule = ChalkySticks.Collection.Schedule.hydrate(models);

			return this.scheduleCollection;
		}

		/**
		 * If this list is in an active channel. This helps with refreshing the content.
		 *
		 * @type boolean
		 */
		@Prop({
			default: false,
		})
		public active!: boolean;

		/**
		 * @type ChalkySticks.Enum.GameType
		 */
		@Prop({
			default: ChalkySticks.Enum.GameType.All,
		})
		public channel!: ChalkySticks.Enum.GameType;

		/**
		 * @type number
		 */
		@Prop({ default: 0 })
		public nowPositionY!: number;

		/**
		 * @type ChalkySticks/Collection/Schedule
		 */
		@Prop({
			default: () => ChalkySticks.Factory.Schedule.collection(),
		})
		public scheduleCollection!: ChalkySticks.Collection.Schedule;

		/**
		 * @type string
		 */
		private activeVideoId: string = '';

		/**
		 * @type string
		 */
		private lastActiveVideoId: string = '';

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
		 * @param PointerEvent e
		 * @param ChalkySticks.Model.Schedule model
		 * @return Promise<void>
		 */
		protected async Handle_OnClickItem(e: PointerEvent, scheduleModel: ChalkySticks.Model.Schedule): Promise<void> {
			this.$emit('select', scheduleModel, this.channel);
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnInterval(): Promise<void> {
			if (!this.active) {
				return;
			}

			// Set active video id
			this.activeVideoId = this.scheduleCollection.getCurrentVideo()?.getVideoId() || '0';

			// Update and trigger changes
			if (this.activeVideoId !== this.lastActiveVideoId) {
				this.lastActiveVideoId = this.activeVideoId;
				this.$emit('change', this.scheduleCollection.getCurrentVideo(), this.channel);
				this.$forceUpdate();
			}
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.tv-schedulelist {
		position: relative;

		.tv-scheduleitem {
			margin: 0 var(--chalky-tv-schedule-gap);
			width: var(--chalky-tv-schedule-item-width);
		}

		&::after {
			background: var(--chalky-blue-4);
			content: ' ';
			height: 100%;
			margin: 0 1px;
			opacity: 0.8;
			position: absolute;
			width: calc(100% - 2px);
		}
	}
</style>
