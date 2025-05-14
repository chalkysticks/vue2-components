<template>
	<div class="chalky authentication-authpanel shadow xl" v-on:click="Handle_OnClick">
		<header class="text-center">
			<BrandingBadge size="md" mode="dark" />
		</header>

		<section class="login-container">
			<AuthenticationBasicLogin
				v-bind:allowForgotPassword="allowForgotPassword"
				v-bind:authModel="authModel"
				v-if="includeBasic && !showSignup"
				v-on:error="$emit('error', $event)"
				v-on:login="$emit('login', $event)"
				v-on:success="$emit('success', $event)"
			/>

			<AuthenticationBasicSignup
				v-bind:authModel="authModel"
				v-if="includeBasic && showSignup"
				v-on:error="$emit('error', $event)"
				v-on:login-click="showSignup = false"
				v-on:signup="$emit('signup', $event)"
				v-on:success="$emit('success', $event)"
			/>

			<hr v-if="includeBasic && includeSocial && !showSignup" />

			<AuthenticationSocialLogin v-if="includeSocial && !showSignup" v-bind:authModel="authModel" />

			<AuthenticationSignupCTA
				v-bind:allowSignup="allowSignup"
				v-if="includeBasic && allowSignup && !showSignup"
				v-on:signup-click="showSignup = true"
			/>
		</section>
	</div>
</template>

<script lang="ts">
	import AuthenticationBasicLogin from './BasicLogin.vue';
	import AuthenticationBasicSignup from './BasicSignup.vue';
	import AuthenticationSignupCTA from './SignupCTA.vue';
	import AuthenticationSocialLogin from './SocialLogin.vue';
	import BrandingBadge from '../Branding/Badge.vue';
	import BrandingStandard from '../Branding/Standard.vue';
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import gsap from 'gsap';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * @class AuthenticationAuthPanel
	 * @package Authentication
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({
		components: {
			AuthenticationBasicLogin,
			AuthenticationBasicSignup,
			AuthenticationSignupCTA,
			AuthenticationSocialLogin,
			BrandingBadge,
			BrandingStandard,
		},
	})
	class AuthenticationAuthPanel extends ViewBase {
		/**
		 * Whether or not to allow signup
		 *
		 * @type boolean
		 */
		@Prop({ default: true })
		public allowForgotPassword!: boolean;

		/**
		 * Whether or not to allow signup
		 *
		 * @type boolean
		 */
		@Prop({ default: true })
		public allowSignup!: boolean;

		/**
		 * @type ChalkySticks/Model/Authentication
		 */
		@Prop({
			default: () =>
				new ChalkySticks.Model.Authentication(undefined, {
					baseUrl: ChalkySticks.Core.Constants.API_URL_V1,
				}),
		})
		public authModel!: ChalkySticks.Model.Authentication;

		/**
		 * Whether or not to include basic login form
		 *
		 * @type boolean
		 */
		@Prop({
			default: true,
		})
		public includeBasic!: boolean;

		/**
		 * Whether or not to include social media buttons
		 *
		 * @type boolean
		 */
		@Prop({
			default: false,
		})
		public includeSocial!: boolean;

		/**
		 * Whether to show signup form instead of login
		 *
		 * @type boolean
		 */
		protected showSignup: boolean = false;

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @param MouseEvent e
		 * @return void
		 */
		protected Handle_OnClick(e: MouseEvent): void {
			e.stopPropagation();
			e.stopImmediatePropagation();
		}

		// endregion: Event Handlers

		// region: Animation
		// ---------------------------------------------------------------------------

		/**
		 * @return void
		 */
		public animateInStart(): void {
			gsap.set(this.$el, {
				opacity: 0.0,
				scale: 0.95,
			});
		}

		/**
		 * @return void
		 */
		public animateIn(): void {
			gsap.to(this.$el, 0.25, {
				opacity: 1.0,
				scale: 1.0,
			});
		}

		/**
		 * @return void
		 */
		public animateOut(): void {
			gsap.to(this.$el, 0.25, {
				opacity: 0.0,
				scale: 0.95,
			});
		}

		// endregion: Animation
	}

	export default AuthenticationAuthPanel;
</script>

<style lang="scss">
	.chalky.authentication-authpanel {
		--chalky-authpanel-content-width: 400px;
		--chalky-authpanel-padding: 2rem;
		--chalky-authpanel-graphic-width: 400px;

		background: var(--chalky-blue);
		border-radius: var(--border-radius-inner);
		color: var(--chalky-blue);
		display: flex;
		flex-direction: row;
		margin: 0 auto;
		max-height: 90svh;
		outline: 1px solid var(--chalky-grey-4);
		position: relative;
		width: calc(var(--chalky-authpanel-graphic-width) + var(--chalky-authpanel-content-width));

		header {
			align-items: center;
			background: url('../Assets/image/graphic/sf-00.png') center center / cover no-repeat;
			border-top-right-radius: var(--border-radius-inner);
			border-top-left-radius: var(--border-radius-inner);
			content: ' ';
			display: flex;
			justify-content: center;
			overflow: hidden;
			position: relative;
			width: var(--chalky-authpanel-graphic-width);

			&::before {
				background-color: var(--chalky-blue);
				content: ' ';
				height: 100%;
				left: 0;
				opacity: 0.15;
				position: absolute;
				top: 0;
				width: 100%;
			}

			.branding-badge {
				transform: scale(0.85);
			}
		}

		.login-container {
			flex: 1;
			padding: 2rem;
		}

		hr {
			border-top: 1px solid #ccc;
			background: transparent;
			height: 1px;
			margin: 1.5rem 0 !important;
		}

		.chalky.authentication-basiclogin button,
		.chalky.authentication-basicsignup button {
			width: 100%;
		}
	}

	// Media Queries
	// ---------------------------------------------------------------------------

	@media only screen and (orientation: portrait) {
		.chalky.authentication-authpanel {
			flex-direction: column;
			width: 90%;

			header {
				border-bottom-left-radius: 0;
				border-bottom-right-radius: 0;
				height: 160px;
				width: 100%;
			}

			.login-container {
				padding: 1rem;

				.authentication-basiclogin,
				.authentication-basicsignup {
					margin-top: -1rem;
				}
			}
		}
	}

	// State
	// ---------------------------------------------------------------------------

	.chalky.authentication-authpanel.state-disabled {
		input,
		button {
			opacity: 0.5;
			transition: opacity 0.5s ease-in-out;
			pointer-events: none;
		}
	}

	.chalky.authentication-authpanel.type-modal {
		left: 50%;
		position: fixed;
		top: 50%;
		transform: translate(-50%, -50%) !important;
		z-index: 999;
	}
</style>
