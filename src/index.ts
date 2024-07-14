// Theme
// ---------------------------------------------------------------------------

import '@chalkysticks/sass/build/app.css';
import '@fortawesome/fontawesome-free/css/all.css';

// Components
// ---------------------------------------------------------------------------

import AuthenticationAuthPanel from './Authentication/AuthPanel.vue';
import AuthenticationForgotPassword from './Authentication/ForgotPassword.vue';
import AuthenticationBasicLogin from './Authentication/BasicLogin.vue';
import AuthenticationNavigation from './Authentication/Navigation.vue';
import AuthenticationResetPassword from './Authentication/ResetPassword.vue';
import AuthenticationSocialLogin from './Authentication/SocialLogin.vue';
import BrandingBadge from './Branding/Badge.vue';
import BrandingStandard from './Branding/Standard.vue';
import ButtonLogin from './Button/Login.vue';
import TvVideoTheater from './TV/VideoTheater.vue';
import VenueCard from './Venue/Card.vue';
import VenueList from './Venue/List.vue';
import VenueMap from './Venue/Map.vue';
import ViewBase from './Core/Base';

const ChalkySticks = {
	/**
	 * Install ChalkySticks Vue2
	 */
	install: (Vue: any, options: any) => {
		// Provide an API through Vue’s provide/inject API
		Vue.prototype.$chalky = {
			log: () => console.log('ChalkySticks v3', options),
			options: options,
		};

		// Directives (like v-model, v-show)
		// @see https://v3.vuejs.org/guide/custom-directive.html#intro

		// Provide components
		const components = {
			AuthenticationAuthPanel,
			AuthenticationBasicLogin,
			AuthenticationForgotPassword,
			AuthenticationNavigation,
			AuthenticationResetPassword,
			AuthenticationSocialLogin,
			BrandingBadge,
			BrandingStandard,
			ButtonLogin,
			TvVideoTheater,
			VenueCard,
			VenueList,
			VenueMap,
		};

		Object.keys(components).forEach((name) => {
			Vue.component(`Chalky${name}`, components[name]);
		});
	},
};

// Export individual components for selective importing
export {
	AuthenticationAuthPanel,
	AuthenticationForgotPassword,
	AuthenticationBasicLogin,
	AuthenticationNavigation,
	AuthenticationResetPassword,
	AuthenticationSocialLogin,
	BrandingBadge,
	BrandingStandard,
	ButtonLogin,
	TvVideoTheater,
	VenueCard,
	VenueList,
	VenueMap,
	ViewBase,
};

export default ChalkySticks;
