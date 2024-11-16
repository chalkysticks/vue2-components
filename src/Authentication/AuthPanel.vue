<template>
	<div class="chalky authentication-authpanel shadow xl" v-on:click="Handle_OnClick">
		<header class="text-center">
			<BrandingBadge size="md" mode="dark" />
		</header>

		<section class="login-container">
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

		background: var(--chalky-blue);
		border-radius: var(--border-radius-inner);
		color: var(--chalky-blue);
		display: flex;
		flex-direction: row;
		margin: 0 auto;
		outline: 1px solid var(--chalky-grey-4);
		position: relative;
		width: calc(var(--chalky-authpanel-graphic-width) + var(--chalky-authpanel-content-width));
		z-index: var(--z-modal-mid);

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
				opacity: 0.75;
				position: absolute;
				top: 0;
				width: 100%;
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

		.chalky.authentication-basiclogin button {
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
				height: 200px;
				width: 100%;
			}

			.login-container {
				padding: 1rem;
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
