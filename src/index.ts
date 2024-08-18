import * as VueGoogleMaps from 'vue2-google-maps';
import ChalkySticks from '@chalkysticks/sdk';

// Theme
// ---------------------------------------------------------------------------

import '@chalkysticks/sass/build/app.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './Theme/Main.scss';

// Components
// ---------------------------------------------------------------------------

import AuthenticationAuthPanel from './Authentication/AuthPanel.vue';
import AuthenticationForgotPassword from './Authentication/ForgotPassword.vue';
import AuthenticationBasicLogin from './Authentication/BasicLogin.vue';
import AuthenticationNavigation from './Authentication/Navigation.vue';
import AuthenticationResetPassword from './Authentication/ResetPassword.vue';
import AuthenticationSocialLogin from './Authentication/SocialLogin.vue';
import BrandingBadge from './Branding/Badge.vue';
import BrandingSplash from './Branding/Splash.vue';
import BrandingStandard from './Branding/Standard.vue';
import ButtonLogin from './Button/Login.vue';
import TvLowerThird from './TV/LowerThird.vue';
import TvNowPlaying from './TV/NowPlaying.vue';
import TvSchedule from './TV/Schedule.vue';
import TvScheduleItem from './TV/ScheduleItem.vue';
import TvScheduleList from './TV/ScheduleList.vue';
import TvTimeline from './TV/Timeline.vue';
import TvVideoTheater from './TV/VideoTheater.vue';
import VenueCard from './Venue/Card.vue';
import VenueList from './Venue/List.vue';
import VenueMap from './Venue/Map.vue';
import ViewBase from './Core/Base';
import Store from './Store';

const components = {
	AuthenticationAuthPanel,
	AuthenticationBasicLogin,
	AuthenticationForgotPassword,
	AuthenticationNavigation,
	AuthenticationResetPassword,
	AuthenticationSocialLogin,
	BrandingBadge,
	BrandingSplash,
	BrandingStandard,
	ButtonLogin,
	TvLowerThird,
	TvNowPlaying,
	TvSchedule,
	TvScheduleItem,
	TvScheduleList,
	TvTimeline,
	TvVideoTheater,
	VenueCard,
	VenueList,
	VenueMap,
};

const ChalkySticksVue = {
	/**
	 * Install ChalkySticks Vue2
	 */
	install: (Vue: any, options: IVueInstallationOptions = {}) => {
		// Provide an API through Vue’s provide/inject API
		Vue.prototype.$chalky = {
			log: () => console.log('ChalkySticks v3', options),
			options: options,
		};

		// Provide a Vuex store to ChalkySticks
		ChalkySticks.Core.Provider.Store.register(options.provide?.store || Store);

		// Configure ChalkySticks (I don't think this works yet)
		if (options.sdk) {
			ChalkySticks.Core.ChalkySticks.configure(options.sdk || {});
		}

		// Configure Google Maps
		Vue.use(VueGoogleMaps, {
			load: {
				key: options.google?.maps?.api_key,
				libraries: 'places',
			},
		});

		// Directives (like v-model, v-show)
		// @see https://v3.vuejs.org/guide/custom-directive.html#intro

		Object.keys(components).forEach((name) => {
			const component = components[name as keyof typeof components];
			Vue.component(`Chalky${name}`, component);
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
	BrandingSplash,
	BrandingStandard,
	ButtonLogin,
	TvLowerThird,
	TvNowPlaying,
	TvSchedule,
	TvScheduleItem,
	TvScheduleList,
	TvTimeline,
	TvVideoTheater,
	VenueCard,
	VenueList,
	VenueMap,
	ViewBase,
};

export default ChalkySticksVue;
