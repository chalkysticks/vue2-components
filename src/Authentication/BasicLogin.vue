<template>
	<div
		class="chalky authentication-basiclogin"
		v-bind:class="{
			'state-loading': this.authModel.loading,
			'state-login-failed': this.loginFailed,
			'state-login-success': this.authModel.isLoggedIn(),
		}"
	>
		<form v-on:submit="Handle_OnSubmit">
			<fieldset>
				<legend>Login</legend>

				<label>
					<h6>Email Address</h6>
					<input
						autocomplete="email"
						minlength="6"
						name="email"
						placeholder="john@example.com"
						type="email"
						v-model="email"
						v-on:keydown="Handle_OnKeydownInput"
					/>
				</label>

				<label>
					<h6>Password</h6>
					<input
						autocomplete="current-password"
						minlength="6"
						name="password"
						type="password"
						v-model="password"
						v-on:keydown="Handle_OnKeydownInput"
					/>
				</label>

				<p class="text-right pull-top-lg push-bottom-lg">
					<a class="type-small" href="/forgot-password" title="Forgot Password">
						<span>Forget password?</span>
					</a>
				</p>

				<div class="action-container">
					<div class="alert alert-success" v-if="this.authModel.isLoggedIn()">
						<i class="fa fa-check-circle"></i>
						&nbsp;
						<span>Welcome {{ this.authModel.user.getName() }}</span>
					</div>

					<ButtonLogin v-else-if="!this.loginFailed" />

					<div class="alert alert-danger" v-if="this.loginFailed">
						<i class="fa fa-exclamation-triangle"></i>
						&nbsp;
						<span>{{ message }}</span>
					</div>
				</div>
			</fieldset>

			<footer>
				<a href="/sign-up" title="Sign up">
					<span>Sign up.</span>
				</a>
			</footer>
		</form>
	</div>
</template>

<script lang="ts">
	import ButtonLogin from '../Button/Login.vue';
	import ChalkySticks from '@chalkysticks/sdk';
	import Store from '../Store';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '../Utility/Decorators';

	/**
	 * @class AuthenticationBasicLogin
	 * @package Authentication
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({
		components: {
			ButtonLogin,
		},
	})
	export default class AuthenticationBasicLogin extends ViewBase {
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
		 * @type string
		 */
		public email: string = '';

		/**
		 * @type boolean
		 */
		public loginFailed: boolean = false;

		/**
		 * @type string
		 */
		public message: string = '';

		/**
		 * @type string
		 */
		public password: string = '';

		/**
		 * @return void
		 */
		@mounted
		public attachEvents(): void {
			this.authModel.on('error', this.Handle_OnFailure);
			this.authModel.on('success', this.Handle_OnSuccess);
		}

		/**
		 * @return void
		 */
		@beforeDestroy
		public detachEvents(): void {
			this.authModel.off('error', this.Handle_OnFailure);
			this.authModel.off('success', this.Handle_OnSuccess);
		}

		/**
		 * Login via email
		 *
		 * @return Promise<ChalkySticks.Model.User>
		 */
		public async login(): Promise<ChalkySticks.Model.User> {
			// Reset login failure
			this.loginFailed = false;

			// Attempt login
			try {
				return await this.authModel.login(this.email, this.password);
			} catch (e) {
				// this.$emit('error');
			}

			return new ChalkySticks.Model.User();
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @param KeyboardEvent e
		 * @return void
		 */
		protected Handle_OnKeydownInput(e: KeyboardEvent): void {
			this.loginFailed = false;
			this.message = '';
		}

		/**
		 * @return void
		 */
		protected Handle_OnFailure(): void {
			this.message = 'Login attempt unsuccessful';
			this.loginFailed = true;
			this.$emit('error');

			setTimeout(() => {
				this.loginFailed = false;
			}, 1000 * 2);
		}

		/**
		 * @param SubmitEvent e
		 * @return void
		 */
		protected Handle_OnSubmit(e: SubmitEvent): void {
			e.preventDefault();

			this.login();
		}

		/**
		 * @return void
		 */
		protected Handle_OnSuccess(): void {
			this.$emit('login', this.authModel.user);
			this.$emit('success', this.authModel.user);
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.authentication-basiclogin {
		margin: 0 auto;
		max-width: 500px;
		transition: opacity 0.15s ease-in-out;

		.action-container {
			height: 50px;
			text-align: center;

			button {
				max-width: 175px;
			}
		}

		footer {
			margin-top: 1.5rem;
		}

		// State
		// ---------------------------------------------------------------------

		&.state-loading {
			opacity: 0.75;
			pointer-events: none;

			button {
				background-image: url("data:image/svg+xml,%0A%3Csvg version='1.1' id='L9' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 100 100' enable-background='new 0 0 0 0' xml:space='preserve'%3E%3Cpath fill='%23fff' d='M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50'%3E%3CanimateTransform attributeName='transform' attributeType='XML' type='rotate' dur='1s' from='0 50 50' to='360 50 50' repeatCount='indefinite' /%3E%3C/path%3E%3C/svg%3E");
				background-repeat: no-repeat;
				background-size: 30px;
				background-position: 0.5rem center;

				.icon {
					opacity: 0;
				}
			}
		}

		&.state-login-success {
			label {
				opacity: 0.75;
				pointer-events: none;
			}
		}
	}
</style>
