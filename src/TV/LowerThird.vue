<template>
	<section class="chalky tv-lowerthird">
		<ChalkyBrandingBadge size="lg" />

		<section class="content">
			<div class="title">
				<h3>{{ formattedTitle }}</h3>
			</div>
			<div class="subtitle">
				<p>{{ formattedSubtitle }}</p>
			</div>
		</section>
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
	export default class TVLowerThird extends ViewBase {
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
	.tv-lowerthird {
		display: flex;
		gap: 1rem;
		transition: opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);

		.content {
			height: 100px;
			position: relative;
			z-index: 2;

			.title {
				backdrop-filter: blur(1rem);
				background-color: rgba(255, 255, 255, 0.85);
				border-radius: 1rem;
				border-bottom-left-radius: 0;
				color: var(--chalky-blue-4);
				margin-bottom: 2px;
				min-width: 500px;
				padding: 1rem;
				position: relative;

				&:before {
					background: var(--chalky-red);
					border-bottom-left-radius: 0.5rem;
					border-bottom-right-radius: 0.5rem;
					bottom: -9px;
					content: ' ';
					height: 0.5rem;
					left: 0;
					opacity: 0.5;
					position: absolute;
					width: 95%;
					z-index: 1;
				}
			}

			.subtitle {
				backdrop-filter: blur(1rem);
				background-color: var(--chalky-red);
				border-radius: 1rem;
				border-top-left-radius: 0;
				border-top-right-radius: 0;
				color: var(--chalky-white);
				display: inline-block;
				padding: 0.5rem 1.25rem;
				position: relative;

				p {
					margin: 0;
				}
			}
		}
	}

	// Animation
	// -------------------------------------------------------------------------

	.tv-lowerthird:not(.animate-in) {
		opacity: 0;
	}

	.tv-lowerthird.animate-in {
		--base-animation-duration: 0.25s;

		opacity: 1;

		.chalky.branding-badge {
			animation: scale-in-center 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
		}

		.content .title {
			animation: scale-in-hor-left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
			animation-delay: calc(var(--base-animation-duration));

			> * {
				animation: fade-in-left 0.6s cubic-bezier(0.39, 0.575, 0.565, 1) both;
			}
		}

		.content .title::before {
			animation: scale-in-ver-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
			animation-delay: calc(var(--base-animation-duration) + 0.25s);
		}

		.content .subtitle {
			animation: scale-in-hor-left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
			animation-delay: calc(var(--base-animation-duration) + 0.5s);

			> * {
				animation: fade-in-left 0.6s cubic-bezier(0.39, 0.575, 0.565, 1) both;
			}
		}
	}
</style>
