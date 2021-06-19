import { Options, Vue } from 'vue-class-component';

@Options({})
export default class Base extends Vue {
    /**
     * Delay until this animates in
     *
     * @type number
     */
    protected animateInDelay: number = 1;

    /**
     * Whether this should animate automatically on mount
     *
     * @type boolean
     */
    protected animates: boolean = false;

    /**
     * List of debounced events
     *
     * @type {any}
     */
    protected debouncedEvents: any = {};

    /**
     * Style object
     *
     * @type object
     */
    protected style: any = {};

    /**
     * Attach events when mounted
     */
    public mounted(): void {
        this.attachEvents();

        this.animateInStart();

        this.animates && setTimeout(() => {
            this.animateIn();
        }, this.animateInDelay);
    }

    /**
     * Detach events when destroying
     */
    public beforeDestroy(): void {
        this.detachEvents();
    }

    /**
     * Attach events
     *
     * @return void
     */
    public attachEvents(): void {
        // Not implemented
    }

    /**
     * Detach events
     *
     * @return void
     */
    public detachEvents(): void {
        // Not implemented
    }

    /**
     * Reattach events
     *
     * @return void
     */
    public reattachEvents(delay: number = 1): void {
        this.detachEvents();
        setTimeout(() => this.attachEvents(), delay);
    }

    /**
     * Attach event via debounce
     *
     * @param any onWho
     * @param string eventName
     * @param function callback
     * @param number time
     */
    public debounceEvent(onWho: any, eventName: string, callback: any, time: number = 100) {
        this.debouncedEvents[onWho] = this.debouncedEvents[onWho] || {};

        // Add event
        this.debouncedEvents[onWho][eventName] = { callback, time, lastCall: 0 }

        // Event
        // @todo, if we already have event + onwho of type, cache
        onWho.addEventListener(eventName, this.Handle_OnDebouncedEvent);
    }

    /**
     * Detach event via debounce
     */
    public undebounceEvent(onWho: any, eventName: string, callback: any) {
        delete this.debouncedEvents[onWho][eventName];

        onWho.addEventListener(event, this.Handle_OnDebouncedEvent);
    }

    /**
     * Hide this element
     *
     * @return void
     */
    public hide(): void {
        this.$el.style.display = 'none';
    }

    /**
     * Unhide this element
     *
     * @return void
     */
    public unhide(): void {
        this.$el.style.display = null;
    }


    // region: Event Handlers
    // -------------------------------------------------------------------------

    private Handle_OnDebouncedEvent(e: Event): void {
        let i;

        for (i in this.debouncedEvents) {
            const de = this.debouncedEvents[i][e.type];
            const now = Date.now();

            if (de.lastCall + de.time < now) {
                de.lastCall = now;
                de.callback(e);
            }
        }
    }

    // endregion: Event Handlers


    // region: Animation
    // ---------------------------------------------------------------------------

    /**
     * Initial position for animation
     *
     * @return void
     */
    public animateInStart(): void {
        // Not implemented
    }

    /**
     * Animate in action
     *
     * @return void
     */
    public animateIn(): void {
        // Not implemented
    }

    /**
     * Animate out action
     *
     * @return void
     */
    public animateOut(): void {
        // Not implemented
    }

    // endregion: Animation
}
