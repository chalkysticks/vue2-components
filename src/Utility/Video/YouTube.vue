<template>
	<section class="chalky utility-video-youtube">
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
	 * @package Utility/Video
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

			// Clear any pending timeouts
			if (this.timeoutInterval) {
				clearTimeout(this.timeoutInterval);
				this.timeoutInterval = null;
			}

			// Ensure all event listeners are removed
			this.detachEvents();

			// Properly destroy the YouTube player
			this.destroyPlayer();
		}

		/**
		 * Properly cleanup the YouTube player instance
		 * This is called from beforeDestroy to ensure thorough cleanup
		 *
		 * @return void
		 */
		private destroyPlayer(): void {
			try {
				// Stop the player if it exists
				if (this.api) {
					// Stop the video to prevent audio continuing to play
					this.pause();

					// Destroy the player instance if method exists
					if (typeof this.api.destroy === 'function') {
						this.api.destroy();
					}

					// Remove the element from DOM for complete cleanup
					const playerElement = document.getElementById(this.playerId);

					if (playerElement && playerElement.parentNode) {
						playerElement.parentNode.removeChild(playerElement);
					}

					// Create a fresh container for future use
					const container = document.createElement('div');
					container.id = this.playerId;

					// Find the parent container (our component root)
					const parent = this.$el.querySelector('.chalky.utility-video-youtube');

					if (parent) {
						parent.appendChild(container);
					}
				}
			} catch (e) {
				console.error('Error destroying YouTube player:', e);
			} finally {
				// Ensure the api reference is cleared
				this.api = null;
			}
		}

		/**
		 * @return void
		 */
		public attachEvents(): void {
			super.attachEvents();

			ChalkySticks.Core.Utility.Interval.add(this.Handle_OnInterval, 250, `youtube-${this.cid}`);
		}

		/**
		 * @return void
		 */
		public detachEvents(): void {
			super.detachEvents();

			ChalkySticks.Core.Utility.Interval.remove(`youtube-${this.cid}`);
		}

		/**
		 * @param string code
		 * @param number time
		 * @return Promise<void>
		 */
		public async createPlayer(code: string, time: number = 0): Promise<void> {
			// If no code provided, stop initialization
			if (!code) {
				console.warn('No video ID provided to createPlayer');
				this.$emit('error', { message: 'No video ID provided' });
				return;
			}

			// Use a promise-based approach to wait for the YouTube API
			try {
				await this.waitForYouTubeAPI();

				// Clear any pending timeouts
				if (this.timeoutInterval) {
					clearTimeout(this.timeoutInterval);
					this.timeoutInterval = null;
				}

				// If player already exists, just load the new video
				if (this.api) {
					this.api.loadVideoById({
						startSeconds: time,
						videoId: code,
					});
					return;
				}

				// Create new player instance and wait for it to be ready
				await new Promise<void>((resolve, reject) => {
					// Flag to track if we've handled the ready event
					let playerReadyHandled = false;

					// Create the player with specific options
					const playerOptions = {
						events: {
							onError: (e: any) => {
								this.Handle_OnPlayerError();

								if (!playerReadyHandled) {
									playerReadyHandled = true;
									reject(new Error('Player creation failed'));
								}
							},
							onReady: (e: any) => {
								if (!playerReadyHandled) {
									playerReadyHandled = true;
									this.Handle_OnPlayerReady();
									resolve();
								}
							},
							onStateChange: (e: any) => this.Handle_OnPlayerStateChange(e),
						},
						playerVars: {
							autohide: 1,
							autoplay: this.autoplay && this.shouldPlay ? 1 : 0,
							cc_load_policy: 0,
							controls: this.allowControl ? 1 : 0,
							disablekb: 1,
							enablejsapi: 1,
							iv_load_policy: 3,
							loop: 0,
							modestbranding: 1,
							mute: this.muted ? 1 : 0,
							origin: window.location.origin,
							playsinline: 1,
							rel: 0,
							start: time,
						},
						videoId: code,
					};

					// Create the player instance
					this.api = new UtilityVideoShared.window.YT.Player(this.playerId, playerOptions);

					// Set a timeout in case YouTube never fires the ready event
					this.timeoutInterval = setTimeout(() => {
						if (!playerReadyHandled) {
							playerReadyHandled = true;
							console.warn('YouTube Player ready event timeout');

							// Still resolve to prevent deadlocks
							resolve();
						}
					}, 5000);
				});

				// Set up monitoring after player is ready
				this.attachMonitors();
			} catch (e) {
				console.error('Failed to create YouTube player:', e);
				this.$emit('error', {
					error: e,
					message: 'Failed to create player',
				});
			}
		}

		/**
		 * Waits for the YouTube API to become available
		 *
		 * @return Promise<void>
		 */
		private async waitForYouTubeAPI(): Promise<void> {
			return new Promise<void>((resolve, reject) => {
				const maxAttempts = 20;
				let attempts = 0;

				// Check if API is already loaded
				if (UtilityVideoShared.window.YT && UtilityVideoShared.window.YT.Player) {
					resolve();
					return;
				}

				// Function to check API availability
				const checkAPI = () => {
					attempts++;

					// If we've exceeded max attempts, reject
					if (attempts > maxAttempts) {
						reject(new Error('YouTube API failed to load after multiple attempts'));
						return;
					}

					// Check if API is available now
					if (UtilityVideoShared.window.YT && UtilityVideoShared.window.YT.Player) {
						resolve();
						return;
					}

					// Try again after delay
					setTimeout(checkAPI, 250);
				};

				// Start checking
				checkAPI();
			});
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
			super.play();

			// Play the video if API is available
			if (this.api) {
				this.api.playVideo();
			}
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
		 * @return Promise<void>
		 */
		protected async embedScript(): Promise<void> {
			const scriptId = 'embed-youtube-api';
			const scriptUrl = 'https://www.youtube.com/iframe_api';

			// Set up global callback that YouTube API will call when loaded
			UtilityVideoShared.window.onYouTubeIframeAPIReady = () => {
				return this.Handle_OnApiLoaded();
			};

			// Load the script with our enhanced loader
			await this.loadScript(scriptId, scriptUrl, () => {
				// Script is loaded, but we wait for YouTube to call onYouTubeIframeAPIReady
				// This callback intentionally left empty as YouTube handles it differently
			});
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
	.chalky.utility-video-youtube {
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
