<template>
	<section class="chalky utility-youtube">
		<div v-bind:id="playerId"></div>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import UtilityVideoShared from './Shared';
	import { Component, Prop, Watch } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package TV/Video
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class UtilityVideoYouTube extends UtilityVideoShared {
		/**
		 * @type string
		 */
		@Prop()
		public url!: string;

		/**
		 * @type string[]
		 */
		public bindings: string[] = ['Handle_OnInterval', 'Handle_OnVideoEnding', 'Handle_OnVideoStarting'];

		/**
		 * @type string
		 */
		protected videoId: string = '';

		/**
		 * @type number
		 */
		private loadAttempts: number = 0;

		/**
		 * @type number
		 */
		private timeoutInterval: any;

		/**
		 * @type string
		 */
		@mounted
		protected setup(): void {
			this.playerId = 'youtube-player-' + this.cid;

			// Parse out the video ID
			this.videoId = this.parseVideoID(this.url);

			// Embed the YT script
			if (this.requiresScript()) {
				this.embedScript();
			}

			// Create the player
			this.createPlayer(this.videoId);
		}

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
			// Dont attempt loading forever
			if (this.loadAttempts++ > 10) {
				console.warn('Failed to load YT player after 10 attempts.');
				return;
			}

			// YT not loaded
			if (!UtilityVideoShared.window.YT || !UtilityVideoShared.window.YT.Player) {
				this.timeoutInterval = setTimeout(() => {
					this.createPlayer(code, time);
				}, 250);

				return;
			}

			// Clear timeouts
			if (this.timeoutInterval) {
				clearTimeout(this.timeoutInterval);
				this.timeoutInterval = null;
			}

			try {
				// If player already exists, change the video
				if (this.api) {
					this.api.loadVideoById({
						startSeconds: time,
						videoId: code,
					});

					// console.log('Loading a video by ID, ', code);
				} else {
					this.api = new UtilityVideoShared.window.YT.Player(this.playerId, {
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

					// console.log('Created a new player', this.api);

					// Attach hystersis monitors
					this.attachMonitors();

					// Player is ready and API configured
					this.Handle_OnPlayerReady();
				}
			} catch (e) {
				console.warn('Tried to create a player but failed. We may have destroyed it early.', e);
				this.$emit('error');
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
		public reload(): void {
			this.api = null;
			this.createPlayer(this.videoId);
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
			tag.id = 'embed-youtube-api';
			tag.src = 'https://www.youtube.com/iframe_api';

			const firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

			UtilityVideoShared.window.onYouTubeIframeAPIReady = () => {
				return this.Handle_OnApiLoaded();
			};
		}

		/**
		 * @return boolean
		 */
		protected hasApi(): boolean {
			const output = !!this.api;

			if (!output) {
				console.warn('Api does not exist yet.');
			}

			return output;
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
			// return typeof UtilityVideoShared.window != 'undefined' && !(UtilityVideoShared.window as any).YT;
			return !document.querySelector('#embed-youtube-api') || !(UtilityVideoShared.window as any).YT;
		}

		/**
		 * @return Promise<void>
		 */
		@Watch('muted')
		protected async Handle_OnChangeMute(): Promise<void> {
			if (!this.hasApi()) {
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
			if (!this.hasApi()) {
				return;
			}

			if (this.shouldPlay) {
				this.play();
			} else {
				this.pause();
			}
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnInterval(): Promise<void> {
			if (!this.hasApi()) {
				return;
			}

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
		 * @return Promise<void>
		 */
		protected async Handle_OnPlayerStateChange(e: any): Promise<void> {
			let state = e.data;

			// Flag playing state
			this.isPlaying = e.data == UtilityVideoShared.window.YT.PlayerState.PLAYING;

			// Check if ended
			if (e.data == UtilityVideoShared.window.YT.PlayerState.ENDED) {
				this.Handle_OnPlayerEnded();
			}
		}
	}
</script>

<style lang="scss">
	.chalky.utility-youtube {
		background-color: var(--chalky-blue-4);
		border: 1px solid rgba(255, 255, 255, 0.05);
		height: 100%;
		width: 100%;

		iframe {
			border-radius: var(--border-radius);
			height: 100%;
			overflow: hidden;
			width: 100%;
		}
	}
</style>
