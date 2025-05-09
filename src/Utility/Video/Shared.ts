import ChalkySticks from '@chalkysticks/sdk';
import ViewBase from '../../Core/Base';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { beforeDestroy, mounted } from '@/Utility/Decorators';

/**
 * State of an external script loading process
 */
export interface ScriptLoadState {
	callbacks: any[];
	loaded: boolean;
	loading: boolean;
}

/**
 * Video player manager type
 */
export interface VideoPlayerManager {
	activePlayer: UtilityVideoShared | null;
	players: Set<UtilityVideoShared>;
}

/**
 * @author ChalkySticks LLC
 * @package Utility/Video
 * @project ChalkySticks SDK Vue2.0 Components
 */
export default abstract class UtilityVideoShared extends ViewBase {
	/**
	 * Tracks script loading states for different APIs
	 */
	protected static scriptStates: Record<string, ScriptLoadState> = {};

	/**
	 * Global singleton manager for all video players
	 */
	protected static playerManager: VideoPlayerManager = {
		activePlayer: null,
		players: new Set<UtilityVideoShared>(),
	};

	/**
	 * Show player controls
	 *
	 * @type boolean
	 */
	@Prop({ default: false })
	public allowControl!: boolean;

	/**
	 * @type boolean
	 */
	@Prop({ default: true })
	public autoplay: boolean = true;

	/**
	 * Request from parent object to mute our player
	 *
	 * @type boolean
	 */
	@Prop({ default: true })
	public muted!: boolean;

	/**
	 * When to play or not play
	 *
	 * @type boolean
	 */
	@Prop({ default: true })
	public shouldPlay!: boolean;

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
	 * @type boolean
	 */
	protected apiLoaded: boolean = false;

	/**
	 * @type ReturnType<typeof setInterval>
	 */
	protected interval: any = 0;

	/**
	 * @type ReturnType<typeof setInterval>
	 */
	protected hysteresisStarting!: ChalkySticks.Utility.Hysteresis;

	/**
	 * @type ReturnType<typeof setInterval>
	 */
	protected hysteresisEnding!: ChalkySticks.Utility.Hysteresis;

	/**
	 * @type boolean
	 */
	private isAttached: boolean = false;

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

	/**
	 * @return void
	 */
	public mounted(): void {
		super.mounted();

		// Register this player with the manager
		this.registerPlayer();
		this.attachEvents();
	}

	/**
	 * @return void
	 */
	public beforeDestroy(): void {
		super.beforeDestroy();

		// Ensure player is stopped and resources released
		this.cleanup();

		// Unregister from the player manager
		this.unregisterPlayer();
		this.detachEvents();
	}

	/**
	 * Perform complete cleanup of the player
	 * Subclasses should extend this method for specific implementation cleanup
	 *
	 * @return void
	 */
	protected cleanup(): void {
		// Stop all intervals and timers
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = 0;
		}

		// Ensure hysteresis monitors are stopped
		this.hysteresisStarting?.stop();
		this.hysteresisEnding?.stop();

