<template>
	<section class="chalky utility-video-facebook">
		<div
			class="fb-video"
			aria-label="Facebook video player"
			data-allowfullscreen="true"
			data-lazy="true"
			data-mute="true"
			data-show-captions="false"
			data-show-text="false"
			ref="player"
			v-bind:data-autoplay="autoplay && shouldPlay"
			v-bind:data-href="url"
			v-bind:id="playerId"
			v-bind:key="playerId"
		></div>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import UtilityVideoShared from './Shared';
	import { Component, Prop, Ref, Watch } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package Utility/Video
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class UtilityVideoFacebook extends UtilityVideoShared {
		/**
		 * @type HTMLElement
		 */
		@Ref('player')
		public player!: HTMLElement;

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
		 * @return void
		 */
		public async createPlayer(videoId: string, time: number = 0): Promise<void> {
			// YT not loaded
			if (!UtilityVideoShared.window.FB) {
				setTimeout(() => {
					this.createPlayer(videoId, time);
				}, 250);

				return;
			}

			try {
				this.api = await this.waitForPlayer();

				// If player already exists, change the video
				if (this.api) {
					console.log('Loading Facebook player', videoId, time, this.api);
					this.api.load(videoId || this.url, { startAt: time });

					this.api.subscribe('error', () => this.Handle_OnPlayerError());
					this.api.subscribe('finishedPlaying', () => this.Handle_OnPlayerStateChange('ENDED'));
					this.api.subscribe('paused', () => this.Handle_OnPlayerStateChange('PAUSED'));
					this.api.subscribe('startedPlaying', () => this.Handle_OnPlayerStateChange('PLAYING'));

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
			return this.api.getCurrentPosition();
		}

		/**
		 * @return number
		 */
		public getDuration(): number {
			return this.api.getDuration();
		}

		/**
		 * @return string
		 */
		public getVideoUrl(): string {
			return this.url;
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
			this.api?.pause();
		}

		/**
		 * @return number
		 */
		public play(): void {
			// Call base implementation to handle player management
			super.play();

			// Play the video if API is available
			if (this.api) {
				this.api.play();
			}
		}

		/**
		 * @return void
		 */
		public unmute(): void {
			this.api?.unmute();
		}

		/**
		 * @param number seconds
		 * @return void
		 */
		public seekTo(seconds: number = 30): void {
			try {
				this.api?.seek(seconds, true);
			} catch (e) {
				console.warn('Could not seek to', seconds);
			}
		}

		/**
		 * @return void
		 */
		protected embedScript(): void {
			const tag = document.createElement('script');
			tag.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v12.0';

			const firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

			UtilityVideoShared.window.fbAsyncInit = () => {
				UtilityVideoShared.window.FB.init({
					appId: '416522395115051',
					autoLogAppEvents: true,
					version: 'v12.0',
					xfbml: true,
				});

				this.Handle_OnApiLoaded();
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
		 * Check if we should be embedding the FB script
		 *
		 * @return boolean
		 */
		protected requiresScript(): boolean {
			return typeof UtilityVideoShared.window != 'undefined' && !UtilityVideoShared.window.FB;
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
		 * @param string state
		 * @return void
		 */
		protected Handle_OnPlayerStateChange(state: string): void {
			// Flag playing state
			this.isPlaying = state === 'PLAYING';

			// Check if ended
			if (state === 'ENDED') {
				this.Handle_OnPlayerEnded();
			}
		}

		/**
		 * @return void
		 */
		private resolvePlayerReady: ((instance: any) => void) | null = null;

		/**
		 * Extended cleanup for Facebook specific resources
		 *
		 * @return void
		 */
		protected cleanup(): void {
			// Call base class cleanup first
			super.cleanup();

			try {
				// Cleanup player specific resources
				if (this.api) {
					// Stop video playback
					this.pause();

					// Clear references
					this.api = null;
				}

				// Only unsubscribe if FB exists
				if (UtilityVideoShared.window.FB && UtilityVideoShared.window.FB.Event) {
					UtilityVideoShared.window.FB.Event.unsubscribe('xfbml.ready', this.Handle_OnFacebookReady);
				}

				// Clear player element content
				if (this.player && this.player.innerHTML) {
					this.player.innerHTML = '';
				}
			} catch (e) {
				console.error('Error cleaning up Facebook player:', e);
			}
		}

		/**
		 * More aggressive cleanup that removes all Facebook elements
		 * Only use this when you want to completely remove Facebook SDK
		 * WARNING: This can cause issues with other components that use Facebook
		 *
		 * @return void
		 */
		@beforeDestroy
		private unsubscribeFromFacebook(): void {
			try {
				// Call regular cleanup first
				this.cleanup();

				// Only proceed with full cleanup if other Facebook players don't exist
				const hasFBPlayers = Array.from(UtilityVideoShared.playerManager.players).some((player) => {
					return player !== this && player instanceof UtilityVideoFacebook;
				});

				// If other FB players exist, don't remove global resources
				if (hasFBPlayers) {
					return;
				}

				// Remove all Facebook elements from the page
				const xfbmlElements = document.querySelectorAll('.fb-video, .fb-like, .fb-comments');
				xfbmlElements.forEach((el) => el.parentNode?.removeChild(el));

				// Only remove the script if we're sure no other components need it
				if (!document.querySelector('.chalky.utility-video-facebook')) {
					const fbScript = document.querySelector('script[src*="connect.facebook.net"]');
					fbScript && fbScript.parentNode?.removeChild(fbScript);

					// Remove global FB object - very destructive!
					if (UtilityVideoShared.window.FB) {
						delete UtilityVideoShared.window.FB;
						console.warn('Removed global FB object - this may affect other components');
					}
				}
			} catch (e) {
				console.error('Error during Facebook cleanup:', e);
			}
		}

		/**
		 * Wait for the player to be ready
		 * @return Promise<any>
		 */
		private waitForPlayer(): Promise<any> {
			return new Promise((resolve) => {
				this.resolvePlayerReady = resolve;

				setTimeout(() => {
					// Wait for player to be ready
					UtilityVideoShared.window.FB.Event.subscribe('xfbml.ready', this.Handle_OnFacebookReady);

					// Parse new element
					UtilityVideoShared.window.FB.XFBML.parse(this.player);
				}, 250);
			});
		}

		/**
		 * @return void
		 */
		private Handle_OnFacebookReady(msg: any): void {
			if (msg.type === 'video' && msg.id === this.playerId) {
				this.resolvePlayerReady && this.resolvePlayerReady(msg.instance);
			}
		}

		/**
		 * @return Promise<void>
		 */
		@Watch('muted')
		protected async Handle_OnChangeMute(): Promise<void> {
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
			if (this.shouldPlay) {
				this.play();
			} else {
				this.pause();
			}
		}
	}
</script>

<style lang="scss">
	.chalky.utility-video-facebook {
		height: 100%;
		width: 100%;

		.fb-video,
		.fb-video > *,
		iframe {
			height: 100%;
			width: 100%;
		}

		.fb-video {
			align-items: center;
			background: #000;
			display: flex;
			justify-content: center;
			overflow: hidden;
			position: relative;
		}

		.iframe {
			height: 100%;
			max-height: 100%;
			max-width: 100%;
			object-fit: contain;
			position: absolute;
			width: 100%;
		}
	}
</style>
