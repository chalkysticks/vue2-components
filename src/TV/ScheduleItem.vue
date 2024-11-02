<template>
	<section class="chalky tv-scheduleitem">
		<div class="gallery">
			<picture>
				<img v-bind:src="thumbnailUrl" width="100%" />
			</picture>
		</div>

		<div class="glass-panel content">
			<div class="tags">
				<div class="tag is-live" v-if="scheduleModel && scheduleModel.isLive()">Live</div>
				<div class="tag game-type">{{ formattedGameType }}</div>
			</div>
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
		private get formattedGameType(): string {
			return this.scheduleModel ? this.scheduleModel.getMeta()?.game_type : 'Pool';
		}

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
		 * @return string
		 */
		private get thumbnailUrl(): string {
			return this.scheduleModel ? this.scheduleModel?.getThumbnail() : '';
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

		.content {
			display: flex;
			flex-direction: column;
			gap: 0.5em;
		}

		.glass-panel {
			background-color: var(--chalky-blue-4-75); // for safari 14
			// background-color: color-mix(in srgb, var(--chalky-blue-4) 75%, transparent);
			backdrop-filter: none;
			height: calc(100% - 6px);
			margin-left: 2px;
			margin-top: 2px;
			outline: 2px solid var(--chalky-blue-4);
			overflow: hidden;
			padding: 1.25em;
			pointer-events: none;
			transition: background-color 0.2s, outline 0.2s;
			width: calc(100% - 4px);
		}

		.subtitle {
			margin: 0;
		}

		.gallery,
		.tags {
			display: none;
		}
	}

	// Variations
	// -------------------------------------------------------------------------

	.stacked > .tv-scheduleitem,
	.tv-scheduleitem.stacked {
		display: grid;
		place-content: center;

		> * {
			grid-area: 1 / 1;
		}

		.content {
			height: 100%;
			justify-content: center;
			margin: 0;
			outline: 0;
			width: 100%;

			> * {
				min-width: 200px;
				width: 70%;
			}
		}
	}

	// User Interaction
	// -------------------------------------------------------------------------

	.tv-scheduleitem:hover {
		.glass-panel {
			background-color: var(--chalky-blue-2-75); // safari 14
			// background-color: color-mix(in srgb, var(--chalky-blue-2) 80%, transparent);
			outline: 2px solid var(--chalky-blue-3);
		}
	}

	// State
	// -------------------------------------------------------------------------

	.show-image > .tv-scheduleitem .gallery,
	.tv-scheduleitem.show-image .gallery,
	.show-tags > .tv-scheduleitem .tags,
	.tv-scheduleitem.show-tags .tags {
		display: block;
	}

	// Active List + Active Item
	.state-active .tv-scheduleitem.state-active .glass-panel {
		background-color: var(--chalky-red-2);
		outline: 2px solid var(--chalky-red);
	}
</style>
