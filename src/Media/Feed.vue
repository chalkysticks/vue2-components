<template>
	<section
		class="chalky media-feed"
		v-bind:class="{
			'aspect-landscape': aspectRatio == 'landscape',
			'aspect-portrait': aspectRatio == 'portrait',
			'aspect-square': aspectRatio == 'square',
		}"
		v-bind:count="mediaCollection.length"
	>
		<slot name="before"></slot>
		<div class="media-container">
			<figure
				v-bind:class="getAnimationClass(index)"
				v-bind:key="mediaModel.id"
				v-for="(mediaModel, index) in mediaCollection"
				v-show="animationStyle === 'none' ? index === currentIndex : true"
			>
				<img class="background" v-bind:src="mediaModel.getUrl()" />
				<img class="blurred" v-bind:src="mediaModel.getUrl()" />
				<img v-bind:src="mediaModel.getUrl()" />

				<figcaption>
					<slot v-bind:mediaModel="mediaModel" v-bind:index="index"></slot>
				</figcaption>
			</figure>
		</div>
		<slot name="after"></slot>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, bind, mounted } from '../Utility/Decorators';

	// Animation styles enum
	export enum MediaFeedAnimationStyle {
		None = 'none',
		Crossfade = 'crossfade',
		Slide = 'slide',
	}

	/**
	 * @author ChalkySticks LLC
	 * @package Media
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class MediaFeed extends ViewBase {
		/**
		 * How long to hold each image (ms)
		 *
		 * @type number
		 */
		@Prop({ default: 4000 })
		public animationHoldMs!: number;

		/**
		 * Animation style for slideshow
		 *
		 * @type MediaFeedAnimationStyle | string
		 */
		@Prop({ default: MediaFeedAnimationStyle.None })
		public animationStyle!: MediaFeedAnimationStyle | string;

		/**
		 * @todo turn into an enum
		 *
		 * @type string
		 */
		@Prop({ default: 'portrait' })
		public aspectRatio!: string;

		/**
		 * @type ChalkySticks/Collection/Media
		 */
		@Prop({
			default: () => new ChalkySticks.Collection.Media(),
		})
		public mediaCollection!: ChalkySticks.Collection.Media;

		/**
		 * How long the animation transition lasts (ms)
		 *
		 * @type number
		 */
		@Prop({ default: 1000 })
		public animationDurationMs!: number;

		/**
		 * The index of the currently displayed image in the slideshow.
		 *
		 * @type number
		 */
		public currentIndex: number = 0;

		/**
		 * The index of the previously displayed image in the slideshow.
		 *
		 * @type number
		 */
		public previousIndex: number = 0;

		/**
		 * Internal interval identifier for slideshow (managed by ChalkySticks.Core.Utility.Interval).
		 *
		 * @type any
		 */
		private slideshowInterval: any = null;

		/**
		 * Lifecycle hook: Called when the component is mounted.
		 * Starts the slideshow if animation is enabled and there is more than one image.
		 *
		 * @return void
		 */
		@mounted
		public mountedSlideshow(): void {
			if (this.animationStyle !== MediaFeedAnimationStyle.None) {
				this.startSlideshow();
			}
		}

		/**
		 * Lifecycle hook: Called before the component is destroyed.
		 * Stops the slideshow interval.
		 *
		 * @return void
		 */
		@beforeDestroy
		public beforeDestroySlideshow(): void {
			this.stopSlideshow();
		}

		/**
		 * Starts the slideshow interval using ChalkySticks.Core.Utility.Interval.
		 * Advances the currentIndex at the interval specified by animationHoldMs.
		 *
		 * @return void
		 */
		public startSlideshow(): void {
			this.stopSlideshow();

			ChalkySticks.Utility.Interval.add(this.Handle_OnSlideshowInterval, this.animationHoldMs, `${this.cid}-media-feed`);
		}

		/**
		 * Stops the slideshow interval using ChalkySticks.Core.Utility.Interval.
		 *
		 * @return void
		 */
		public stopSlideshow(): void {
			ChalkySticks.Utility.Interval.remove(`${this.cid}-media-feed`);
		}

		/**
		 * Returns the animation class for a given image index based on the current animation style and currentIndex.
		 *
		 * @param index The index of the image in the media collection.
		 * @return string The animation class string.
		 */
		public getAnimationClass(index: number): string {
			if (this.animationStyle === MediaFeedAnimationStyle.None) return '';

			if (this.animationStyle === MediaFeedAnimationStyle.Crossfade) {
				return `media-anim-crossfade${index === this.currentIndex ? ' active' : ''}`;
			}

			if (this.animationStyle === MediaFeedAnimationStyle.Slide) {
				if (index === this.currentIndex) return 'media-anim-slide active';
				if (index === this.previousIndex) return 'media-anim-slide out';
				return 'media-anim-slide';
			}

			return '';
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @return Promise<void>
		 */
		@bind
		protected async Handle_OnSlideshowInterval(): Promise<void> {
			this.previousIndex = this.currentIndex;
			this.currentIndex = (this.currentIndex + 1) % this.mediaCollection.length || 1;

			console.log('Current index:', this.currentIndex);
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.media-feed {
		.media-container {
			background: #111;
			border-radius: 1rem;
			display: block;
			max-width: 480px;
			min-width: 300px;
			overflow: hidden;
			position: relative;
			width: 100%;

			figure,
			figure img {
				height: 100%;
				left: 0;
				margin: 0;
				position: absolute;
				top: 0;
				width: 100%;
			}

			img {
				object-fit: contain;
			}

			img.blurred {
				filter: blur(20px);
				// opacity: 0.25;
				transform: scale(0.97);
			}

			img.background {
				object-fit: cover;
				opacity: 0.05;
			}
		}

		figcaption {
			background: linear-gradient(0deg, rgba(0, 0, 0, 0.75), transparent);
			bottom: 0;
			left: 0;
			padding: 1rem;
			position: absolute;
			text-shadow: 0 0 7px rgba(0, 0, 0, 0.75);
			width: 100%;
		}
	}

	// Variations
	// ---------------------------------------------------------------------------

	.chalky.media-feed.aspect-landscape .media-container {
		aspect-ratio: 7 / 5;
	}

	.chalky.media-feed.aspect-portrait .media-container {
		aspect-ratio: 5 / 7;
	}

	.chalky.media-feed.aspect-square .media-container {
		aspect-ratio: 1 / 1;
	}

	// Slideshow Animations
	// ---------------------------------------------------------------------------

	.chalky.media-feed:not([count='1']) {
		.media-anim-crossfade {
			opacity: 0;
			transition: opacity 2s ease-in-out;

			&.active {
				opacity: 1;
				z-index: 2;
			}
		}

		.media-anim-slide {
			opacity: 0;
			transform: translateX(100%);
			transition: transform 2s cubic-bezier(0.77, 0, 0.175, 1), opacity 2s ease-in-out;

			&.active {
				opacity: 1;
				transform: translateX(0);
				z-index: 2;
			}

			&:not(.active) {
				// Inactive slides (not .out) stay off-screen right
				transform: translateX(100%);
			}

			&.out {
				opacity: 0;
				transform: translateX(-100%);
			}
		}
	}
</style>
