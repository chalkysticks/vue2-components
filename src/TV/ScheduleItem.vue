<template>
	<section class="chalky tv-scheduleitem">
		<div class="glass-panel">
			<h3 class="color-chalky-white title">{{ formattedTitle }}</h3>
			<p class="color-chalky-grey subtitle">{{ formattedSubtitle }}</p>
			<slot></slot>
		</div>
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
	export default class TVScheduleItem extends ViewBase {
		/**
		 * @return string
		 */
		private get formattedSubtitle(): string {
			return this.scheduleModel ? this.scheduleModel.getDescription() : this.subtitle;
		}

		/**
		 * @return string
		 */
		private get formattedTitle(): string {
			return this.scheduleModel ? this.scheduleModel.getTitle() : this.title;
		}

		/**
		 * @type ChalkySticks.Model.Schedule
		 */
		@Prop()
		public scheduleModel!: ChalkySticks.Model.Schedule;

		/**
		 * Usually what type of game they're playing, like 2015 8-ball
		 *
		 * @type string
		 */
		@Prop()
		public subtitle!: string;

		/**
		 * Usually the matchup itself, like Matt vs. John
		 *
		 * @type string
		 */
		@Prop()
		public title!: string;
	}
</script>

<style lang="scss">
	.tv-scheduleitem {
		position: relative;

		.glass-panel {
			background-color: color-mix(in srgb, var(--chalky-blue-4) 70%, transparent);
			height: 100%;
			outline: 1px solid var(--chalky-blue);
			padding: 1.25rem;
			width: 100%;
		}

		.title {
			margin-bottom: 0.5rem;
		}
	}
</style>
