<template>
	<section class="chalky tv-video-youtube">
		<div v-bind:id="playerId"></div>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import TVVideoShared from './Shared';
	import { Component, Prop, Watch } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package TV/Video
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class TVVideoYouTube extends TVVideoShared {
		/**
		 * @type string[]
		 */
		public bindings: string[] = ['Handle_OnInterval', 'Handle_OnVideoEnding', 'Handle_OnVideoStarting'];

		/**
		 * @return void
		 */
		public mounted(): void {
			super.mounted();

			this.attachEvents();
		}

		/**
		 * @return void
		 */
		public beforeDestroy(): void {
			super.beforeDestroy();

			this.detachEvents();
		}

		/**
		 * @return void
		 */
		public attachEvents(): void {
			super.attachEvents();

			this.interval = setInterval(this.Handle_OnInterval, 250);
		}

		/**
		 * @return void
		 */
		public detachEvents(): void {
			super.detachEvents();

			clearInterval(this.interval);
			this.interval = 0;
		}

		/**
		 * @param string code
		 * @param number time
		 * @return Promise<void>
		 */
		public async createPlayer(code: string, time: number = 0): Promise<void> {
			// YT not loaded
			if (!TVVideoShared.window.YT || !TVVideoShared.window.YT.Player) {
				setTimeout(() => {
					this.createPlayer(code, time);
				}, 250);

				return;
			}

			try {
				// If player already exists, change the video
				if (this.api) {
					this.api.loadVideoById({
						startSeconds: time,
						videoId: code,
					});
				} else {
					this.api = new TVVideoShared.window.YT.Player(this.playerId, {
						events: {
							onError: () => this.Handle_OnPlayerError(),
							onReady: (e: any) => this.Handle_OnPlayerReady(),
							onStateChange: (e: any) => this.Handle_OnPlayerStateChange(e),
						},
						playerVars: {
							autohide: 1,
							autoplay: this.autoplay && this.shouldPlay,
							cc_load_policy: 0,
							controls: 0,
							disablekb: 1,
							enablejsapi: 1,
							iv_load_policy: 3,
							loop: 0,
							modestbranding: 1,
							mute: this.muted,
							origin: window.location.origin,
							playsinline: 1,
							rel: 0,
							start: time,
						},
						videoId: code,
					});

					// Player is ready and API configured
					this.Handle_OnPlayerReady();
				}
			} catch (e) {
				console.warn('Tried to create a player but failed. We may have destroyed it early.', e);
			}
		}

		/**
		 * @return number
		 */
		public getCurrentTime(): number {
			return this.api?.getCurrentTime();
		}

		/**
		 * @return number
		 */
		public getDuration(): number {
			return this.api?.getDuration();
		}

		/**
		 * @return string
		 */
		public getVideoUrl(): string {
			return this.api?.getVideoUrl();
		}

		/**
		 * @return boolean
		 */
		public isMuted(): boolean {
			return this.api?.isMuted();
		}

		/**
		 * @return void
		 */
		public mute(): void {
			this.api?.mute();
		}

		/**
		 * @return void
		 */
		public pause(): void {
			this.api?.pauseVideo();
		}

		/**
		 * @return number
		 */
		public play(): void {
			this.api?.playVideo();
		}

		/**
		 * @return void
		 */
		public unmute(): void {
			this.api?.unMute();
		}

		/**
		 * @param number seconds
		 * @return void
		 */
		public seekTo(seconds: number = 30): void {
			try {
				this.api?.seekTo(seconds, true);
			} catch (e) {
				console.warn('Could not seek to', seconds);
			}
		}

		/**
		 * @return void
		 */
		protected embedScript(): void {
			const tag = document.createElement('script');
			tag.src = 'https://www.youtube.com/iframe_api';

			const firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

			TVVideoShared.window.onYouTubeIframeAPIReady = () => {
				return this.Handle_OnApiLoaded();
			};
		}

		/**
		 * Parse out video URL
		 *
		 * @param string url
		 * @return string
		 */
		protected parseVideoID(url: string): string {
			const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??(?:v=)?([^#\&\?]*).*/;
			const match = url.match(regExp);

			if (match && match[7].length == 11) {
				return match[7];
			}

			return '';
		}

		/**
		 * Check if we should be embedding the YT script
		 *
		 * @return boolean
		 */
		protected requiresScript(): boolean {
			return typeof TVVideoShared.window != 'undefined' && !(TVVideoShared.window as any).YT;
		}

		/**
		 * @return Promise<void>
		 */
		@Watch('muted')
		protected async Handle_OnChangeMute(): Promise<void> {
			if (!this.api) {
				return;
			}

			if (this.muted) {
				this.mute();
			} else {
				this.unmute();
			}
		}

		/**
		 * @return Promise<void>
		 */
		@Watch('shouldPlay')
		protected async Handle_OnChangePlay(): Promise<void> {
			if (!this.api) {
				return;
			}

			if (this.shouldPlay) {
				this.play();
			} else {
				this.pause();
			}
		}

		/**
		 * @return void
		 */
		protected Handle_OnInterval(): void {
			try {
				this.currentTime = this.getCurrentTime();
				this.duration = this.getDuration(); // cache me
			} catch (e) {
				// console.log('VTYT Err', e);
			}

			const timeDifference = this.duration - this.currentTime;

			// Show bumper in last second
			if (timeDifference < 1.5 && timeDifference > 0) {
				this.trigger('bumper:start');
				this.$emit('bumper:start');
			}
		}

		/**
		 * YT.PlayerState.ENDED
		 * YT.PlayerState.PLAYING
		 * YT.PlayerState.PAUSED
		 * YT.PlayerState.BUFFERING
		 * YT.PlayerState.CUED
		 *
		 * @param Event e
		 * @return void
		 */
		protected Handle_OnPlayerStateChange(e: any): void {
			let state = e.data;

			// Flag playing state
			this.isPlaying = e.data == TVVideoShared.window.YT.PlayerState.PLAYING;

			// Check if ended
			if (e.data == TVVideoShared.window.YT.PlayerState.ENDED) {
				this.Handle_OnPlayerEnded();
			}
		}
	}
</script>

<style lang="scss">
	.tv-video-youtube {
		height: 100%;
		width: 100%;
	}
</style>
