<template>
	<div class="chalky authentication-sociallogin">
		<form name="social-login">
			<fieldset>
				<legend>Login via Social</legend>

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
				new ChalkySticks.Model.Authentication(undefined, {
					baseUrl: ChalkySticks.Core.Constants.API_URL_V1,
				}),
		})
		public authModel!: ChalkySticks.Model.Authentication;

		/**
		 * Check for token and save it to the object
		 *
		 * @return void
		 */
		public mounted(): void {
			this.searchForToken();
		}

		/**
		 * Look at the URL bar for token
		 *
		 * @return string
		 */
		public searchForToken(): string {
			const url: URL = new URL(location.href);
			const token: string = url.searchParams.get('token') || '';
			const state: any = {};

			// Find token from URL
			if (token) {
				url.searchParams.delete('token');
				history.replaceState(state, '', url.href);
			}

			// Save to local storage
			localStorage.setItem(AuthenticationSocialLogin.storageKey, token);

			return (AuthenticationSocialLogin.token = token);
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------

		/**
		 * @type MouseEvent e
		 */
		protected Handle_OnClickLoginWithFacebook(e: MouseEvent): void {
			e.preventDefault();

			this.authModel.loginSocial('facebook');
		}

		/**
		 * @type MouseEvent e
		 */
		protected Handle_OnClickLoginWithGoogle(e: MouseEvent): void {
			e.preventDefault();

			this.authModel.loginSocial('google');
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
