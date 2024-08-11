<template>
	<section class="chalky tv-schedule">
		<ChalkyTvTimeline v-bind:showNow="true" />

		<ChalkyTvScheduleList v-bind:scheduleCollection="scheduleCollectionAll" />
		<ChalkyTvScheduleList v-bind:scheduleCollection="scheduleCollection8Ball" />
		<ChalkyTvScheduleList v-bind:scheduleCollection="scheduleCollection9Ball" />
		<ChalkyTvScheduleList v-bind:scheduleCollection="scheduleCollection10Ball" />
		<ChalkyTvScheduleList v-bind:scheduleCollection="scheduleCollectionStraight" />
		<ChalkyTvScheduleList v-bind:scheduleCollection="scheduleCollectionSnooker" />
		<ChalkyTvScheduleList v-bind:scheduleCollection="scheduleCollectionBilliards" />
		<ChalkyTvScheduleList v-bind:scheduleCollection="scheduleCollection1Pocket" />
		<ChalkyTvScheduleList v-bind:scheduleCollection="scheduleCollectionTrick" />

		<div
			class="now"
			v-bind:style="{
				top: `calc(var(--chalky-tv-hour-height) * ${nowPositionY})`,
			}"
		>
			<span class="badge bg-danger">Now</span>
		</div>
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
	export default class TVSchedule extends ViewBase {
		/**
		 * @type number
		 */
		protected get nowPositionY(): number {
			const lastHour = Math.max(0, new Date().getHours() * 60 - 60);
			const date = new Date();
			const minutes = date.getHours() * 60 + date.getMinutes();
			const hourDiff = minutes - lastHour;

			return hourDiff / 60;
		}

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
	}
</script>

<style lang="scss">
	.tv-schedule {
		display: flex;
		flex-direction: row;
		max-height: 500px;
		overflow: auto;
		position: relative;

		.now {
			left: 1rem;
			margin-top: 1rem;
			position: absolute;
			top: 0;
			width: 100%;

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
