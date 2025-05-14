<template>
	<div
		class="chalky authentication-basicsignup"
		v-bind:class="{
			'state-loading': this.authModel.loading,
			'state-signup-failed': this.signupFailed,
			'state-signup-success': this.authModel.isLoggedIn(),
		}"
	>
		<form v-on:submit="Handle_OnSubmitSignup">
			<fieldset>
				<legend>Sign up</legend>

				<label>
					<h6>Name</h6>
					<input
						autocomplete="name"
						minlength="6"
						name="name"
						placeholder="John Doe"
						type="text"
						v-model="fullName"
						v-on:keydown="Handle_OnKeydownInput"
					/>
				</label>

				<label>
					<h6>Email Address</h6>
					<input
						autocomplete="email"
						minlength="8"
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
						placeholder="Password"
						type="password"
						v-model="password"
						v-on:keydown="Handle_OnKeydownInput"
					/>
				</label>

				<label class="clearfix">
					<input
						autocomplete="current-password"
						minlength="6"
						name="confirm-password"
						placeholder="Confirm Password"
						type="password"
						v-model="passwordConfirmation"
						v-on:keydown="Handle_OnKeydownInput"
					/>
				</label>

				<div class="action-container">
					<div class="alert alert-success" v-if="this.authModel.isLoggedIn()">
						<i class="fa fa-check-circle"></i>
						&nbsp;
						<span>Welcome {{ this.authModel.user.getName() }}</span>
					</div>

					<ButtonSignup v-else-if="!this.signupFailed" />

					<ButtonCancel class="push-top" v-on:click.native="Handle_OnClickBack" />

					<div class="alert alert-danger" v-if="this.signupFailed">
						<i class="fa fa-exclamation-triangle"></i>
						&nbsp;
						<span>{{ message }}</span>
					</div>
				</div>
			</fieldset>
		</form>
	</div>
</template>

<script lang="ts">
	import ButtonCancel from '../Button/Cancel.vue';
	import ButtonSignup from '../Button/Signup.vue';
	import ChalkySticks from '@chalkysticks/sdk';
	import Store from '../Store';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '../Utility/Decorators';

	/**
	 * @class AuthenticationBasicSignup
	 * @package Authentication
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({
		components: {
			ButtonCancel,
			ButtonSignup,
		},
	})
	export default class AuthenticationBasicSignup extends ViewBase {
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
		public email: string = '';

		/**
		 * @type string
		 */
		public fullName: string = '';

		/**
		 * @type boolean
		 */
		public signupFailed: boolean = false;

		/**
		 * @type string
		 */
		public message: string = '';

		/**
		 * @type string
		 */
		public password: string = '';

		/**
		 * @type string
		 */
		public passwordConfirmation: string = '';

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
		 * Signup via email
		 *
		 * @return Promise<ChalkySticks.Model.User>
		 */
		public async signup(): Promise<ChalkySticks.Model.User> {
			// Reset signup failure
			this.signupFailed = false;

			// Attempt signup
			try {
				return await this.authModel.signup({
					email: this.email,
					name: this.fullName,
					password: this.password,
					password_confirmation: this.passwordConfirmation,
				});
			} catch (e) {
				this.$emit('error');
			}

			return new ChalkySticks.Model.User();
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickBack(e: PointerEvent): Promise<void> {
			e.preventDefault();

			this.$emit('login-click');
		}

		/**
		 * @param KeyboardEvent e
		 * @return void
		 */
		protected Handle_OnKeydownInput(e: KeyboardEvent): void {
			this.signupFailed = false;
			this.message = '';
		}

		/**
		 * @return void
		 */
		protected Handle_OnFailure(e: any): void {
			this.message = e.detail?.error?.message || 'The action could not be completed.';
			this.signupFailed = true;
			this.$emit('error');

			setTimeout(() => {
				this.signupFailed = false;
			}, 1000 * 2.5);

			this.$forceUpdate();
		}

		/**
		 * @param SubmitEvent e
		 * @return void
		 */
		protected Handle_OnSubmitSignup(e: SubmitEvent): void {
			e.preventDefault();

			this.signup();
		}

		/**
		 * @return void
		 */
		protected Handle_OnSuccess(): void {
			this.$emit('signup', this.authModel.user);
			this.$emit('success', this.authModel.user);

			this.$forceUpdate();
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.authentication-basicsignup {
		margin: 0 auto;
		max-width: 500px;
		transition: opacity 0.15s ease-in-out;

		.back-button {
			cursor: pointer;
			left: 1rem;
			position: absolute;
			top: 1rem;
			transition: opacity 0.15s ease-in-out;

			i {
				color: var(--chalky-white);
				font-size: 1.25rem;
			}

			&:hover {
				opacity: 0.75;
			}
		}

		.action-container {
			text-align: center;
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

		&.state-signup-success {
			label {
				opacity: 0.75;
				pointer-events: none;
			}
		}
	}
</style>
