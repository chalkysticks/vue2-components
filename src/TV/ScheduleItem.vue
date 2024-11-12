<template>
	<section class="chalky tv-scheduleitem">
		<div class="gallery">
			<picture>
				<img v-if="activeImageUrl" v-bind:src="activeImageUrl" width="100%" />
				<img v-else-if="this.imageBroken" src="../Assets/image/tv/no-thumbnail-available.jpg" width="100%" />
				<div v-else class="loading-container">
					<img class="filter-invert" src="~@chalkysticks/sass/build/asset/image/spacer.gif" />
				</div>
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
	import { Component, Prop, Watch } from 'vue-property-decorator';
	import { mounted } from '@/Utility/Decorators';

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
		private get thumbnailUrlMaxRes(): string {
			return this.scheduleModel ? this.scheduleModel?.getThumbnail('maxres') : '';
		}

		/**
		 * @return string
		 */
		private get thumbnailUrlDefault(): string {
			return this.scheduleModel ? this.scheduleModel?.getThumbnail() : '';
		}

		/**
		 * @return string[]
		 */
		private get urlList(): string[] {
			return [this.thumbnailUrlMaxRes, this.thumbnailUrlDefault].filter((url) => !!url);
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

		/**
		 * @return string
		 */
		protected activeImageUrl!: string;

		/**
		 * @return boolean
		 */
		protected imageBroken: boolean = false;

		/**
		 * @return Promise<void>
		 */
		@mounted
		protected async loadBestImage(): Promise<void> {
			if (!this.urlList.length) return;

			for (let i = 0; i < this.urlList.length; i++) {
				const imageUrl = this.urlList[i];
				if (!imageUrl) continue;

				try {
					await new Promise<void>((resolve, reject) => {
						const img = new Image();
						img.onload = () => {
							if (img.width === 120) {
								reject();
								return;
							}

							this.activeImageUrl = imageUrl;
							this.$forceUpdate();
							resolve();
						};
						img.onerror = () => reject();
						img.src = imageUrl;
					});

					return;
				} catch {
					console.log('fetch failed for', imageUrl);
					continue;
				}
			}

			if (!this.activeImageUrl) {
				this.imageBroken = true;
			}
		}

		/**
		 * @return void
		 */
		@Watch('urlList', { immediate: true })
		protected onUrlListChange(): void {
			this.loadBestImage();
		}
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
			position: relative;
			z-index: 2;
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

			a,
			button {
				pointer-events: auto;
			}
		}

		.subtitle {
			margin: 0;
		}

		.gallery,
		.tags {
			display: none;
		}

		.gallery {
			position: relative;
			z-index: 1;

			picture {
				display: block;
				height: 100%;
				overflow: hidden;
				z-index: 1;
			}

			picture img {
				aspect-ratio: 16 / 9;
				background: transparent;
				filter: blur(1px);
				object-fit: cover;
				width: 100%;
			}

			&:after,
			&:before {
				background-color: var(--chalky-blue-4);
				bottom: 0;
				content: ' ';
				left: 0;
				opacity: 0.35;
				pointer-events: none;
				position: absolute;
				right: 0;
				top: 0;
				z-index: 1;
			}

			&:after {
				background: linear-gradient(207deg, rgba(255, 0, 0, 0) 38%, rgba(255, 0, 0, 1) 100%);
				// background: linear-gradient(207deg, var(--chalky-blue-4) 47%, var(--chalky-blue) 62%);
				opacity: 0.4;
				mix-blend-mode: soft-light;
				z-index: 2;
			}
		}
	}

	// Variations
	// -------------------------------------------------------------------------

	.stacked > .tv-scheduleitem,
	.tv-scheduleitem.stacked {
		display: grid;

		> * {
			grid-area: 1 / 1;
		}

		.glass-panel {
			background-color: transparent;
		}

		.content {
			height: 100%;
			justify-content: center;
			margin: 0;
			outline: 0;
			text-shadow: 0 0 2px var(--chalky-blue-4);
			width: 100%;

			> * {
				min-width: 200px;
				width: 70%;
			}
		}

		.gallery picture img {
			height: 100%;
		}
	}

	// User Interaction
	// -------------------------------------------------------------------------

	@media (hover: hover) {
		.tv-scheduleitem:hover {
			.glass-panel {
				background-color: var(--chalky-blue-2-75); // safari 14
				// background-color: color-mix(in srgb, var(--chalky-blue-2) 80%, transparent);
				outline: 2px solid var(--chalky-blue-3);
			}
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
