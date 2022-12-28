<template>
	<div class="chalky authentication-authpanel" v-on:click="Handle_OnClick">
		<header class="text-center">
			<BrandingBadge size="md" />
		</header>

		<section>
			<AuthenticationBasicLogin :authModel="authModel" />
			<hr />
			<AuthenticationSocialLogin :authModel="authModel" />

			<div class="text-center">
				<a href="/forgot-password" title="Forgot Password">
					<span>Forgot Password?</span>
				</a>
			</div>
		</section>
	</div>
</template>

<script lang="ts">
	import AuthenticationBasicLogin from './BasicLogin.vue';
	import AuthenticationSocialLogin from './SocialLogin.vue';
	import BrandingBadge from '../Branding/Badge.vue';
	import BrandingStandard from '../Branding/Standard.vue';
	import ViewBase from '../Core/Base';
	import gsap from 'gsap';
	import { Constants, ModelAuthentication } from '@chalkysticks/sdk';
	import { Component, Prop } from 'vue-property-decorator';

	@Component({
		components: {
			AuthenticationBasicLogin,
			AuthenticationSocialLogin,
			BrandingBadge,
			BrandingStandard,
		},
	})
	export default class AuthenticationAuthPanel extends ViewBase {
		/**
		 * @type ChalkySticks/Model/Authentication
		 */
		@Prop({
			default: () => new ModelAuthentication(undefined, {
				baseUrl: Constants.API_URL_V1,
			})
		})
		public authModel!: ModelAuthentication;

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
		 * Initial position for animation
		 *
		 * @return void
		 */
		public animateInStart(): void {
			gsap.set(this.$el, {
				opacity: 0.0,
				scale: 0.95,
			});
		}

		/**
		 * Animate in action
		 *
		 * @return void
		 */
		public animateIn(): void {
			gsap.to(this.$el, 0.25, {
				opacity: 1.0,
				scale: 1.0,
			});
		}

		/**
		 * Animate out action
		 *
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
</script>

<style lang="scss">
	.chalky.authentication-authpanel {
		background: linear-gradient(#FDFDFD, #F9F9F9);
		border-radius: 6px;
		box-shadow:
			0 2.8px 2.2px rgba(0, 0, 0, 0.02),
			0 6.7px 5.3px rgba(0, 0, 0, 0.028),
			0 12.5px 10px rgba(0, 0, 0, 0.035),
			0 22.3px 17.9px rgba(0, 0, 0, 0.042),
			0 41.8px 33.4px rgba(0, 0, 0, 0.05),
			0 100px 80px rgba(0, 0, 0, 0.07)
		;
		margin: 0 auto;
		padding: 2rem 3rem 3rem 3rem;
		width: 480px;

		> header {
			.chalky.branding-badge {
				background-color: transparent;
			}
		}

		hr {
			margin: 0.5rem 0 !important;
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
