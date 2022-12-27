<template>
	<div class="chalky authentication-basiclogin">
		<form v-on:submit="Handle_OnSubmit">
			<fieldset>
				<legend>Login</legend>

				<label>
					<h3>Email Address</h3>
					<input
						minlength="6"
						name="email"
						placeholder="john@example.com"
						type="email"
						v-model="email"
						v-on:keydown="Handle_OnKeydownInput"
						/>
				</label>

				<label>
					<h3>Password</h3>
					<input
						minlength="6"
						name="password"
						type="password"
						v-model="password"
						v-on:keydown="Handle_OnKeydownInput"
						/>
				</label>

				<footer>
					<button name="btnLogin">
						<i class="fa fa-user"></i>
						<span>Login</span>
					</button>
				</footer>

				<div class="alert alert-danger" v-if="message">
					<i class="fa fa-exclamation-triangle"></i>
					&nbsp;
					<span>{{ message }}</span>
				</div>
			</fieldset>
		</form>
	</div>
</template>

<script lang="ts">
	import Environment from '../Core/Environment';
	import ViewBase from '../Core/Base';
	import { ModelAuthentication } from '@chalkysticks/sdk-authentication';
	import { Component, Prop } from 'vue-property-decorator';

	@Component
	export default class AuthenticationBasicLogin extends ViewBase {
		/**
		 * @type ChalkySticks/Model/Authentication
		 */
		public authModel: ModelAuthentication = new ModelAuthentication();

		/**
		 * @type string
		 */
		public email: string = '';

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
		public attachEvents(): void {
			this.authModel.on('error', this.Handle_OnFailure);
			this.authModel.on('success', this.Handle_OnSuccess);
		}

		/**
		 * @return void
		 */
		public detachEvents(): void {
			this.authModel.off('error', this.Handle_OnFailure);
			this.authModel.off('success', this.Handle_OnSuccess);
		}

		/**
		 * Login via email
		 *
		 * @return Promise<any>
		 */
		public login(): Promise<any> {
			return this.authModel.login(this.email, this.password);
		}


		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @param KeyboardEvent e
		 * @return void
		 */
		protected Handle_OnKeydownInput(e: KeyboardEvent): void {
			this.message = '';
		}

		/**
		 * @return void
		 */
		protected Handle_OnFailure(): void {
			this.message = 'Login attempt unsuccessful';
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
			console.log('success');
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.authentication-basiclogin {
		margin: 0 auto;
		max-width: 500px;

		button {
			margin-bottom: 1rem;
		}
	}
</style>
