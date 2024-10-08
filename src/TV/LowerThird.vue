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
		--base-animation-duration: 0.25s;

		display: flex;
		gap: 1em;
		transition: opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);

		.content {
			display: grid;
			grid-template-columns: max-content 1fr;
			grid-template-rows: 1fr auto;
			position: relative;
			z-index: 2;

			.title {
				align-items: center;
				background-color: rgba(255, 255, 255, 0.85);
				border-radius: 0.5em;
				border-bottom-left-radius: 0;
				box-shadow: inset 2px 2px 7px rgba(0, 0, 0, 0.15);
				color: var(--chalky-blue-4);
				display: flex;
				grid-area: 1 / 1 / 2 / 3;
				margin-bottom: 2px;
				min-width: 30em;
				padding: 0.25em 1em 0 1em;
				position: relative;

				&:before {
					background: var(--chalky-red);
					border-bottom: 1px solid var(--chalky-red-2);
					border-bottom-left-radius: 0.25em;
					border-bottom-right-radius: 0.25em;
					bottom: -10px;
					content: ' ';
					height: 0.5em;
					left: 0;
					opacity: 0.5;
					position: absolute;
					width: 95%;
					z-index: 1;
				}
			}

			.subtitle {
				background-color: var(--chalky-red);
				border-radius: 0.5em;
				border-top-left-radius: 0;
				border-top-right-radius: 0;
				color: var(--chalky-white);
				display: inline-block;
				grid-area: 2 / 1 / 3 / 2;
				padding: 0.25em 1em;
				position: relative;
				z-index: 2;

				p {
					font-size: var(--font-size-small);
					font-weight: var(--font-weight-medium);
					margin: 0;
					text-transform: uppercase;
				}
			}
		}
	}

	// Media Queries
	// -------------------------------------------------------------------------

	@media only screen and (max-height: 500px) and (orientation: landscape) {
		.tv-lowerthird {
			font-size: 14px;

			.chalky.branding-badge {
				height: 6.25em;
				width: 6.25em;
			}
		}
	}

	@media only screen and (max-width: 500px) and (orientation: portrait) {
		.tv-lowerthird {
			font-size: 10px;

			.content .title::before {
				bottom: -7px;
			}

			.chalky.branding-badge {
				height: 6.25em;
				width: 6.25em;
			}
		}
	}

	// Animation
	// -------------------------------------------------------------------------

	.tv-lowerthird {
		opacity: 0;
		transition: opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		transition-delay: 0.5s;

		.chalky.branding-badge {
			transform: scale(0);
			transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
			transition-delay: 1s;
		}

		.content .title {
			transform-origin: 0% 0%;
			transform: scaleX(0);
			transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
			transition-delay: calc(var(--base-animation-duration));

			> * {
				opacity: 0;
				transform: translateX(-50px);
				transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
				transition-delay: 1s;
			}
		}

		.content .title::before {
			transform-origin: 100% 0%;
			transform: scaleY(0);
			transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
			transition-delay: calc(var(--base-animation-duration) + 0.25s);
		}

		.content .subtitle {
			overflow: hidden;
			transform-origin: 0% 0%;
			transform: scaleX(0);
			transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
			transition-delay: calc(var(--base-animation-duration));

			> * {
				opacity: 0;
				transform: translateX(-50px);
				transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
				transition-delay: 1s;
			}
		}
	}

	// .tv-lowerthird:hover {
	.tv-lowerthird.animate-in {
		opacity: 1;
		transition-delay: 0s;

		.chalky.branding-badge {
			transform: scale(1);
			transition-delay: 0s;
		}

		.content .title {
			transform: scaleX(1);
			transition-delay: 0s;

			> * {
				opacity: 1;
				transform: translateX(0);
				transition-delay: 0.2s;
			}
		}

		.content .title::before {
			transform: scaleY(1);
			transition-delay: 0.3s;
		}

		.content .subtitle {
			transform: scaleX(1);
			transition-delay: 0.3s;

			> * {
				opacity: 1;
				transform: translateX(0);
				transition-delay: 0.4s;
			}
		}
	}
</style>
