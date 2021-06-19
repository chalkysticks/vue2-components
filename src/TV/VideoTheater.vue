<template>
    <div class="chalky tv-videotheater ratio ratio-16x9">
        <div :id="playerId"></div>
    </div>
</template>

<script lang="ts">
    import ViewBase from '../Core/Base';
    import Environment from '../Core/Environment';
    import { CollectionSchedule, ModelSchedule } from '@chalkysticks/sdk-tv';
    import { Options } from 'vue-class-component';

    @Options({})
    export default class TvVideoTheater extends ViewBase {
        /**
         * Reference to YouTube
         *
         * @return any
         */
        public get YT(): any {
            return ViewBase.window.YT;
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
        public autoplay: boolean = true;

        /**
         * Function names to bind to class, typically used for event handlers
         *
         * Example:
         *     ['Handle_OnEvent', 'Handle_On...']
         *
         * @type string[]
         */
        public bindings: string[] = [
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
         * @type boolean
         */
        public mute: boolean = false;

        /**
         * Random player ID
         *
         * @type string
         */
        public playerId: string = Math.random().toString(16).substr(2, 8);

        /**
         * Get URL
         *
         * @type string
         */
        public url: string = '';

        /**
         * List of calls to make after YT loads
         *
         * @type []
         */
        protected deferredCalls: any = [];

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

        // region: Actions
        // ---------------------------------------------------------------------------

        /**
         * Create player
         *
         * @return void
         */
        public createPlayer(code: string, time: number = 0) {
            // Defer call
            if (!this.YT || !this.YT.Player) {
                this.deferredCalls.push([code, time]);
                return;
            }

            // Create player
            this.api = new this.YT.Player(this.playerId, {
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

        protected Handle_OnPlayerStateChange(e: any): void {
            let state = e.data;

            // if (e.data == YT.PlayerState.PLAYING && !done) {
            //     setTimeout(stopVideo, 6000);
            //     done = true;
            // }
        }

        protected Handle_OnPlayerReady(e: any): void {
            e.target.playVideo();

            // console.log('Duration', this.api.getDuration());
            // console.log('Current Time', this.api.getCurrentTime());
            // console.log('URL', this.api.getVideoUrl());
        }

        protected Handle_OnYouTubeReady(): void {
            if (this.deferredCalls.length) {
                let [code, time] = this.deferredCalls.pop();
                this.createPlayer(code, time);
            }
        }

        // endregion: Event Handlers


        // region: Helpers
        // ---------------------------------------------------------------------------

        protected embedScript(): void {
            // Check if we need it
            var tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";

            var firstScriptTag = document.getElementsByTagName('script')[0];
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