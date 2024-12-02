<template>
	<div
		class="chalky tv-videotheater ratio ratio-16x9"
		v-bind:class="{
			'show-controls': showControls && !allowControl,
			'state-bumper': showBumper,
			'state-controls': allowControl,
		}"
		v-on:pointermove="Handle_OnHover"
		v-on:pointerdown="Handle_OnTap"
	>
		<TvYouTube
			v-bind:allowControl="allowControl"
			v-bind:channel="channel"
			v-bind:muted="mute"
			v-bind:shouldPlay="play"
			v-bind:startTime="startTime"
			v-bind:url="url"
			v-if="isVideoFromYouTube"
			v-on:bumper:start="Handle_OnBumperStart"
			v-on:player:ended="Handle_OnPlayerEnded"
			v-on:player:error="Handle_OnPlayerError"
			v-on:player:ready="Handle_OnPlayerReady"
			v-on:video:starting="Handle_OnVideoStarting"
			v-on:video:ending="Handle_OnVideoEnding"
		/>

		<TvFacebook
			v-bind:allowControl="allowControl"
			v-bind:channel="channel"
			v-bind:muted="mute"
			v-bind:shouldPlay="play"
			v-bind:startTime="startTime"
			v-bind:url="url"
			v-else-if="isVideoFromFacebook"
			v-on:bumper:start="Handle_OnBumperStart"
			v-on:player:ended="Handle_OnPlayerEnded"
			v-on:player:error="Handle_OnPlayerError"
			v-on:player:ready="Handle_OnPlayerReady"
			v-on:video:starting="Handle_OnVideoStarting"
			v-on:video:ending="Handle_OnVideoEnding"
		/>

		<div v-else>Unknown video player requested</div>

		<video class="chalky-bumper" muted playsInline ref="bumper" v-on:ended="Handle_OnBumperEnd">
			<source src="https://chalkysticks.s3.amazonaws.com/video/chalky-5s.mp4" type="video/mp4" />
		</video>

		<div class="controls">
			<button class="icon-only" v-on:click="Handle_OnClickCast">
				<img height="24" class="filter-invert" src="../Assets/image/icon/cast.svg" alt="Cast" />
			</button>
			<button class="icon-only" v-on:click="Handle_OnClickFullscreen">
				<img height="24" class="filter-invert" src="../Assets/image/icon/fullscreen.svg" alt="Fullscreen" />
			</button>
		</div>
	</div>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import TvYouTube from './Video/YouTube.vue';
	import TvFacebook from './Video/Facebook.vue';
	import { Component, Prop, Ref, Watch } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

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
	@Component({
		components: {
			TvFacebook,
			TvYouTube,
		},
	})
	export default class VideoTheater extends ViewBase {
		/**
		 * @type ChalkySticks.Model.Schedule
		 */
		protected get currentVideo(): ChalkySticks.Model.Schedule {
			return this.isUsingModel ? this.scheduleModel : this.scheduleCollection.getCurrentVideo();
		}

		/**
		 * @return boolean
		 */
		protected get isUsingModel(): boolean {
			return !!this.scheduleModel && !!this.scheduleModel.id;
		}

		/**
		 * Determine if we're using the scheduleCollection
		 *
		 * @return boolean
		 */
		protected get isUsingSchedule(): boolean {
			return !this.isUsingModel && !!this.scheduleCollection && this.scheduleCollection.length > 0;
		}

		/**
		 * @return boolean
		 */
		protected get isVideoFromFacebook(): boolean {
			return this.currentVideo?.getEmbedUrl().includes('facebook');
		}

		/**
		 * @return boolean
		 */
		protected get isVideoFromYouTube(): boolean {
			return this.currentVideo?.getEmbedUrl().includes('youtube');
		}

		/**
		 * @type HTMLVideoElement
		 */
		@Ref('bumper')
		public viewBumper!: HTMLVideoElement;

		/**
		 * Show video controls
		 *
		 * @type boolean
		 */
		@Prop({ default: false })
		public allowControl!: boolean;

		/**
		 * @type string
		 */
		@Prop({ default: '' })
		public channel!: string;

		/**
		 * @type boolean
		 */
		@Prop({ default: true })
		public mute!: boolean;

		/**
		 * @type boolean
		 */
		@Prop({ default: true })
		public play!: boolean;

		/**
		 * @type ChalkySticks.Collection.Schedule
		 */
		@Prop({
			default: () => ChalkySticks.Factory.Schedule.collection(),
		})
		public scheduleCollection!: ChalkySticks.Collection.Schedule;

		/**
		 * @type ChalkySticks/Model/Schedule
		 */
		@Prop({
			default: () => ChalkySticks.Factory.Schedule.model(),
		})
		public scheduleModel!: ChalkySticks.Model.Schedule;

		/**
		 * @type string[]
		 */
		public bindings: string[] = ['Handle_OnPlayerEnded', 'Handle_OnPlayerError', 'Handle_OnVisibilityChange'];

		/**
		 * If we run out of videos or get an unresolvable error, show this video
		 *
		 * @type string
		 */
		protected defaultVideoUrl: string = 'https://www.youtube.com/watch?v=5dKlZ8DYUpA';

		/**
		 * @type boolean
		 */
		protected showBumper: boolean = false;

		/**
		 * @type boolean
		 */
		protected showControls: boolean = false;

		/**
		 * @type boolean
		 */
		protected startTime: number = 0;

		/**
		 * @type string
		 */
		protected url: string = '';

		/**
		 * @type number
		 */
		private controlsTimeout: number = 0;

		/**
		 * @return void
		 */
		@mounted
		public attachEvents(): void {
			document.addEventListener('visibilitychange', this.Handle_OnVisibilityChange);
		}

		/**
		 * @return void
		 */
		@beforeDestroy
		public detachEvents(): void {
			document.removeEventListener('visibilitychange', this.Handle_OnVisibilityChange);
		}

		/**
		 * @return Promise<void>
		 */
		@mounted
		public async beginAutoplay(): Promise<void> {
			// Wait
			await ChalkySticks.Core.Utility.sleep(10);

			// Load model
			if (this.isUsingModel) {
				this.setByModel(this.scheduleModel);
			} else if (this.isUsingSchedule) {
				this.setBySchedule(this.scheduleCollection);
			} else {
				this.setByGame(this.channel);
			}
		}

		/**
		 * @return void
		 */
		public flagAndSkip(): void {
			if (!this.scheduleCollection || !this.scheduleCollection.getCurrentVideo()) {
				return;
			}

			// Flag video that failed
			this.scheduleCollection.flagCurrentVideo();

			// Set new video
			this.setBySchedule(this.scheduleCollection);
		}

		/**
		 * @return void
		 */
		public playBumper(): void {
			this.viewBumper.currentTime = 0;
			this.viewBumper.play();
			this.showBumper = true;
		}

		/**
		 * @param ChalkySticks.Collection.Schedule collection
		 * @return void
		 */
		public seekToCurrentTime(collection: ChalkySticks.Collection.Schedule): void {
			const model = collection.getCurrentVideo();
			const time = ~~collection.getTimeForCurrentVideo() || 0;

			// Order matters
			this.url = model?.getEmbedUrl() || this.defaultVideoUrl;
			this.startTime = time;
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
		 * Accept a ModelSchedule and start playing
		 *
		 * @param ModelSchedule model
		 * @return void
		 */
		public setByModel(model: ChalkySticks.Model.Schedule): void {
			this.setUrl(model.getEmbedUrl());

			// Event
			this.$emit('schedule:set', this.currentVideo);
		}

		/**
		 * Accept a CollectionSchedule and automatically determine
		 * what to play.
		 *
		 * @param ChalkySticks.Collection.Schedule collection
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

			// Event
			this.$emit('schedule:set', this.currentVideo);
		}

		/**
		 * Set URL based on an embed URL
		 *
		 * @param string url
		 * @param number time
		 * @return void
		 */
		public setUrl(url: string, time: number = 0): void {
			// Order matters because of reactivity
			this.url = url;
			this.startTime = time;
		}

		/**
		 * @return void
		 */
		public stopBumper(): void {
			this.showBumper = false;
		}

		/**
		 * @return void
		 */
		protected displayControls(): void {
			// Show and autohide
			this.showControls = true;

			// Clear intervals
			clearTimeout(this.controlsTimeout);

			// Set new timeout
			this.controlsTimeout = setTimeout(() => {
				this.showControls = false;
			}, 1000 * 3) as any;
		}

		/**
		 * @return Promise<void>
		 */
		protected async goFullscreen(): Promise<void> {
			ChalkySticks.Utility.Presentation.toggleFullscreen(this.$el as HTMLElement);
		}

		/**
		 * @return Promise<void>
		 */
		protected async castVideo(): Promise<void> {
			ChalkySticks.Utility.Presentation.castToDevice(this.url);
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnBumperEnd(): Promise<void> {
			this.stopBumper();

			this.$emit('bumper:end');
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnBumperStart(): Promise<void> {
			if (!this.showBumper) {
				this.playBumper();
			}

			this.$emit('bumper:start');
		}

		/**
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickFullscreen(e: PointerEvent): Promise<void> {
			e.preventDefault();

			this.goFullscreen();
		}

		/**
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickCast(e: PointerEvent): Promise<void> {
			e.preventDefault();

			this.castVideo();
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnHover(): Promise<void> {
			this.displayControls();
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnPlayerEnded(): Promise<void> {
			if (this.isUsingSchedule) {
				setTimeout(() => {
					this.setBySchedule(this.scheduleCollection);
				}, 500);
			}

			this.$emit('player:ended', this.currentVideo);
		}

		/**
		 * Flag and skip if we're using a schedule
		 *
		 * @return Promise<void>
		 */
		protected async Handle_OnPlayerError(): Promise<void> {
			if (this.isUsingSchedule) {
				setTimeout(() => this.flagAndSkip());
			}

			this.$emit('player:error', this.currentVideo);
		}

		/**
		 * Autoplay once the player is loaded and ready
		 *
		 * @return Promise<void>
		 */
		protected async Handle_OnPlayerReady(): Promise<void> {
			// this.beginAutoplay();
			// Autoplay is taken care of by the player

			this.$emit('player:ready', this.currentVideo);
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnTap(): Promise<void> {
			this.displayControls();
		}

		/**
		 * Video is at least 2 seconds in
		 *
		 * @return Promise<void>
		 */
		protected async Handle_OnVideoStarting(): Promise<void> {
			this.$emit('video:starting', this.currentVideo);
		}

		/**
		 * Video is nearly over
		 *
		 * @return Promise<void>
		 */
		protected async Handle_OnVideoEnding(): Promise<void> {
			this.$emit('video:ending', this.currentVideo);
		}

		/**
		 * @param ChalkySticks.Model.Schedule newModel
		 * @param ChalkySticks.Model.Schedule oldModel
		 * @return Promise<void>
		 */
		@Watch('scheduleModel', {
			deep: true,
			immediate: true,
		})
		protected async Handle_OnScheduleModelChange(newModel: ChalkySticks.Model.Schedule, oldModel: ChalkySticks.Model.Schedule): Promise<void> {
			// Model exists and has an ID
			if (newModel && newModel.id) {
				this.beginAutoplay();
			}

			// No model, but we have a collection
			else if (!newModel && this.isUsingSchedule) {
				this.beginAutoplay();
			}

			this.$emit('schedule:change', this.currentVideo);
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnVisibilityChange(): Promise<void> {
			if (document.visibilityState === 'visible') {
				if (this.isUsingSchedule) {
					this.seekToCurrentTime(this.scheduleCollection);
				}
			}

			this.$emit('visibility:change');
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.tv-videotheater {
		margin: 0 auto;
		position: relative;

		.tv-video-facebook,
		.tv-video-youtube {
			pointer-events: none;
		}

		.chalky-bumper,
		iframe {
			border: 0;
			height: 100%;
			left: 0;
			position: absolute;
			top: 0;
			transition: opacity 0.5s ease-in-out;
			width: 100%;
		}

		.chalky-bumper {
			background: var(--chalky-black);
			opacity: 0;
		}

		.controls {
			background: linear-gradient(0deg, rgba(0, 0, 0, 0.66) 80%, rgba(0, 0, 0, 0));
			bottom: 0;
			display: flex;
			gap: 0.25rem;
			height: auto;
			justify-content: flex-end;
			left: 0;
			opacity: 0;
			padding: 0.5rem;
			pointer-events: none;
			position: absolute;
			right: 0;
			text-align: right;
			top: auto;
			transition: opacity 0.5s ease-in-out;
			z-index: 10;

			button {
				padding: 1rem;
			}
		}

		// State
		// ---------------------------------------------------------------------

		&.state-controls {
			.tv-video-facebook,
			.tv-video-youtube {
				pointer-events: all;
			}
		}

		&.show-controls .controls {
			opacity: 1;
			pointer-events: all;
		}

		&.state-bumper {
			.chalky-bumper {
				opacity: 1;
			}
		}
	}
</style>
