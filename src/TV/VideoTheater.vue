<template>
	<div class="chalky tv-videotheater ratio ratio-16x9">
		<div :id="playerId"></div>
	</div>
</template>

<script lang="ts">
	import ViewBase from '../Core/Base';
	import Environment from '../Core/Environment';
	import { CollectionSchedule, ModelSchedule } from '@chalkysticks/sdk';
	import { Component, Prop } from 'vue-property-decorator';

	@Component
	export default class TvVideoTheater extends ViewBase {
		/**
		 * Determine if we're using the schedule
		 *
		 * @return boolean
		 */
		public get isUsingSchedule(): boolean {
			return this.collection && this.collection.length > 0;
		}

		/**
		 * Reference to YT player
		 *
		 * @type any
		 */
		public api: any;

		/**
		 * @type boolean
		 */
		@Prop({
			default: true,
		})
		public autoplay!: boolean;

		/**
		 * Function names to bind to class, typically used for event handlers
		 *
		 * Example:
		 *     ['Handle_OnEvent', 'Handle_On...']
		 *
		 * @type string[]
		 */
		public bindings: string[] = [
			'Handle_OnInterval',
			'Handle_OnPlayerStateChange',
			'Handle_OnPlayerReady',
			'Handle_OnYouTubeReady',
		];

		/**
		 * Collection of Scheduled items
		 *
		 * @type CollectionSchedule
		 */
		public collection: CollectionSchedule = new CollectionSchedule;

		/**
		 * Current time of the video
		 *
		 * @type number
		 */
		public currentTime: number = 0;

		/**
		 * Duration of the video
		 *
		 * @type number
		 */
		public duration: number = 0;

		/**
		 * @type boolean
		 */
		public isPlaying: boolean = false;

		/**
		 * @type boolean
		 */
		@Prop({
			default: false,
		})
		public mute!: boolean;

		/**
		 * Random player ID
		 *
		 * @type string
		 */
		public playerId: string = Math.random()
			.toString(16)
			.substr(2, 8);

		/**
		 * Get URL
		 *
		 * @type string
		 */
		public url: string = '';

		/**
		 * Set interval
		 *
		 * @type number
		 */
		protected interval: number = 0;

		/**
		 * On created
		 **/
		constructor(options = {}) {
			super(options);

			// Embed script
			if (this.requiresScript()) {
				this.embedScript();
			}
		}

		/**
		 * Attach events
		 *
		 * @return void
		 */
		public attachEvents(): void {
			this.interval = setInterval(this.Handle_OnInterval, 250);
		}

		/**
		 * Detach events
		 *
		 * @return void
		 */
		public detachEvents(): void {
			clearInterval(this.interval);
			this.interval = 0;
		}


		// region: Actions
		// ---------------------------------------------------------------------------

		/**
		 * Create player
		 *
		 * @return void
		 */
		public createPlayer(code: string, time: number = 0) {
			if (ViewBase.window.YT && ViewBase.window.YT.Player) {
				// this.createPlayer(videoId, time);
			}
			else {
				setTimeout(() => {
					this.createPlayer(code, time);
				}, 250);

				return;
			}

			// If player already exists, change the video
			if (this.api) {
				this.api.loadVideoById({
					startSeconds: time,
					videoId: code,
				});
			}
			else {
				this.api = new ViewBase.window.YT.Player(this.playerId, {
					events: {
						onReady: (e: any) => this.Handle_OnPlayerReady(e),
						onStateChange: (e: any) => this.Handle_OnPlayerStateChange(e),
					},
					playerVars: {
						autoplay: this.autoplay,
						cc_load_policy: 0,
						controls: 0,
						disablekb: 1,
						iv_load_policy: 3,
						loop: 0,
						modestbranding: 1,
						mute: this.mute,
						playsinline: 1,
						start: time,
					},
					videoId: code,
				});
			}
		}

		/**
		 * Pause video
		 *
		 * @return void
		 */
		public pause(): void {
			this.api.pauseVideo();
		}

		/**
		 * Play video
		 *
		 * @return void
		 */
		public play(): void {
			this.api.playVideo();
		}

		/**
		 * Seek backward by
		 *
		 * @param number seconds
		 * @return void
		 */
		public seekBackward(interval: number): void {
			const seconds: number = Math.max(0, this.currentTime - interval);
			this.api.seekTo(seconds, true);
		}

		/**
		 * Seek forward by
		 *
		 * @param number seconds
		 * @return void
		 */
		public seekForward(interval: number): void {
			const seconds: number = Math.min(this.duration, this.currentTime + interval);
			this.api.seekTo(seconds, true);
		}

		/**
		 * Seek video
		 *
		 * @param number seconds
		 * @return void
		 */
		public seekTo(seconds: number): void {
			this.api.seekTo(seconds, true);
		}

		/**
		 * Toggle video
		 *
		 * @return void
		 */
		public toggle(): void {
			if (this.isPlaying) {
				this.pause();
			}
			else {
				this.play();
			}
		}

		/**
		 * Toggle mute
		 *
		 * @return void
		 */
		public toggleMute(): void {
			if (this.api.isMuted()) {
				this.api.unMute();
			}
			else {
				this.api.mute();
			}
		}

		/**
		 * Pass a YouTube ID to the object
		 *
		 * @return string
		 */
		public setById(videoId: string, time: number = 0): void {
			this.createPlayer(videoId, time);
		}

		/**
		 * Accept a CollectionSchedule and automatically determine
		 * what to play.
		 *
		 * @return void
		 */
		public setBySchedule(collection: CollectionSchedule): void {
			const model: ModelSchedule = collection.getCurrentVideo();
			const time: number = ~~collection.getTimeForCurrentVideo();

			// Set schedule
			this.collection = collection;

			// Show title
			this.setUrl(model.getEmbedUrl(), time);
		}

		/**
		 * Accept a ModelSchedule and start playing
		 *
		 * @param ModelSchedule model
		 * @return void
		 */
		public setByModel(model: ModelSchedule): void {
			this.setUrl(model.getEmbedUrl());
		}

		/**
		 * Set URL based on an embed URL
		 *
		 * @param string url
		 * @param number time
		 * @return void
		 */
		public setUrl(url: string, time: number = 0): void {
			const videoId: string = this.parseVideoID(url);

			this.createPlayer(videoId, time);
		}

		// endregion: Actions


		// region: Getters
		// ---------------------------------------------------------------------------

		/**
		 * Check if we should be embedding the YT script
		 *
		 * @return boolean
		 */
		public requiresScript(): boolean {
			return typeof(window) != 'undefined' && !((window as any).YT);
		}

		// endregion: Getters


		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @return void
		 */
		protected Handle_OnInterval(): void {
			try {
				this.currentTime = this.api.getCurrentTime();
				this.duration = this.api.getDuration(); // cache me
			}
			catch (e) {
				//
			}
		}

		/**
		 * @return void
		 */
		protected Handle_OnPlayerEnded(): void {
			if (this.isUsingSchedule) {
				setTimeout(() => {
					this.setBySchedule(this.collection);
				}, 500);
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
			this.isPlaying = e.data == ViewBase.window.YT.PlayerState.PLAYING;

			// Check if ended
			if (e.data == ViewBase.window.YT.PlayerState.ENDED) {
				this.Handle_OnPlayerEnded();
			}
		}

		/**
		 * @return void
		 */
		protected Handle_OnPlayerReady(e: any): void {
			if (this.autoplay) {
				e.target.playVideo();
			}

			this.trigger('player:ready', {
				duration: this.api.getDuration(),
				url: this.api.getVideoUrl(),
			});

			console.log('Duration', this.api.getDuration());
			console.log('Current Time', this.api.getCurrentTime());
			console.log('URL', this.api.getVideoUrl());
		}

		/**
		 * @return void
		 */
		protected Handle_OnYouTubeReady(): void {
			console.log('YouTube Ready');
		}

		// endregion: Event Handlers


		// region: Helpers
		// ---------------------------------------------------------------------------

		/**
		 * @return void
		 */
		protected embedScript(): void {
			const tag = document.createElement('script');
			tag.src = 'https://www.youtube.com/iframe_api';

			const firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

			ViewBase.window.onYouTubeIframeAPIReady = () => {
				return this.Handle_OnYouTubeReady();
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

		// endregion: Helpers
	}
</script>

<style lang="scss">
	.chalky.tv-videotheater {
		margin: 0 auto;
		position: relative;

		iframe {
			border: 0;
			height: 100%;
			left: 0;
			position: absolute;
			top: 0;
			width: 100%;
		}
	}
</style>
