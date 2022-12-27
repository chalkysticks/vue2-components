// @ts-nocheck

// Theme
// ---------------------------------------------------------------------------

import '@chalkysticks/sass/dist/app.css';
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
import TvVideoTheater from './TV/VideoTheater.vue';
import ViewBase from './Core/Base';

export default {
	/**
	 * Install ChalkySticks Vue2
	 */
	install: (app: any, options: any) => {
		// @see https://v3.vuejs.org/api/application-config.html#warnhandler
		app.prototype.$chalky = () => {
			console.log('ChalkySticks v3', options);
		};

		// Directives (like v-model, v-show)
		// @see https://v3.vuejs.org/guide/custom-directive.html#intro

		// Provide components
		app.component('AuthenticationAuthPanel', AuthenticationAuthPanel);
		app.component('AuthenticationBasicLogin', AuthenticationBasicLogin);
		app.component('AuthenticationForgotPassword', AuthenticationForgotPassword);
		app.component('AuthenticationNavigation', AuthenticationNavigation);
		app.component('AuthenticationSocialLogin', AuthenticationSocialLogin);
		app.component('BrandingBadge', BrandingBadge);
		app.component('BrandingStandard', BrandingStandard);
		app.component('TvVideoTheater', TvVideoTheater);
	}
}

export { ViewBase }
