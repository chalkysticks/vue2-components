import ChalkySticks from '@chalkysticks/sdk';
import ViewBase from '../../Core/Base';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { beforeDestroy, mounted } from '@/Utility/Decorators';

/**
 * @author ChalkySticks LLC
 * @package TV/Video
 * @project ChalkySticks SDK Vue2.0 Components
 */
export default abstract class TVVideoShared extends ViewBase {
	/**
	 * Show player controls
	 *
	 * @type boolean
	 */
	@Prop({ default: false })
	public allowControl!: boolean;

	/**
	 * Request from parent object to mute our player
	 *
	 * @type boolean
	 */
	@Prop({ default: true })
	public muted!: boolean;

	/**
	 * @type number
	 */
	@Prop({ default: 0 })
	public startTime!: number;

	/**
	 * @type string
	 */
	@Prop({ default: '' })
	public url!: string;

	/**
	 * @type object
	 */
	public api: any;

	/**
	 * @type boolean
	 */
	public autoplay: boolean = true;

	/**
	 * @type string[]
	 */
	public bindings: string[] = ['Handle_OnApiReady', 'Handle_OnPlayerReady', 'Handle_OnPlayerStateChange'];

	/**
	 * We listen to the video and cache the current time locally
	 *
	 * @type number
	 */
	public currentTime: number = 0;

	/**
	 * Sync the duration of the current video locally through event listeners
	 *
	 * @type number
	 */
	public duration: number = 0;

	/**
	 * Cached variable to determine if the video is actively playing
	 *
	 * @type boolean
	 */
	public isPlaying: boolean = false;

	/**
	 * @type string
	 */
	public playerId: string = Math.random().toString(16).substr(2, 8);

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
	}

	// region: Actions
	// ---------------------------------------------------------------------------

	/**
	 * @param string code
	 * @param number time
	 * @return Promise<void>
	 */
	public async createPlayer(code: string, time: number = 0): Promise<void> {
		console.warn('Override this function in your implementation');
	}

	/**
	 * @return number
	 */
	public getCurrentTime(): number {
		return -1;
	}

	/**
	 * @return number
	 */
	public getDuration(): number {
		return -1;
	}

	/**
	 * @return number
	 */
	public getVideoUrl(): string {
		return '';
	}

	/**
	 * @return boolean
	 */
	public isMuted(): boolean {
		return false;
	}

	/**
	 * @return void
	 */
	public mute(): void {
		console.warn('Override this function in your implementation');
	}

	/**
	 * @return void
	 */
	public pause(): void {
		console.warn('Override this function in your implementation');
	}

	/**
	 * @return void
	 */
	public play(): void {
		console.warn('Override this function in your implementation');
	}

	/**
	 * @param number seconds
	 * @return void
	 */
	public seekBackward(interval: number = 30): void {
		const seconds: number = Math.max(0, this.currentTime - interval);
		this.seekTo(seconds);
	}

	/**
	 * @param number seconds
	 * @return void
	 */
	public seekForward(interval: number = 30): void {
		const seconds: number = Math.min(this.duration, this.currentTime + interval);
		this.seekTo(seconds);
	}

	/**
	 * @param number seconds
	 * @return void
	 */
	public seekTo(seconds: number = 30): void {
		console.warn('Override this function in your implementation');
	}

	/**
	 * Set URL based on an embed URL
	 *
	 * @param string url
	 * @param number time
	 * @return void
	 */
	public setUrl(url: string, time: number = 0): void {
		const videoId = this.parseVideoID(url);

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
		if (this.isMuted()) {
			this.unmute();
		} else {
			this.mute();
		}
	}

	/**
	 * @return void
	 */
	public unmute(): void {
		console.warn('Override this function in your implementation');
	}

	// endregion: Actions

	// region: Event Handlers
	// ---------------------------------------------------------------------------

	/**
	 * @return void
	 */
	protected Handle_OnApiLoaded(): void {
		this.trigger('api:loaded');
	}

	/**
	 * @return void
	 */
	protected Handle_OnApiReady(): void {
		this.trigger('api:ready');
	}

	/**
	 * @return void
	 */
	protected Handle_OnPlayerEnded(): void {
		this.trigger('player:ended');
		this.$emit('player:ended');
	}

	/**
	 * @return void
	 */
	protected Handle_OnPlayerError(): void {
		this.trigger('player:error');
		this.$emit('player:error');
	}

	/**
	 * @return void
	 */
	protected Handle_OnPlayerReady(): void {
		if (this.url) {
			this.play();
		}

		this.trigger('player:ready', {
			duration: this.getDuration(),
			url: this.getVideoUrl(),
		});
		this.$emit('player:ready');
	}

	/**
	 * @param Event e
	 * @return void
	 */
	protected Handle_OnPlayerStateChange(e: any): void {
		// Handle state changes by player.
		// This may change based on type of player.
	}

	/**
	 * Listen for changes in the URL from the VideoTheater
	 *
	 * @param number newValue
	 * @param number oldValue
	 * @return void
	 */
	@Watch('startTime')
	protected Handle_OnStartTimeChange(newValue: number, oldValue: number): void {
		if (newValue !== oldValue) {
			this.seekTo(newValue);
		}
	}

	/**
	 * Listen for changes in the URL from the VideoTheater
	 *
	 * @param string newValue
	 * @param string oldValue
	 * @return void
	 */
	@Watch('url')
	protected Handle_OnUrlChange(newValue: string, oldValue: string): void {
		if (newValue !== oldValue) {
			this.setUrl(newValue, this.startTime);
		}
	}

	// endregion: Event Handlers

	// region: Helpers
	// ---------------------------------------------------------------------------

	/**
	 * @return void
	 */
	protected embedScript(): void {
		console.warn('Override this function in your implementation');
	}

	/**
	 * Parse out video URL
	 *
	 * @param string url
	 * @return string
	 */
	protected parseVideoID(url: string): string {
		console.warn('Override this function in your implementation');

		return '';
	}

	/**
	 * Check if we should be embedding the video player's script
	 *
	 * @return boolean
	 */
	protected requiresScript(): boolean {
		console.warn('Override this function in your implementation');

		return false;
	}

	// endregion: Helpers
}