		// Stop playback
		try {
			this.pause();
		} catch (e) {
			// Ignore errors during cleanup
		}
	}

	/**
	 * Register this player with the global player manager
	 *
	 * @return void
	 */
	protected registerPlayer(): void {
		UtilityVideoShared.playerManager.players.add(this);
	}

	/**
	 * Unregister this player from the global player manager
	 *
	 * @return void
	 */
	protected unregisterPlayer(): void {
		// Remove from the player collection
		UtilityVideoShared.playerManager.players.delete(this);

		// If this was the active player, clear the reference
		if (UtilityVideoShared.playerManager.activePlayer === this) {
			UtilityVideoShared.playerManager.activePlayer = null;
		}
	}

	/**
	 * Makes this player active and pauses all others
	 *
	 * @return void
	 */
	protected makeActive(): void {
		const currentActive = UtilityVideoShared.playerManager.activePlayer;

		// Don't do anything if this is already the active player
		if (currentActive === this) {
			return;
		}

		// Pause the currently active player if there is one
		if (currentActive && currentActive !== this) {
			currentActive.pause();
		}

		// Set this as the active player
		UtilityVideoShared.playerManager.activePlayer = this;
	}

	/**
	 * @return void
	 */
	public attachEvents(): void {
		if (this.isAttached) {
			return;
		}

		this.isAttached = true;
	}

	/**
	 * @return void
	 */
	public detachEvents(): void {
		this.isAttached = false;

		this.hysteresisEnding?.off('set', this.Handle_OnVideoEnding);
		this.hysteresisStarting?.off('set', this.Handle_OnVideoStarting);

		this.hysteresisStarting?.stop();
		this.hysteresisEnding?.stop();
	}

	/**
	 * @return void
	 */
	protected attachMonitors(): void {
		// Listen for changes to current time
		this.hysteresisStarting = ChalkySticks.Utility.Hysteresis.add({
			condition: () => this.isPlaying && this.currentTime >= 0.5,
			duration: 1000,
		});

		this.hysteresisEnding = ChalkySticks.Utility.Hysteresis.add({
			condition: () => this.isPlaying && this.currentTime >= this.duration - 5 && this.duration > 0,
			duration: 1000,
		});

		this.hysteresisEnding.on('set', this.Handle_OnVideoEnding);
		this.hysteresisStarting.on('set', this.Handle_OnVideoStarting);
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
	 * Play this video and pause any other active players
	 *
	 * @return void
	 */
	public play(): void {
		// Make this the active player (pauses other players)
		this.makeActive();

		// Subclasses must implement the actual play functionality
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
		this.apiLoaded = true;
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
		if (this.url && this.autoplay && this.shouldPlay) {
			this.play();
		}

		this.trigger('player:ready');
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

	/**
	 * @return Promise<void>
	 */
	protected async Handle_OnVideoEnding(): Promise<void> {
		this.trigger('video:ending');
		this.$emit('video:ending');
	}

	/**
	 * @param Event e
	 * @return Promise<void>
	 */
	protected async Handle_OnVideoStarting(): Promise<void> {
		this.trigger('video:starting');
		this.$emit('video:starting');
	}

	// endregion: Event Handlers

	// region: Helpers
	// ---------------------------------------------------------------------------

	/**
	 * Loads an external script with proper tracking and callback management
	 *
	 * @param string scriptId Unique identifier for this script
	 * @param string src Script URL to load
	 * @param Function callback Function to call when script loads
	 * @return Promise<void>
	 */
	protected loadScript(scriptId: string, src: string, callback: any): Promise<void> {
		return new Promise((resolve) => {
			// Initialize script state if not already tracked
			if (!UtilityVideoShared.scriptStates[scriptId]) {
				UtilityVideoShared.scriptStates[scriptId] = {
					callbacks: [],
					loaded: false,
					loading: false,
				};
			}

			const scriptState = UtilityVideoShared.scriptStates[scriptId];

			// Script already loaded - execute callback immediately
			if (scriptState.loaded) {
				callback();
				resolve();
				return;
			}

			// Add this callback to the queue
			scriptState.callbacks.push(() => {
				callback();
				resolve();
			});

			// If already loading, just wait for the existing load to complete
			if (scriptState.loading) {
				return;
			}

			// Start loading the script
			scriptState.loading = true;

			// Check if script already exists in the DOM
			const existingScript = document.getElementById(scriptId) as HTMLScriptElement;

			if (existingScript) {
				if (existingScript.getAttribute('data-loaded') === 'true') {
					this.executeScriptCallbacks(scriptId);
				}

				return;
			}

			// Create and add the script
			const tag = document.createElement('script');
			tag.id = scriptId;
			tag.src = src;
			tag.setAttribute('data-loading', 'true');

			// Set up load handler
			tag.onload = () => {
				tag.setAttribute('data-loaded', 'true');
				this.executeScriptCallbacks(scriptId);
			};

			// Set up error handler
			tag.onerror = (error) => {
				console.error(`Failed to load script: ${scriptId}`, error);
				scriptState.loading = false;
				scriptState.loaded = true;
				resolve();
			};

			// Insert script into DOM
			const firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
		});
	}

	/**
	 * Execute all callbacks registered for a script
	 *
	 * @param string scriptId Unique identifier for the script
	 */
	private executeScriptCallbacks(scriptId: string): void {
		const scriptState = UtilityVideoShared.scriptStates[scriptId];
		if (!scriptState) return;

		// Mark as loaded
		scriptState.loading = false;
		scriptState.loaded = true;

		// Execute all callbacks
		while (scriptState.callbacks.length > 0) {
			const callback = scriptState.callbacks.shift();

			if (callback) {
				try {
					callback();
				} catch (error) {
					console.error(`Error executing callback for ${scriptId}`, error);
				}
			}
		}
	}

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
