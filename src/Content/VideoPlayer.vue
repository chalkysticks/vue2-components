<template>
	<section
		class="chalky content-videoplayer"
		v-bind:class="{
			'state-error': state === 'error',
			'state-playing': state === 'playing',
			'state-ready': state === 'ready',
		}"
	>
		<figure
			v-bind:class="{
				'loading-overlay': state !== 'playing',
				'loading-overlay-dark': state !== 'playing',
				'loading-overlay-transparent': state !== 'playing',
			}"
		>
			<img class="poster rounded-large" v-bind:src="contentModel.getThumbnailUrl()" v-on:click="Handle_OnClickThumbnail" />
		</figure>

		<UtilityVideoYouTube
			v-bind:autoplay="true"
			v-bind:muted="false"
			v-bind:ref="'videoPlayer'"
			v-bind:shouldPlay="shouldPlay"
			v-bind:url="contentModel.getYouTubeEmbed()"
			v-on:error="Handle_OnError"
			v-on:player:error="Handle_OnPlayerError"
			v-on:player:ready="Handle_OnPlayerReady"
			v-on:video:starting="Handle_OnVideoStarting"
			v-bind:style="{ aspectRatio: aspectRatio }"
		/>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import UtilityVideoYouTube from '../Utility/Video/YouTube.vue';
	import ViewBase from '../Core/Base';
	import { Component, Prop, Ref } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package Content
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({
		components: {
			UtilityVideoYouTube,
		},
	})
	export default class ContentVideoPlayer extends ViewBase {
		/**
		 * @type UtilityVideoYouTube
		 */
		@Ref('videoPlayer')
		readonly videoPlayer!: UtilityVideoYouTube;

		/**
		 * @type string
		 */
		@Prop({
			default: '16 / 9',
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
		 * @type boolean
		 */
		protected shouldPlay: boolean = false;

		/**
		 * @type string
		 */
		protected state: string = '';

		/**
		 * @type number
		 */
		private renderAttempts: number = 0;

		/**
		 * @param string state
		 * @return void
		 */
		private setPlayerState(state: string): void {
			this.state = state;
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnError(): Promise<void> {
			this.setPlayerState('error');
		}

		/**
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickThumbnail(e: PointerEvent): Promise<void> {
			e.preventDefault();

			this.shouldPlay = true;
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnPlayerError(): Promise<void> {
			this.setPlayerState('error');

			// Try re-rendering if there are ads maybe
			if (this.renderAttempts++ > 3) {
				return;
			}

			setTimeout(() => this.videoPlayer.reload(), 1000);
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnPlayerReady(): Promise<void> {
			this.setPlayerState('ready');
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnVideoStarting(): Promise<void> {
			this.setPlayerState('playing');
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.content-videoplayer {
		position: relative;

		.poster {
			height: 100%;
			object-fit: cover;
			opacity: 0.25;
			position: absolute;
			transition: opacity 1.25s ease-out;
			width: 100%;
		}

		iframe {
			opacity: 0;
			transition: opacity 1s ease-out;
			transition-delay: 0.5s;
		}
	}

	// State
	// ---------------------------------------------------------------------------

	.chalky.content-videoplayer.state-ready {
		.poster {
			opacity: 1;
		}

		iframe {
			opacity: 1;
		}
	}

	.chalky.content-videoplayer.state-playing {
		.poster {
			opacity: 0;
			pointer-events: none;
		}

		iframe {
			opacity: 1;
		}
	}
</style>
