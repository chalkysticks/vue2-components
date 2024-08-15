<template>
	<section
		class="chalky tv-schedule"
		v-bind:style="{
			'--chalky-tv-channel-count': channels.length,
		}"
	>
		<ChalkyTvTimeline v-bind:showNow="true" />

		<div
			class="now"
			ref="nowMarker"
			v-bind:style="{
				top: `calc((60px + var(--chalky-tv-hour-height) * ${nowPositionY}) )`,
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
		 * @type ChalkySticks.Enum.GameType
		 */
		@Prop({
			default: ChalkySticks.Enum.GameType.All,
		})
		public activeChannel!: ChalkySticks.Enum.GameType;

		/**
		 * @type number
		 */
		protected nowPositionY: number = 0;

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
			this.scheduleCollection8Ball = ChalkySticks.Factory.Schedule.collection(ChalkySticks.Enum.GameType.EightBall);
			this.scheduleCollection9Ball = ChalkySticks.Factory.Schedule.collection(ChalkySticks.Enum.GameType.NineBall);
			this.scheduleCollection10Ball = ChalkySticks.Factory.Schedule.collection(ChalkySticks.Enum.GameType.TenBall);
			this.scheduleCollectionStraight = ChalkySticks.Factory.Schedule.collection(ChalkySticks.Enum.GameType.StraightPool);
			this.scheduleCollectionSnooker = ChalkySticks.Factory.Schedule.collection(ChalkySticks.Enum.GameType.Snooker);
			this.scheduleCollectionBilliards = ChalkySticks.Factory.Schedule.collection(ChalkySticks.Enum.GameType.Billiards);
			this.scheduleCollectionTrick = ChalkySticks.Factory.Schedule.collection(ChalkySticks.Enum.GameType.TrickShots);
			this.scheduleCollection1Pocket = ChalkySticks.Factory.Schedule.collection(ChalkySticks.Enum.GameType.OnePocket);

			// Fetch
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
		 * @return void
		 */
		@mounted
		public attachEvents(): void {
			ChalkySticks.Core.Utility.Interval.add(() => this.setNowPosition(), 1000, this.cid);
		}

		/**
		 * @return void
		 */
		@beforeDestroy
		public detachEvents(): void {
			ChalkySticks.Core.Utility.Interval.remove(this.cid);
		}

		/**
		 * mk: @todo we should trigger this when the schedule is opened
		 * but not by default. In our Example.vue, this will make the whole
		 * page come down which is pretty annoying. The alternative is to
		 * use scrollTop to handle it.
		 *
		 * @return void
		 */
		public async centerNowMarker(): Promise<void> {
			// Wait 500ms
			await ChalkySticks.Core.Utility.sleep(500);

			// Scroll to the "NOW" marker
			this.nowMarker.scrollIntoView({
				behavior: 'auto',
				block: 'center',
				inline: 'center',
			});

			// Make sure we stay left
			this.$el.scrollLeft = 0;
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

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.tv-schedule {
		--schedule-header-size: 60px;
		--schedule-sidebar-size: 140px;

		display: grid;
		gap: var(--chalky-tv-schedule-gap);
		grid-template-columns: var(--schedule-sidebar-size) 1fr;
		grid-template-rows: var(--schedule-header-size) 1fr;
		overflow: auto;
		position: relative;

		&::before {
			background-color: var(--chalky-blue-4);
			content: ' ';
			grid-area: 1 / 1 / 2 / 2;
			height: 100%;
			width: 100%;
		}

		.tv-timeline {
			grid-area: 2 / 1 / 3 / 2;
			left: 0;
			position: sticky;
			z-index: var(--z-header-mid);
		}

		.headers {
			grid-area: 1 / 2 / 2 / 3;
			position: sticky;
			top: 0;
			z-index: var(--z-header-bottom);

			.channel-header {
				background-color: var(--chalky-blue-4);
				background-position: center;
				background-size: auto 70%;
				cursor: pointer;
				height: 100%;
				margin: 0 var(--chalky-tv-schedule-gap);
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
			left: var(--schedule-sidebar-size);
			pointer-events: none;
			position: absolute;
			top: 0;
			transform: translate(0, -5px);
			width: 100%;
			z-index: var(--z-header-mid);

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
			--schedule-header-size: 70px;
			--schedule-sidebar-size: 80px;
			--chalky-tv-schedule-item-width: 200px;

			font-size: 0.875rem;

			.headers .channel-header {
				background-size: auto 50%;
			}
		}
	}

	@media only screen and (max-width: 500px) and (orientation: portrait) {
		.tv-schedule {
			--schedule-header-size: 70px;
			--schedule-sidebar-size: 60px;
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
