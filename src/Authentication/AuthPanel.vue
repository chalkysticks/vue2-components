<template>
	<div class="chalky authentication-authpanel" v-on:click="Handle_OnClick">
		<header class="text-center">
			<BrandingBadge size="lg" mode="light" />
		</header>

		<section>
			<AuthenticationBasicLogin v-bind:authModel="authModel" v-if="includeBasic" />
			<hr v-if="includeBasic && includeSocial" />
			<AuthenticationSocialLogin v-bind:authModel="authModel" v-if="includeSocial" />
		</section>
	</div>
</template>

<script lang="ts">
	import AuthenticationBasicLogin from './BasicLogin.vue';
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
			AuthenticationSocialLogin,
			BrandingBadge,
			BrandingStandard,
		},
	})
	class AuthenticationAuthPanel extends ViewBase {
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

		background: linear-gradient(#fdfdfd, #f9f9f9);
		border-radius: 6px;
		box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.02), 0 6.7px 5.3px rgba(0, 0, 0, 0.028), 0 12.5px 10px rgba(0, 0, 0, 0.035),
			0 22.3px 17.9px rgba(0, 0, 0, 0.042), 0 41.8px 33.4px rgba(0, 0, 0, 0.05), 0 100px 80px rgba(0, 0, 0, 0.07);
		color: var(--chalky-blue);
		margin: 0 auto;
		padding: 1rem var(--chalky-authpanel-padding) var(--chalky-authpanel-padding) var(--chalky-authpanel-padding);
		position: relative;
		outline: 5px solid rgba(255, 255, 255, 0.15);
		padding-left: calc(var(--chalky-authpanel-graphic-width) + var(--chalky-authpanel-padding));
		width: calc(var(--chalky-authpanel-graphic-width) + var(--chalky-authpanel-content-width));

		&:before {
			background: url('@/Assets/image/graphic/sf-00.png') center center / cover no-repeat;
			content: ' ';
			height: 100%;
			left: 0;
			position: absolute;
			top: 0;
			width: var(--chalky-authpanel-graphic-width);
		}

		> header {
			.chalky.branding-badge {
				background-color: transparent;
			}
		}

		hr {
			border-top: 1px solid #ccc;
			background: transparent;
			height: 1px;
			margin: 1.5rem 0 !important;
		}

		.chalky.authentication-basiclogin button {
			width: 100%;
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
		transform: translate(-50%, -50%);
		z-index: 999;
	}
</style>
