<template>
	<section class="chalky tv-schedule">
		<ChalkyTvTimeline v-bind:showNow="true" />

		<div
			class="now"
			ref="nowMarker"
			v-bind:style="{
				top: `calc(var(--chalky-tv-hour-height) * ${nowPositionY})`,
			}"
		>
			<span class="badge bg-danger">Now</span>
		</div>

		<section class="headers layout-horizontal distributed">
			<div class="icon-channel-8ball"></div>
			<div class="icon-channel-9ball"></div>
			<div class="icon-channel-10ball"></div>
			<div class="icon-channel-all"></div>
			<div class="icon-channel-bank"></div>
			<div class="icon-channel-billiards"></div>
			<div class="icon-channel-snooker"></div>
			<div class="icon-channel-straight"></div>
			<div class="icon-channel-trick"></div>
			<div class="icon-channel-1pocket"></div>
		</section>

		<section class="lists">
			<ChalkyTvScheduleList
				v-bind:class="{ 'state-active': activeChannel == ChalkySticks.Enum.GameType.All }"
				v-bind:scheduleCollection="scheduleCollectionAll"
			/>

			<ChalkyTvScheduleList
				v-bind:class="{ 'state-active': activeChannel == ChalkySticks.Enum.GameType.EightBall }"
				v-bind:scheduleCollection="scheduleCollection8Ball"
			/>

			<ChalkyTvScheduleList
				v-bind:class="{ 'state-active': activeChannel == ChalkySticks.Enum.GameType.NineBall }"
				v-bind:scheduleCollection="scheduleCollection9Ball"
			/>

			<ChalkyTvScheduleList
				v-bind:class="{ 'state-active': activeChannel == ChalkySticks.Enum.GameType.TenBall }"
				v-bind:scheduleCollection="scheduleCollection10Ball"
			/>

			<ChalkyTvScheduleList
				v-bind:class="{ 'state-active': activeChannel == ChalkySticks.Enum.GameType.StraightPool }"
				v-bind:scheduleCollection="scheduleCollectionStraight"
			/>

			<ChalkyTvScheduleList
				v-bind:class="{ 'state-active': activeChannel == ChalkySticks.Enum.GameType.Snooker }"
				v-bind:scheduleCollection="scheduleCollectionSnooker"
			/>

			<ChalkyTvScheduleList
				v-bind:class="{ 'state-active': activeChannel == ChalkySticks.Enum.GameType.Billiards }"
				v-bind:scheduleCollection="scheduleCollectionBilliards"
			/>

			<ChalkyTvScheduleList
				v-bind:class="{ 'state-active': activeChannel == ChalkySticks.Enum.GameType.OnePocket }"
				v-bind:scheduleCollection="scheduleCollection1Pocket"
			/>

			<ChalkyTvScheduleList
				v-bind:class="{ 'state-active': activeChannel == ChalkySticks.Enum.GameType.TrickShots }"
				v-bind:scheduleCollection="scheduleCollectionTrick"
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
		protected readonly nowMarker: HTMLElement;

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
		 * @return void
		 */
		@mounted
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
			// this.$el.scrollLeft = 0;
		}

		/**
		 * @return void
		 */
		protected setNowPosition(): void {
			const lastHour = 0;
			const date = new Date();
			const minutes = date.getHours() * 60 + date.getMinutes();
			const hourDiff = minutes - lastHour;

			this.nowPositionY = hourDiff / 60;
		}
	}
</script>

<style lang="scss">
	.tv-schedule {
		max-height: 500px;
		overflow: auto;
		position: relative;

		display: grid;
		gap: 2px;
		grid-template-columns: auto 1fr;
		grid-template-rows: 60px 1fr;

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

			> * {
				background-color: var(--chalky-blue-4);
				background-position: center;
				background-size: auto 70%;
				height: 100%;
				margin: 0 2px;
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
			left: 1rem;
			position: absolute;
			top: 0;
			width: 100%;
			z-index: var(--z-header-bottom);

			.badge {
				transform: translate(0, -50%);
			}

			&:before {
				border-top: 1px solid var(--chalky-red);
				content: ' ';
				left: 70px;
				margin-top: 4px;
				max-width: calc(var(--chalky-tv-schedule-item-width) * var(--chalky-tv-channel-count));
				position: absolute;
				width: 500%;
			}
		}
	}
</style>
