/**
 * Determine if we can use haptics on this device
 *
 * @type boolean
 */
export const HAS_HAPTICS = 'vibrate' in navigator;

/**
 * Determine if we're on a local environment
 *
 * @type boolean
 */
export const IS_LOCAL = location.href.indexOf('://localhost') > -1 || location.href.indexOf('192.168') > -1;

/**
 * Determine if this is being accessed via mobile device
 *
 * @type boolean
 */
export const IS_MOBILE = 'ontouchstart' in window;

/**
 * Determine if we're on the production environment
 *
 * @type boolean
 */
export const IS_PRODUCTION = location.href.indexOf(process.env.VUE_APP_PRODUCTION_URL || 'example.com') > -1;

/**
 * Safari is a terrible browser with a lot of bugs
 *
 * @type boolean
 */
export const IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

/**
 * Determine if we're on the staging environment
 *
 * @type boolean
 */
export const IS_STAGING = location.href.indexOf(process.env.VUE_APP_STAGING_URL || 'vercel.com') > -1;
