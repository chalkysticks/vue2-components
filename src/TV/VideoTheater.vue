<template>
	<div class="chalky tv-videotheater ratio ratio-16x9" v-bind:class="{ 'state-controls': allowControl }">
		<div v-bind:id="playerId"></div>
	</div>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import Environment from '../Core/Environment';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * @type Enum
	 */
	export const VideoTheaterChannel: Record<string, string> = {
		'10BALL': '10-ball',
		'1POCKET': '1-pocket',
		'8BALL': '8-ball',
		'9BALL': '9-ball',
		'BILLIARDS': 'billiards',
		'CHALKY': '',
		'SNOOKER': 'snooker',
		'STRAIGHT': 'straight',
		'TRICK': 'trickshot',
	};

	/**
	 * @class TVVideoTheater
	 * @package TV
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class VideoTheater extends ViewBase {
		/**
		 * Determine if we're using the schedule
		 *
		 * @return boolean
		 */
		public get isUsingSchedule(): boolean {
			return this.scheduleCollection && this.scheduleCollection.length > 0;
		}

		/**
		 * @type boolean
		 */
		public allowControl: boolean = false;

		/**
		 * @type YTPlayer
		 */
		public api: any;

		/**
		 * @type boolean
		 */
		public autoplay: boolean = true;

		/**
		 * @type string[]
		 */
		public bindings: string[] = ['Handle_OnInterval', 'Handle_OnPlayerStateChange', 'Handle_OnPlayerReady', 'Handle_OnYouTubeReady'];

		/**
		 * @type string
		 */
		@Prop({ default: '' })
		public channel!: string;

		/**
		 * Current time of the video
		 *
		 * @type number
		 */
		public currentTime: number = 0;

		/**
		 * If we run out of videos or get an unresolvable error, show this video
		 *
		 * @type string
		 */
		public defaultVideoUrl: string = 'https://www.youtube.com/watch?v=5dKlZ8DYUpA';

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
		@Prop({ default: true })
		public mute!: boolean;

		/**
		 * @type string
		 */
		public playerId: string = Math.random().toString(16).substr(2, 8);

		/**
		 * @type CollectionSchedule
		 */
		public scheduleCollection: ChalkySticks.Collection.Schedule = new ChalkySticks.Collection.Schedule({
			baseUrl: ChalkySticks.Core.Constants.API_URL_V1,
		});

		/**
		 * @type string
		 */
		public url: string = '';

		/**
		 * @type ReturnType<typeof setInterval>
		 */
		protected interval: any = 0;

		/**
		 * @param object options
		 **/
		constructor(options: Record<string, any> = {}) {
			super(options);

			// Embed script
			if (this.requiresScript()) {
				this.embedScript();
			}

			// Set by schedule default
			if (this.autoplay) {
				setTimeout(() => {
					this.setByGame(this.channel);
				}, 1);
			}
		}

		/**
		 * @return void
		 */
		public attachEvents(): void {
			this.interval = setInterval(this.Handle_OnInterval, 250);
		}

		/**
		 * @return void
		 */
		public detachEvents(): void {
			clearInterval(this.interval);
			this.interval = 0;
		}

		// region: Actions
		// ---------------------------------------------------------------------------

		/**
		 * @param string code
		 * @param number time
		 * @return void
		 */
		public createPlayer(code: string, time: number = 0) {
			// YT not loaded
			if (!ViewBase.window.YT || !ViewBase.window.YT.Player) {
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
			} else {
				this.api = new ViewBase.window.YT.Player(this.playerId, {
					events: {
						onError: () => this.Handle_OnPlayerError(),
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
		 * @return void
		 */
		public flagAndSkip(): void {
			// Flag video that failed
			this.scheduleCollection.flagCurrentVideo();

			// Set new video
			this.setBySchedule(this.scheduleCollection);
		}

		/**
		 * @return void
		 */
		public pause(): void {
			this.api.pauseVideo();
		}

		/**
		 * @return void
		 */
		public play(): void {
			this.api.playVideo();
		}

		/**
		 * @param number seconds
		 * @return void
		 */
		public seekBackward(interval: number = 30): void {
			const seconds: number = Math.max(0, this.currentTime - interval);
			this.api.seekTo(seconds, true);
		}

		/**
		 * @param number seconds
		 * @return void
		 */
		public seekForward(interval: number = 30): void {
			const seconds: number = Math.min(this.duration, this.currentTime + interval);
			this.api.seekTo(seconds, true);
		}

		/**
		 * @param number seconds
		 * @return void
		 */
		public seekTo(seconds: number = 30): void {
			this.api.seekTo(seconds, true);
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
		 * @param string gameType
		 * @return void
		 */
		public setByGame(gameType: string): void {
			this.scheduleCollection
				.setQueryParam('channel', gameType)
				.fetch()
				.then(() => {
					this.setBySchedule(this.scheduleCollection);
				});
		}

		/**
		 * Accept a CollectionSchedule and automatically determine
		 * what to play.
		 *
		 * @return void
		 */
		public setBySchedule(collection: ChalkySticks.Collection.Schedule): void {
			const model = collection.getCurrentVideo();
			const embedUrl = model?.getEmbedUrl() || this.defaultVideoUrl;
			const time = embedUrl !== this.defaultVideoUrl ? ~~collection.getTimeForCurrentVideo() : 0;

			// Set schedule
			this.scheduleCollection = collection;

			// Show title
			this.setUrl(embedUrl, time);
		}

		/**
		 * Accept a ModelSchedule and start playing
		 *
		 * @param ModelSchedule model
		 * @return void
		 */
		public setByModel(model: ChalkySticks.Model.Schedule): void {
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

		/**
		 * @return void
		 */
		public toggle(): void {
			if (this.isPlaying) {
				this.pause();
			} else {
				this.play();
			}
		}

		/**
		 * @return void
		 */
		public toggleMute(): void {
			if (this.api.isMuted()) {
				this.api.unMute();
			} else {
				this.api.mute();
			}
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
			return typeof window != 'undefined' && !(window as any).YT;
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
			} catch (e) {
				// console.log('VTYT Err', e);
			}
		}

		/**
		 * @return void
		 */
		protected Handle_OnPlayerEnded(): void {
			if (this.isUsingSchedule) {
				setTimeout(() => {
					this.setBySchedule(this.scheduleCollection);
				}, 500);
			}

			// Trigger end
			this.dispatch('player:ended');
		}

		/**
		 * @return void
		 */
		protected Handle_OnPlayerError(): void {
			// Flag and skip if we're using a schedule
			if (this.isUsingSchedule) {
				setTimeout(() => this.flagAndSkip());
			}

			// Trigger error
			this.dispatch('player:error');
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

			// console.log('Duration', this.api.getDuration());
			// console.log('Current Time', this.api.getCurrentTime());
			// console.log('URL', this.api.getVideoUrl());
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
		pointer-events: none;
		position: relative;

		iframe {
			border: 0;
			height: 100%;
			left: 0;
			position: absolute;
			top: 0;
			width: 100%;
		}

		// State
		// ---------------------------------------------------------------------

		&.state-controls {
			pointer-events: all;
		}
	}
</style>
