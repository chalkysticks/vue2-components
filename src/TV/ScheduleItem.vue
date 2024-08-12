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
		 * @type ChalkySticks.Enum.GameType
		 */
		@Prop({
			default: ChalkySticks.Enum.GameType.All,
		})
		public channel!: ChalkySticks.Enum.GameType;

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
		cursor: pointer;
		overflow: hidden;
		position: relative;

		.glass-panel {
			background-color: color-mix(in srgb, var(--chalky-blue-4) 70%, transparent);
			height: calc(100% - 4px);
			margin-left: 2px;
			margin-top: 2px;
			outline: 2px solid var(--chalky-blue-4);
			padding: 1.25rem;
			pointer-events: none;
			transition: background-color 0.2s, outline 0.2s;
			width: calc(100% - 4px);
		}

		.title {
			margin-bottom: 0.5rem;
		}
	}

	// User Interaction
	// -------------------------------------------------------------------------

	.tv-scheduleitem:hover {
		.glass-panel {
			background-color: color-mix(in srgb, var(--chalky-blue-2) 80%, transparent);
			outline: 2px solid var(--chalky-blue-3);
		}
	}

	// State
	// -------------------------------------------------------------------------

	// Active List + Active Item
	.state-active .tv-scheduleitem.state-active .glass-panel {
		background-color: var(--chalky-red-2);
		outline: 2px solid var(--chalky-red);
	}
</style>
