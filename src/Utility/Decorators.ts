import { createDecorator } from 'vue-class-component';
import { WatchOptions } from 'vue';

// Helpers
// ---------------------------------------------------------------------------

/**
 * @param string methodName
 * @return Function
 */
function methodDecorator(methodName: string) {
	return createDecorator((options: any, key: number | string): void => {
		const original = options[methodName];
		const method = options.methods[key];

		options[methodName] = function () {
			original && original.call(this);
			method && method.call(this);
		};
	});
}

// Export
// ---------------------------------------------------------------------------

export const beforeCreate = methodDecorator('beforeCreate');
export const created = methodDecorator('created');
export const beforeDestroy = methodDecorator('beforeDestroy');
export const beforeMount = methodDecorator('beforeMount');
export const mounted = methodDecorator('mounted');
export const beforeUpdate = methodDecorator('beforeUpdate');
export const updated = methodDecorator('updated');
export const beforeUnmount = methodDecorator('beforeUnmount');
export const unmounted = methodDecorator('unmounted');
export const errorCaptured = methodDecorator('errorCaptured');
export const renderTracked = methodDecorator('renderTracked');
export const renderTriggered = methodDecorator('renderTriggered');
export const activated = methodDecorator('activated');
export const deactivated = methodDecorator('deactivated');
export const serverPrefetch = methodDecorator('serverPrefetch');

// Special
// ---------------------------------------------------------------------------

/**
 * decorator of a watch function
 * @param  path the path or the expression to observe
 * @param  watchOptions
 */
export const routeChange = (function () {
	const path: string = '$route';
	const watchOptions: WatchOptions = { immediate: true };

	return createDecorator((componentOptions, handler) => {
		componentOptions.watch ||= Object.create(null);
		const watch: any = componentOptions.watch;

		if (typeof watch[path] === 'object' && !Array.isArray(watch[path])) {
			watch[path] = [watch[path]];
		} else if (typeof watch[path] === 'undefined') {
			watch[path] = [];
		}

		watch[path].push({
			handler,
			...watchOptions,
		});
	});
})();

/**
 * It's setup this way specifically because if we override
 * the prototype method or something, we'll lose access to
 * any extended protected methods.
 *
 * An example would be that Event.Dispatcher would no longer
 * work if we bound an event listener.
 *
 * It will work with this approach.
 *
 * @param any target
 * @param string propertyKey
 * @param PropertyDescriptor descriptor
 * @return PropertyDescriptor
 */
export function bind(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
	const configurable: boolean = true;
	const enumerable: boolean = false;

	return {
		configurable,
		enumerable,

		/**
		 * @return object
		 */
		get() {
			const bound = descriptor.value.bind(this);

			Object.defineProperty(this, propertyKey, {
				configurable: true,
				value: bound,
				writable: true,
			});

			return bound;
		},
	};
}

/**
 * Create a decorator that will .trigger('event') on the
 * class.
 */
export function trigger(event: string, params: any = {}, triggerBefore: boolean = true) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		// @ts-ignore
		// descriptor.enumerable = event;
		const originalValue = descriptor.value;

		descriptor.value = function (...args: any[]) {
			// Before event
			if (triggerBefore) {
				// @ts-ignore
				this.trigger(event + ':before', params);
			}

			// Trigger original function
			originalValue.apply(this, args);

			// After event
			// @ts-ignore
			this.trigger(event, params);
		};
	};
}
