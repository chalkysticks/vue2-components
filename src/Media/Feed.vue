<template>
	<section
		class="chalky media-feed"
		v-bind:class="{
			'aspect-landscape': aspectRatio == 'landscape',
			'aspect-portrait': aspectRatio == 'portrait',
			'aspect-square': aspectRatio == 'square',
		}"
	>
		<slot name="before"></slot>
		<div class="media-container">
			<figure v-bind:key="mediaModel.id" v-for="(mediaModel, index) in mediaCollection">
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
	import { beforeDestroy, mounted } from '../Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package Media
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class MediaFeed extends ViewBase {
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
</style>
