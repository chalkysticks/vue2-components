import * as VueGoogleMaps from 'vue2-google-maps';
import ChalkySticks from '@chalkysticks/sdk';
import Router from './Core/Router';

// Theme
// ---------------------------------------------------------------------------

import '@chalkysticks/sass/build/app.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './Theme/Main.scss';

// Components
// ---------------------------------------------------------------------------

import AuthenticationAuthPanel from './Authentication/AuthPanel.vue';
import AuthenticationBasicLogin from './Authentication/BasicLogin.vue';
import AuthenticationForgotPassword from './Authentication/ForgotPassword.vue';
import AuthenticationNavigation from './Authentication/Navigation.vue';
import AuthenticationResetPassword from './Authentication/ResetPassword.vue';
import AuthenticationSocialLogin from './Authentication/SocialLogin.vue';
import BrandingBadge from './Branding/Badge.vue';
import BrandingSplash from './Branding/Splash.vue';
import BrandingStandard from './Branding/Standard.vue';
import ButtonCancel from './Button/Cancel.vue';
import ButtonLogin from './Button/Login.vue';
import ButtonSignup from './Button/Signup.vue';
import CommentForm from './Comment/Form.vue';
import CommentItem from './Comment/Item.vue';
import CommentList from './Comment/List.vue';
import ContentItem from './Content/Item.vue';
import ContentList from './Content/List.vue';
import ContentVideoPlayer from './Content/VideoPlayer.vue';
import FactBanner from './Fact/Banner.vue';
import FactCard from './Fact/Card.vue';
import FeedCard from './Feed/Card.vue';
import FeedList from './Feed/List.vue';
import FormImageUploader from './Form/ImageUploader.vue';
import FormSearch from './Form/Search.vue';
import MediaCardSwipe from './Media/CardSwipe.vue';
import MediaFeed from './Media/Feed.vue';
import MediaUser from './Media/User.vue';
import MediaVenue from './Media/Venue.vue';
import ReactionButton from './Reaction/Button.vue';
import ReactionFavorite from './Reaction/Favorite.vue';
import ReactionList from './Reaction/List.vue';
import ReactionSummary from './Reaction/Summary.vue';
import TvAttributionBanner from './TV/AttributionBanner.vue';
import TvLiveList from './TV/LiveList.vue';
import TvLowerThird from './TV/LowerThird.vue';
import TvNowPlaying from './TV/NowPlaying.vue';
import TvSchedule from './TV/Schedule.vue';
import TvScheduleItem from './TV/ScheduleItem.vue';
import TvScheduleList from './TV/ScheduleList.vue';
import TvTimeline from './TV/Timeline.vue';
import TvVideoPreview from './TV/VideoPreview.vue';
import TvVideoTheater from './TV/VideoTheater.vue';
import UserAvatar from './User/Avatar.vue';
import UserCard from './User/Card.vue';
import UserList from './User/List.vue';
import UserMenu from './User/Menu.vue';
import UtilityAlertPrompt from './Utility/AlertPrompt.vue';
import UtilityDots from './Utility/Dots.vue';
import UtilityForceLandscape from './Utility/ForceLandscape.vue';
import UtilityGallery from './Utility/Gallery.vue';
import UtilityModal from './Utility/Modal.vue';
import UtilityPagination from './Utility/Pagination.vue';
import UtilityPortraitOverlay from './Utility/PortraitOverlay.vue';
import UtilityScrollToBegin from './Utility/ScrollToBegin.vue';
import UtilityVideoFacebook from './Utility/Video/Facebook.vue';
import UtilityVideoYouTube from './Utility/Video/YouTube.vue';
import VenueButtonCall from './Venue/Button/Call.vue';
import VenueButtonDirections from './Venue/Button/Directions.vue';
import VenueButtonWebsite from './Venue/Button/Website.vue';
import VenueCard from './Venue/Card.vue';
import VenueCheckins from './Venue/Checkins.vue';
import VenueGallery from './Venue/Gallery.vue';
import VenueHours from './Venue/Hours.vue';
import VenueList from './Venue/List.vue';
import VenueMap from './Venue/Map.vue';
import ViewBase from './Core/Base';
import WalletCollection from './Wallet/Collection.vue';
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
	ButtonCancel,
	ButtonLogin,
	ButtonSignup,
	CommentForm,
	CommentItem,
	CommentList,
	ContentItem,
	ContentList,
	ContentVideoPlayer,
	FactBanner,
	FactCard,
	FeedCard,
	FeedList,
	FormImageUploader,
	FormSearch,
	MediaCardSwipe,
	MediaFeed,
	MediaUser,
	MediaVenue,
	ReactionButton,
	ReactionFavorite,
	ReactionList,
	ReactionSummary,
	TvAttributionBanner,
	TvLiveList,
	TvLowerThird,
	TvNowPlaying,
	TvSchedule,
	TvScheduleItem,
	TvScheduleList,
	TvTimeline,
	TvVideoPreview,
	TvVideoTheater,
	UserAvatar,
	UserCard,
	UserList,
	UserMenu,
	UtilityAlertPrompt,
	UtilityDots,
	UtilityForceLandscape,
	UtilityGallery,
	UtilityModal,
	UtilityPagination,
	UtilityPortraitOverlay,
	UtilityScrollToBegin,
	UtilityVideoFacebook,
	UtilityVideoYouTube,
	VenueButtonCall,
	VenueButtonDirections,
	VenueButtonWebsite,
	VenueCard,
	VenueCheckins,
	VenueGallery,
	VenueHours,
	VenueList,
	VenueMap,
	WalletCollection,
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

		// Check for a $router was passed in
		if (options.provide?.router) {
			Router.router = options.provide?.router;
		}

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

		// Make our objects reactive to Vue
		ChalkySticks.Model.Base.useReactiveHook((instance) => {
			if (!instance.__isReactive) {
				// Vue.observable(instance);

				Vue.util.defineReactive(instance, 'uniqueKey', instance.uniqueKey);
				(instance as any).__isReactive = true;
			}
		});

		ChalkySticks.Collection.Base.useReactiveHook((instance) => {
			if (!instance.__isReactive) {
				// Vue.observable(instance);

				Vue.util.defineReactive(instance, 'uniqueKey', instance.uniqueKey);
				(instance as any).__isReactive = true;
			}
		});

		// Directives (like v-model, v-show)
		// ---------------------------------------------------------------------------

		// Pointer directive for custom pointer events (tap, drag, etc)
		/**
		 * Extends HTMLElement to allow _chalkyPointer property for pointer directive.
		 */
		interface ChalkyPointerHTMLElement extends HTMLElement {
			_chalkyPointer?: {
				on: (event: string, handler: (...args: any[]) => void) => void;
				off: (event: string, handler: (...args: any[]) => void) => void;
				destroy?: () => void;
				_listenerCount?: number;
			};
		}

		/**
		 * Type for the Vue directive binding object used in v-pointer.
		 */
		type PointerDirectiveBinding = {
			arg?: string;
			value: (...args: any[]) => void;
		};

		/**
		 * v-pointer directive: Attach ChalkySticks pointer events (tap, drag, etc) to an element.
		 *
		 * Supported events (see Pointer.ts):
		 *
		 *   - down
		 *   - move
		 *   - drag
		 *   - up
		 *   - tap
		 *   - doubletap
		 *   - hold
		 *   - twofingertap
		 *   - twofingerdoubletap
		 *   - swipe
		 *   - swipe:left
		 *   - swipe:right
		 *   - swipe:up
		 *   - swipe:down
		 *   - tap:small
		 *   - tap:xsmall
		 *   - zoom
		 *   - zoom:in
		 *   - zoom:out
		 *
		 * @param {ChalkyPointerHTMLElement} el - The element the directive is bound to
		 * @param {PointerDirectiveBinding} binding - Vue binding object
		 * @returns {void}
		 */
		Vue.directive('pointer', {
			/**
			 * Bind ChalkySticks pointer event listeners to the element.
			 *
			 * @param {ChalkyPointerHTMLElement} el - The element the directive is bound to
			 * @param {PointerDirectiveBinding} binding - Vue binding object
			 * @returns {void}
			 */
			bind(el: ChalkyPointerHTMLElement, binding: PointerDirectiveBinding): void {
				const eventType: string = binding.arg || 'tap';
				const handler = binding.value;
				if (typeof handler !== 'function') return;

				if (!el._chalkyPointer) {
					el._chalkyPointer = new ChalkySticks.Core.Input.Pointer('pointer', true, el);
					el._chalkyPointer._listenerCount = 0;
				}

				el._chalkyPointer.on(eventType, handler);
				el._chalkyPointer._listenerCount = (el._chalkyPointer._listenerCount || 0) + 1;
			},

			/**
			 * Unbind ChalkySticks pointer event listeners and destroy pointer if none remain.
			 *
			 * @param {ChalkyPointerHTMLElement} el - The element the directive is unbound from
			 * @param {PointerDirectiveBinding} binding - Vue binding object
			 * @returns {void}
			 */
			unbind(el: ChalkyPointerHTMLElement, binding: PointerDirectiveBinding): void {
				const eventType: string = binding.arg || 'tap';
				const handler = binding.value;

				if (el._chalkyPointer && typeof handler === 'function') {
					el._chalkyPointer.off(eventType, handler);
					el._chalkyPointer._listenerCount = (el._chalkyPointer._listenerCount || 1) - 1;

					if (el._chalkyPointer._listenerCount <= 0) {
						if (typeof el._chalkyPointer.destroy === 'function') {
							el._chalkyPointer.destroy();
						}
						delete el._chalkyPointer;
					}
				}
			},
		});

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
	ButtonCancel,
	ButtonLogin,
	ButtonSignup,
	CommentForm,
	CommentItem,
	CommentList,
	ContentItem,
	ContentList,
	ContentVideoPlayer,
	FactBanner,
	FactCard,
	FeedCard,
	FeedList,
	FormImageUploader,
	FormSearch,
	MediaCardSwipe,
	MediaFeed,
	MediaUser,
	MediaVenue,
	ReactionButton,
	ReactionFavorite,
	ReactionList,
	ReactionSummary,
	TvAttributionBanner,
	TvLiveList,
	TvLowerThird,
	TvNowPlaying,
	TvSchedule,
	TvScheduleItem,
	TvScheduleList,
	TvTimeline,
	TvVideoPreview,
	TvVideoTheater,
	UserAvatar,
	UserCard,
	UserList,
	UserMenu,
	UtilityAlertPrompt,
	UtilityDots,
	UtilityForceLandscape,
	UtilityGallery,
	UtilityPagination,
	UtilityPortraitOverlay,
	UtilityScrollToBegin,
	UtilityVideoFacebook,
	UtilityVideoYouTube,
	VenueButtonCall,
	VenueButtonDirections,
	VenueButtonWebsite,
	VenueCard,
	VenueCheckins,
	VenueGallery,
	VenueHours,
	VenueList,
	VenueMap,
	ViewBase,
	WalletCollection,
};

export default ChalkySticksVue;
