import Environment from './Environment';
import ColorConsole from 'colorconsole';
import gsap from 'gsap';
import { Component, Prop, Vue } from 'vue-property-decorator';

/**
 * @class Base
 * @package Core
 * @project ChalkySticks SDK Vue2.0 Components
 */
@Component({})
export default class ViewBase extends Vue {
	/**
	 * Reference to Window
	 */
	public static get window(): any {
		return window as any;
	}

	/**
	 * Global `env` variable
	 *
	 * @todo We need a better way of handling this global stuff.
	 * We should maybe make an Env class.
	 *
	 * @return {any}
	 */
	public get env(): any {
		return Environment;
	}

	/**
	 * Get name
	 *
	 * @return string
	 */
	public get name(): string {
		return this.constructor.name;
	}

	/**
	 * Parent of this element
	 *
	 * @return HTMLElement
	 */
	public get parentElement(): HTMLElement {
		return this.$el.parentNode as HTMLElement;
	}

	/**
	 * Return query params as an object
	 *
	 * @return {any}
	 */
	public get queryParams(): any {
		return Object.fromEntries(new URLSearchParams(location.search));
	}

	/**
	 * Determines if the element will animate at all
	 *
	 * @type boolean
	 */
	public allowAnimation: boolean = true;

	/**
	 * Delay until this animates in
	 *
	 * @type number
	 */
	public animateInDelay: number = 1;

	/**
	 * Whether this should animate automatically on mount
	 *
	 * @type boolean
	 */
	public autoAnimateIn: boolean = false;

	/**
	 * Basic animation speed, in seconds
	 *
	 * @type number
	 */
	public baseAnimationSpeed: number = 0.25;

	/**
	 * Function names to bind to class, typically used for event handlers
	 *
	 * Example:
	 *     ['Handle_OnEvent', 'Handle_On...']
	 *
	 * @type string[]
	 */
	public bindings: string[] = [];

	/**
	 * CID
	 *
	 * @type string
	 */
	public cid: string = '';

	/**
	 * List of debounced events
	 *
	 * @type {any}
	 */
	protected debouncedEvents: any = {};

	/**
	 * Options: none, fade
	 *
	 * @type number
	 */
	public defaultAnimation: string = 'fade';

	/**
	 * Reference to a custom animator, if we're using one
	 *
	 * @type any
	 */
	protected animator: any;

	/**
	 * Style object
	 *
	 * @type object
	 */
	protected style: any = {};

	/**
	 * Constructor
	 */
	constructor(params: any = {}) {
		super(params);

		// Cid
		this.cid = Math.random()
			.toString(32)
			.substr(2, 6);
	}

	/**
	 * When mounted to document
	 *
	 * @return void
	 */
	public mounted(): void {
		// Bind all functions and remove their references
		this.bindAll();

		// Attach events
		this.attachEvents();

		// Some views can automatically animate in
		if (this.allowAnimation && this.autoAnimateIn) {
			this.AnimateInStart();
			this.AnimateIn(() => {}, true);
		}

		// Update animator
		this.$nextTick(() => {
			if (this.animator) {
				this.animator.parent = this;
			}
		});
	}

	/**
	 * Detach events when destroying
	 */
	public beforeDestroy(): void {
		this.detachEvents();
	}

