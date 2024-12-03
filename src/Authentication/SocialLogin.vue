<template>
	<div class="chalky authentication-sociallogin">
		<form name="social-login">
			<fieldset>
				<button class="btn-social type-google button-secondary" v-on:click="Handle_OnClickLoginWithGoogle">
					<span>Login with Google</span>
				</button>

				<button class="btn-social type-facebook button-secondary" v-on:click="Handle_OnClickLoginWithFacebook">
					<span>Login with Facebook</span>
				</button>
			</fieldset>
		</form>
	</div>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * @class AuthenticationSocialLogin
	 * @package Authentication
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class AuthenticationSocialLogin extends ViewBase {
		/**
		 * Key to store the token on
		 *
		 * @type string
		 */
		public static storageKey: string = 'chalky.auth.token';

		/**
		 * Token passed back from the server
		 *
		 * @type string
		 */
		public static token: string = '';

		/**
		 * @type ChalkySticks/Model/Authentication
		 */
		@Prop({
			default: () =>
				ChalkySticks.Factory.Authentication.model({
					baseUrl: ChalkySticks.Core.Constants.API_URL_V3,
				}),
		})
		public authModel!: ChalkySticks.Model.Authentication;

		/**
		 * @type string
		 */
		@Prop({
			default: () => location.href,
		})
		public redirectTo!: string;

		// region: Event Handlers
		// ---------------------------------------------------------------------

		/**
		 * @type MouseEvent e
		 */
		protected Handle_OnClickLoginWithFacebook(e: MouseEvent): void {
			e.preventDefault();

			this.authModel.loginWithFacebook(this.redirectTo);
		}

		/**
		 * @type MouseEvent e
		 */
		protected Handle_OnClickLoginWithGoogle(e: MouseEvent): void {
			e.preventDefault();

			this.authModel.loginWithGoogle(this.redirectTo);
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.authentication-sociallogin {
		margin: 0 auto;
		max-width: 500px;

		button {
			display: block;
			margin: 1rem 0;
			width: 100%;
		}
	}
</style>
