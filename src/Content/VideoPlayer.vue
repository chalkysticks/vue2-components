<template>
	<section class="chalky content-videoplayer" v-bind:class="{ 'state-playing': isPlaying }">
		<img class="poster rounded-large" v-bind:src="contentModel.getThumbnailUrl()" v-on:click="Handle_OnClick" />

		<iframe
			allowfullscreen
			class="rounded-large"
			frameborder="0"
			height="100%"
			ref="videoIframe"
			referrerpolicy="strict-origin-when-cross-origin"
			v-bind:src="getYouTubeEmbedWithApi()"
			v-bind:style="{ aspectRatio: aspectRatio }"
			v-if="contentModel.id"
			width="100%"
		></iframe>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package Content
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class ContentVideoPlayer extends ViewBase {
		/**
		 * @type string
		 */
		@Prop({
			default: '1 / 1',
		})
		public aspectRatio!: string;

		/**
		 * @type ChalkySticks/Model/Content
		 */
		@Prop({
			default: () => new ChalkySticks.Model.Content(),
		})
		public contentModel!: ChalkySticks.Model.Content;

		/**
		 * Whether the video is currently playing
		 * @type {boolean}
		 */
		protected isPlaying: boolean = false;

		/**
		 * Get YouTube embed URL with API parameters enabled
		 * @return {string}
		 */
		protected getYouTubeEmbedWithApi(): string {
			const baseUrl = this.contentModel.getYouTubeEmbed();

			// Add YouTube API parameters if they're not already present
			if (baseUrl && !baseUrl.includes('enablejsapi=1')) {
				// If URL already has parameters, add to them
				if (baseUrl.includes('?')) {
					return `${baseUrl}&enablejsapi=1&autoplay=0&mute=0`;
				} else {
					return `${baseUrl}?enablejsapi=1&autoplay=0&mute=0`;
				}
			}

			return baseUrl;
		}

		/**
		 * Play the video if the player is ready
		 *
		 * @param {MouseEvent} event
		 * @returns {Promise<void>}
		 */
		protected async Handle_OnClick(event: MouseEvent): Promise<void> {
			this.isPlaying = true;

			const iframe = this.$refs.videoIframe as HTMLIFrameElement;

			// Retry mechanism if player not ready yet
			const tryPlay = () => {
				if (this.playerReady && iframe && iframe.contentWindow) {
					iframe.contentWindow.postMessage(
						JSON.stringify({
							event: 'command',
							func: 'playVideo',
							args: [],
						}),
						'*',
					);
				} else {
					// Try again in a bit
					setTimeout(tryPlay, 300);
				}
			};

			tryPlay();
		}
	}
</script>

<style lang="scss">
	.chalky.content-videoplayer {
		position: relative;

		.poster {
			height: 100%;
			object-fit: cover;
			position: absolute;
			transition: opacity 1.5s ease-out;
			transition-delay: 0.5s;
			width: 100%;
		}
	}

	// State
	// ---------------------------------------------------------------------------

	.chalky.content-videoplayer.state-playing {
		.poster {
			opacity: 0;
			pointer-events: none;
		}
	}
</style>