	/**
	 * Before update
	 *
	 * @return void
	 */
	public beforeUpdate(): void {
		// Not implemented
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
	 * Bind items
	 *
	 * @param  {...[type]} parameters: string[]    [description]
	 * @return void
	 */
	public bind(...parameters: string[]): void {
		const self: ViewBase = this as any;

		parameters.map((funcName) => {
			// @ts-ignore
			if (!self[funcName]) {
				console.warn('Attempting to bind ', funcName, ' which does not exist.');
			}
			else {
				// @ts-ignore
				self[funcName] = self[funcName].bind(self);
			}
		});
	}

	/**
	 * Bind all in our list. Called automatically by mounted()
	 *
	 * @return void
	 */
	public bindAll(): void {
		let i;

		while (this.bindings.length) {
			const funcName: string = this.bindings.pop() as string;

			ColorConsole.passive('Binding:', funcName);

			this.bind(funcName);
		}
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
		this.debouncedEvents[onWho][eventName] = {
			callback: callback,
			lastCall: 0,
			time: time,
		}

		// Event
		// @todo, if we already have event + onwho of type, cache
		onWho.addEventListener(eventName, this.Handle_OnDebouncedEvent);
	}

	/**
	 * Run a delayed function by name
	 *
	 * Example:
	 *     this.delayed('Hero_AnimateIn', 250);
	 *
	 * @param string funcName
	 * @param number = 1 delay
	 * @param boolean = true bind
	 * @return void
	 */
	public delayed(
		funcName: string,
		delay: number = 1,
		bind: boolean = true
	): void {
		const cls: any = this as any;
		const func: any = bind ? cls[funcName].bind(this) : cls[funcName];

		setTimeout(func, delay);
	}

	/**
	 * Test if the HTML element exists
	 *
	 * @return boolean
	 */
	public elementExists() {
		if (!this.$el || !this.$el.classList) {
			ColorConsole.warn(this.name, 'Element does not exist.');
			return false;
		}

		return true;
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
		(this.$el as HTMLElement).style.display = 'none';
	}

	/**
	 * Unhide this element
	 *
	 * @return void
	 */
	public unhide(): void {
		(this.$el as HTMLElement).style.display = '';
	}

	/**
	 * Fired before $forceUpdate + notloading()
	 *
	 * @return void
	 */
	public prerender(): void {
		// Intentionally left blank
	}

	/**
	 * Fired after $forceUpdate + children
	 *
	 * @return void
	 */
	public postrender(): void {
		// Intentionally left blank
	}

	/**
	 * Render display
	 *
	 * @param {boolean = true} includeChildren
	 * @return void
	 */
	public render(includeChildren: boolean = true): void {
		// // Check if mounted
		// if (!this.hasMounted) {
		//     console.warn('Attempting to render view that hasn\'t mounted', this.name, this);
		//     return;
		// }

		// Pre
		this.prerender();

		// Not loading
		// this.notloading();

		// Update self
		this.$forceUpdate();

		// Update children
		if (includeChildren) {
			(this.$refs as any).forEach((child: any) => {
				const view: ViewBase = child as ViewBase;

				if (view && view.render) {
					view.render(includeChildren);
				}
			});
		}
		else {
			ColorConsole.passive(
				'Rendering, but not children for: ' + this.name
			);
		}

		// Post
		this.postrender();
	}


	// region: State
	// ------------------------------------------------------------------------

	/**
	 * Check if has state
	 *
	 * @param  string type State to toggle
	 * @return boolean
	 */
	public hasState(type: string, namespace: string = 'state'): boolean {
		if (this.elementExists()) {
			return this.$el.classList.contains(namespace + '-' + type);
		}

		return false;
	}

	/**
	 * Set a state on a class for an element
	 * We use `namespace` as a prefix
	 *
	 * Example:
	 *     state-playing
	 *     state-ns-started
	 *
	 * If use `this.setState('icon', 'type'), we'll see:
	 *
	 *     type-icon
	 *
	 * @param string type State to add
	 * @param string namespace Prefix for this state
	 * @return void
	 */
	public setState(type: string, namespace: string = 'state'): void {
		if (this.elementExists()) {
			this.$el.classList.add(namespace + '-' + type);
		}
		else {
			ColorConsole.warn(
				'Could not set state `' + type + '` of ns `' + namespace + '`',
				this.$el
			);
		}
	}

	/**
	 * Set just one state
	 *
	 * @param string type State to add
	 * @param string namespace Prefix for this state
	 * @return void
	 */
	public setOnlyState(type: string, namespace: string = 'state'): void {
		this.unsetAllStates(namespace);
		this.setState(type, namespace);
	}

	/**
	 * Toggle state class
	 *
	 * @param string type State to toggle
	 * @param string namespace Prefix for this state
	 * @return boolean If we have state after toggle
	 */
	public toggleState(type: string, namespace: string = 'state'): boolean {
		if (this.hasState(type, namespace)) {
			this.unsetState(type, namespace);
		}
		else {
			this.setState(type, namespace);
		}

		return this.hasState(type, namespace);
	}

	/**
	 * Remove specific state class
	 *
	 * @param string type State to remove
	 * @return void
	 */
	public unsetState(type: string, namespace: string = 'state'): void {
		if (this.elementExists()) {
			this.$el.classList.remove(namespace + '-' + type);
		}
	}

	/**
	 * Remove all classes based on a namespace
	 *
	 * @return void
	 */
	public unsetAllStates(namespace: string = 'state'): void {
		if (this.elementExists()) {
			const regex = new RegExp('\\b' + namespace + '-[a-zA-Z0-9-_]+\\b', 'g');
			this.$el.className = this.$el.className.replace(regex, '');
		}
	}

	// endregion: State


	// region: Events
	// ------------------------------------------------------------------------

	/**
	 * Dispatch new event
	 *
	 * @param string eventName
	 * @param object args
	 * @return void
	 */
	 public dispatch(eventName: string, detail: any = null): void {
		eventName = this.cid + ':' + eventName;
		const event: CustomEvent = new CustomEvent(eventName, { detail });
		window.dispatchEvent(event);
	}

	/**
	 * Disable event listener
	 *
	 * @param string eventName
	 * @param fuction handler
	 * @return void
	 */
	public off(eventName: string, handler: any = null): void {
		// return this.$off(eventName, handler);
		eventName = this.cid + ':' + eventName;
		window.removeEventListener(eventName, handler);
	}

	/**
	 * Enable event listener
	 *
	 * @param string eventName
	 * @param fuction handler
	 * @return void
	 */
	public on(eventName: string, handler: any): void {
		// return this.$on(eventName, handler);
		eventName = this.cid + ':' + eventName;
		window.addEventListener(eventName, handler);
	}

	/**
	 * Alias for dispatch
	 *
	 * @param string eventName
	 * @param object args
	 * @return void
	 */
	public trigger(eventName: string, args: any = null): void {
		this.dispatch(eventName, args);
	}

	// endregion: Events


	// region: Event Handlers
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	protected Handle_OnAnimatedIn(): void {
		//
	}

	/**
	 * @param Event e
	 * @return void
	 */
	protected  Handle_OnDebouncedEvent(e: Event): void {
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
	// ------------------------------------------------------------------------

	/**
	 * Animation state before Animating In
	 *
	 * This should always be run no matter what, and then AnimateIn can dictate
	 * whether or not it wants to transition or set the opacity value.
	 *
	 * @return void
	 */
	 public AnimateInStart(): void {
		if (!this.allowAnimation) {
			return;
		}

		if (this.animator) {
			// Do nothing
		}
		else {
			// Set starting state BEFORE AnimateOut
			gsap.set(this.$el, {
				opacity: 0.0,
			});
		}
	}

	/**
	 * Animate In
	 *
	 * @param {()      => void}  callback [description]
	 * @param {boolean =  false} reset    [description]
	 * @return void
	 */
	public AnimateIn(callback: () => void, reset: boolean = false): void {
		if (reset) {
			this.AnimateInStart();
		}

		if (!this.allowAnimation) {
			callback();
			return;
		}

		// Prioritize custom animator
		if (this.animator) {
			return this.animator.AnimateIn(callback);
		}
		else {
			// Animate in
			gsap.to(this.$el, this.baseAnimationSpeed, {
				onComplete: () => {
					callback();
				},
				opacity: 1.0,
			});
		}
	}

	/**
	 * State before Animating Out
	 *
	 * @return void
	 */
	public AnimateOutStart(): void {
		if (!this.allowAnimation) {
			return;
		}

		if (this.animator) {
			// Do nothing
		}
		else {
			// Set starting state BEFORE AnimateOut
			gsap.set(this.$el, {
				opacity: 1.0,
			});
		}
	}

	/**
	 * Animate Out
	 *
	 * @param {()      => void}  callback [description]
	 * @param {boolean =  false} reset    [description]
	 * @return void
	 */
	public AnimateOut(callback: () => void, reset: boolean = false): void {
		if (reset) {
			this.AnimateOutStart();
		}

		if (!this.allowAnimation) {
			callback();
			return;
		}

		// Prioritize custom animator
		if (this.animator) {
			return this.animator.AnimateOut(callback);
		}
		else {
			gsap.to(this.$el, this.baseAnimationSpeed, {
				onComplete: () => {
					callback();
				},
				opacity: 0.0,
			});
		}
	}

	// endregion: Animation
}
