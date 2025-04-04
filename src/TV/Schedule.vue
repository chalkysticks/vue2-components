<template>
	<section class="chalky tv-schedule" v-bind:style="{ '--chalky-tv-channel-count': channels.length }">
		<ChalkyTvTimeline v-bind:showNow="true" />

		<div
			class="now"
			ref="nowMarker"
			v-bind:style="{
				top: `calc((var(--chalky-tv-schedule-header-size) + var(--chalky-tv-hour-height) * ${nowPositionY}) )`,
			}"
		>
			<span class="badge bg-danger">Now</span>
		</div>

		<section class="headers layout-horizontal distributed">
			<div
				v-bind:aria-label="channel"
				v-bind:key="index"
				v-bind:class="'channel-header icon-channel-' + channel"
				v-for="(channel, index) in channels"
				v-on:click="Handle_OnChannelClick($event, channel)"
			></div>
		</section>

		<section class="lists">
			<ChalkyTvScheduleList
				v-bind:active="activeChannel == channel"
				v-bind:channel="channel"
				v-bind:key="index"
				v-bind:nowPositionY="scrollTop"
				v-bind:scheduleCollection="channelMap[channel]"
				v-for="(channel, index) in channels"
				v-on:select="Handle_OnChannelItemClick"
			/>
		</section>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop, Ref } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package TV
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class TVSchedule extends ViewBase {
		/**
		 * @type HTMLElement
		 */
		@Ref('nowMarker')
		protected readonly nowMarker!: HTMLElement;

		/**
		 * @return ChalkySticks.Enum.GameType[]
		 */
		protected get channels(): ChalkySticks.Enum.GameType[] {
			return [
				ChalkySticks.Enum.GameType.All,
				ChalkySticks.Enum.GameType.EightBall,
				ChalkySticks.Enum.GameType.NineBall,
				ChalkySticks.Enum.GameType.TenBall,
				ChalkySticks.Enum.GameType.StraightPool,
				ChalkySticks.Enum.GameType.Snooker,
				ChalkySticks.Enum.GameType.Billiards,
				ChalkySticks.Enum.GameType.TrickShots,
				ChalkySticks.Enum.GameType.OnePocket,
			];
		}

		/**
		 * @return Record<ChalkySticks.Enum.GameType, ChalkySticks.Collection.Schedule>
		 */
		protected get channelMap(): Record<ChalkySticks.Enum.GameType, ChalkySticks.Collection.Schedule> {
			return {
				[ChalkySticks.Enum.GameType.All]: this.scheduleCollectionAll,
				[ChalkySticks.Enum.GameType.EightBall]: this.scheduleCollection8Ball,
				[ChalkySticks.Enum.GameType.NineBall]: this.scheduleCollection9Ball,
				[ChalkySticks.Enum.GameType.TenBall]: this.scheduleCollection10Ball,
				[ChalkySticks.Enum.GameType.StraightPool]: this.scheduleCollectionStraight,
				[ChalkySticks.Enum.GameType.Snooker]: this.scheduleCollectionSnooker,
				[ChalkySticks.Enum.GameType.Billiards]: this.scheduleCollectionBilliards,
				[ChalkySticks.Enum.GameType.TrickShots]: this.scheduleCollectionTrick,
				[ChalkySticks.Enum.GameType.OnePocket]: this.scheduleCollection1Pocket,
			};
		}

		/**
		 * @return typeof ChalkySticks
		 */
		protected get ChalkySticks(): typeof ChalkySticks {
			return ChalkySticks;
		}

		/**
		 * @return number
		 */
		private get scheduleHeaderSize(): number {
			const variable = ChalkySticks.Utility.getCSSVariable('--chalky-tv-schedule-header-size', this.$el as HTMLElement);
			const value = parseFloat(variable);

			return value;
		}

		/**
		 * @return number
		 */
		private get scheduleHourHeight(): number {
			const variable = ChalkySticks.Utility.getCSSVariable('--chalky-tv-hour-height', this.$el as HTMLElement);
			const value = parseFloat(variable);

			return value;
		}

		/**
		 * @type ChalkySticks.Enum.GameType
		 */
		@Prop({
			default: ChalkySticks.Enum.GameType.All,
		})
		public activeChannel!: ChalkySticks.Enum.GameType;

		/**
		 * Function names to bind to class, typically used for event handlers
		 *
		 * Example:
		 *     ['Handle_OnEvent', 'Handle_On...']
		 *
		 * @type string[]
		 */
		public bindings: string[] = ['Handle_OnScroll'];

		/**
		 * @type boolean
		 */
		protected isCentering: boolean = true;

		/**
		 * @type number
		 */
		protected nowPositionY: number = 0;

		/**
		 * @type number
		 */
		protected scrollTop: number = 0;

		/**
		 * @type ChalkySticks/Collection/Schedule
		 */
		protected scheduleCollectionAll: ChalkySticks.Collection.Schedule;

		/**
		 * @type ChalkySticks/Collection/Schedule
		 */
		protected scheduleCollection8Ball: ChalkySticks.Collection.Schedule;

		/**
		 * @type ChalkySticks/Collection/Schedule
		 */
		protected scheduleCollection9Ball: ChalkySticks.Collection.Schedule;

		/**
		 * @type ChalkySticks/Collection/Schedule
		 */
		protected scheduleCollection10Ball: ChalkySticks.Collection.Schedule;

		/**
		 * @type ChalkySticks/Collection/Schedule
		 */
		protected scheduleCollectionStraight: ChalkySticks.Collection.Schedule;

		/**
		 * @type ChalkySticks/Collection/Schedule
		 */
		protected scheduleCollectionSnooker: ChalkySticks.Collection.Schedule;

		/**
		 * @type ChalkySticks/Collection/Schedule
		 */
		protected scheduleCollectionBilliards: ChalkySticks.Collection.Schedule;

		/**
		 * @type ChalkySticks/Collection/Schedule
		 */
		protected scheduleCollectionTrick: ChalkySticks.Collection.Schedule;

		/**
		 * @type ChalkySticks/Collection/Schedule
		 */
		protected scheduleCollection1Pocket: ChalkySticks.Collection.Schedule;

		/**
		 * @constructor
		 */
		constructor() {
			super();

			// Create schedules
			this.scheduleCollectionAll = ChalkySticks.Factory.Schedule.collection();
			this.scheduleCollection8Ball = ChalkySticks.Factory.Schedule.collection({}, ChalkySticks.Enum.GameType.EightBall);
			this.scheduleCollection9Ball = ChalkySticks.Factory.Schedule.collection({}, ChalkySticks.Enum.GameType.NineBall);
			this.scheduleCollection10Ball = ChalkySticks.Factory.Schedule.collection({}, ChalkySticks.Enum.GameType.TenBall);
			this.scheduleCollectionStraight = ChalkySticks.Factory.Schedule.collection({}, ChalkySticks.Enum.GameType.StraightPool);
			this.scheduleCollectionSnooker = ChalkySticks.Factory.Schedule.collection({}, ChalkySticks.Enum.GameType.Snooker);
			this.scheduleCollectionBilliards = ChalkySticks.Factory.Schedule.collection({}, ChalkySticks.Enum.GameType.Billiards);
			this.scheduleCollectionTrick = ChalkySticks.Factory.Schedule.collection({}, ChalkySticks.Enum.GameType.TrickShots);
			this.scheduleCollection1Pocket = ChalkySticks.Factory.Schedule.collection({}, ChalkySticks.Enum.GameType.OnePocket);
		}

		/**
		 * @return void
		 */
		@mounted
		public setup(): void {
			this.fetch();
		}

		/**
		 * @return void
		 */
		@mounted
		public async attachEvents(): Promise<void> {
			ChalkySticks.Core.Utility.Interval.add(() => this.setNowPosition(), 250, `${this.cid}-now`);
			ChalkySticks.Core.Utility.Interval.add(() => this.centerNowMarker(), 2000, `${this.cid}-center`);
			ChalkySticks.Core.Utility.Interval.add(() => (this.scrollTop = this.$el.scrollTop), 1000 / 12, `${this.cid}-scrolltop`);

			await ChalkySticks.Utility.sleep(1000);

			this.$el.addEventListener('scroll', this.Handle_OnScroll);
		}

		/**
		 * @return void
		 */
		@beforeDestroy
		public detachEvents(): void {
			ChalkySticks.Core.Utility.Interval.remove(`${this.cid}-now`);
			ChalkySticks.Core.Utility.Interval.remove(`${this.cid}-center`);
			ChalkySticks.Core.Utility.Interval.remove(`${this.cid}-scrolltop`);

			this.$el.removeEventListener('scroll', this.Handle_OnScroll);
		}

		/**
		 * @return void
		 */
		public fetch(): void {
			this.scheduleCollectionAll.fetch();
			this.scheduleCollection8Ball.fetch();
			this.scheduleCollection9Ball.fetch();
			this.scheduleCollection10Ball.fetch();
			this.scheduleCollectionStraight.fetch();
			this.scheduleCollectionSnooker.fetch();
			this.scheduleCollectionBilliards.fetch();
			this.scheduleCollectionTrick.fetch();
			this.scheduleCollection1Pocket.fetch();
		}

		/**
		 * mk: @todo we should trigger this when the schedule is opened
		 * but not by default. In our Example.vue, this will make the whole
		 * page come down which is pretty annoying. The alternative is to
		 * use scrollTop to handle it.
		 *
		 * @param boolean withDelay
		 * @return void
		 */
		@mounted
		public async centerNowMarker(withDelay: boolean = true): Promise<void> {
			// Wait 500ms
			if (withDelay) {
				await ChalkySticks.Core.Utility.sleep(500);
			}

			// Find element
			this.scrollToNowMarker();
			this.scrollToActiveChannel();
		}

		/**
		 * @return void
		 */
		protected detachCentering(): void {
			ChalkySticks.Core.Utility.Interval.remove(`${this.cid}-center`);

			this.isCentering = false;
		}

		/**
		 * @return void
		 */
		protected setNowPosition(): void {
			const lastHour = 0;
			const date = ChalkySticks.Core.Utility.getDate();
			const minutes = date.getHours() * 60 + date.getMinutes();
			const hourDiff = minutes - lastHour;

			this.nowPositionY = hourDiff / 60;
		}

		/**
		 * @return void
		 */
		private scrollToActiveChannel(): void {
			const activeList = this.$el.querySelector(`[channel="${this.activeChannel}"]`);

			// No list available
			if (!activeList) {
				return;
			}

			const bboxA = this.$el.getBoundingClientRect();
			const bboxB = activeList.getBoundingClientRect();
			const offsetB = bboxB.left - bboxA.left + this.$el.scrollLeft;

			// Scroll to the active list (120 is the timeline width)
			// this.$el.scrollLeft = offsetB - 120;
			this.$el.scrollLeft = offsetB - bboxA.width / 2 + 120;
		}

		/**
		 * @return void
		 */
		private scrollToNowMarker(): void {
			const element = this.$refs.nowMarker as HTMLElement;
			const bboxA = this.$el.getBoundingClientRect();
			const y = this.scheduleHeaderSize + this.scheduleHourHeight * this.nowPositionY - bboxA.height / 2;

			this.$el.scrollTop = this.scrollTop = y;
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnChannelClick(e: PointerEvent, channel: string): Promise<void> {
			this.$emit('select:channel', channel);
		}

		/**
		 * @param ChalkySticks.Model.Schedule scheduleModel
		 * @param ChalkySticks.Enum.GameType channel
		 * @return Promise<void>
		 */
		protected async Handle_OnChannelItemClick(scheduleModel: ChalkySticks.Model.Schedule, channel: ChalkySticks.Enum.GameType): Promise<void> {
			this.$emit('select:schedule', scheduleModel, channel);
		}

		/**
		 * @param Event e
		 * @return Promise<void>
		 */
		protected async Handle_OnScroll(e: Event): Promise<void> {
			if (this.isCentering) {
				this.detachCentering();
			}

			this.scrollTop = this.$el.scrollTop;
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.tv-schedule {
		--z-tv-header-top: calc(var(--z-page-mid) + 5);
		--z-tv-header-mid: calc(var(--z-page-mid) + 3);

		display: grid;
		gap: var(--chalky-tv-schedule-gap);
		grid-template-columns: var(--chalky-tv-schedule-sidebar-size) 1fr;
		grid-template-rows: var(--chalky-tv-schedule-header-size) 1fr;
		overflow: auto;
		position: relative;

		&::before {
			background-color: var(--chalky-blue-4);
			border-bottom: 2px solid var(--chalky-blue);
			border-right: 2px solid var(--chalky-blue);
			content: ' ';
			grid-area: 1 / 1 / 2 / 2;
			height: 100%;
			left: 0;
			position: sticky;
			top: 0;
			width: 100%;
			z-index: var(--z-tv-header-top);
		}

		.tv-timeline {
			border-right: 2px solid var(--chalky-blue);
			grid-area: 2 / 1 / 3 / 2;
			left: 0;
			position: sticky;
			z-index: var(--z-tv-header-mid);
		}

		.headers {
			border-bottom: 2px solid var(--chalky-blue);
			grid-area: 1 / 2 / 2 / 3;
			position: sticky;
			top: 0;
			z-index: var(--z-tv-header-mid);

			.channel-header {
				background-color: var(--chalky-blue-4);
				background-position: center;
				background-size: auto 50%;
				cursor: pointer;
				height: 100%;
				margin: 0 var(--chalky-tv-schedule-gap);
				outline: 2px solid var(--chalky-blue);
				transition: background-color 0.2s;
				width: var(--chalky-tv-schedule-item-width);
			}
		}

		.lists {
			height: calc(var(--chalky-tv-hour-height) * 24);
			overflow: hidden;
			display: flex;
			flex-direction: row;
			grid-area: 2 / 2 / 3 / 3;
		}

		.chalky.tv-schedulelist {
			margin-top: -4px;
			overflow: hidden;
			z-index: var(--z-page-mid);
		}

		.now {
			left: var(--chalky-tv-schedule-sidebar-size);
			pointer-events: none;
			position: absolute;
			top: 0;
			transform: translate(0, -5px);
			width: 100%;
			z-index: var(--z-tv-header-mid);

			.badge {
				transform: translate(-120%, -50%);
			}

			&:before {
				border-top: 1px solid var(--chalky-red);
				content: ' ';
				left: 0;
				margin-top: 4px;
				max-width: calc(var(--chalky-tv-schedule-item-width) * var(--chalky-tv-channel-count));
				position: absolute;
				width: 500%;
			}
		}
	}

	// User Interaction
	// -------------------------------------------------------------------------

	.tv-schedule .headers .channel-header:hover {
		background-color: var(--chalky-blue-2);
	}

	// Media Queries
	// -------------------------------------------------------------------------

	@media only screen and (max-height: 500px) and (orientation: landscape) {
		.tv-schedule {
			--chalky-tv-schedule-header-size: 70px;
			--chalky-tv-schedule-sidebar-size: 80px;
			--chalky-tv-schedule-item-width: 200px;

			font-size: 0.875rem;
		}
	}

	@media only screen and (max-width: 500px) and (orientation: portrait) {
		.tv-schedule {
			--chalky-tv-schedule-header-size: 70px;
			--chalky-tv-schedule-sidebar-size: 60px;
			--chalky-tv-schedule-item-width: 160px;
			--chalky-tv-hour-height: 140px;
			--chalky-tv-schedule-gap: 0px;

			font-size: 0.66rem;

			.headers .channel-header {
				background-size: auto 50%;
			}
		}
	}
</style>
