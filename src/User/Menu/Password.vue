<template>
	<section class="chalky user-menu-password">
		<header class="header-base">
			<button class="control theme-dark size-medium type-left" v-on:click="$emit('click:back')">Back</button>

			<h3>Password</h3>

			<div class="actions">
				<button class="control theme-dark round size-medium type-close" v-on:click="$emit('click:close')"></button>
			</div>
		</header>

		<form id="userMenuPassword" v-on:submit="Handle_OnSubmitForm">
			<fieldset>
				<label>
					<h6>Current Password</h6>
					<input autocomplete="current-password" placeholder="Enter current password" required type="password" v-model="password" />
				</label>

				<label>
					<h6>New Password</h6>
					<input
						autocomplete="new-password"
						minlength="8"
						placeholder="Enter new password"
						required
						type="password"
						v-model="newPassword"
					/>
				</label>

				<label>
					<h6>Confirm Password</h6>
					<input
						autocomplete="new-password"
						minlength="8"
						placeholder="Confirm new password"
						required
						type="password"
						v-model="newPasswordConfirmation"
					/>
					<small class="type-message">Passwords must match.</small>
				</label>
			</fieldset>

			<fieldset class="actions">
				<button class="button-primary size-medium" type="submit">Save</button>
			</fieldset>
		</form>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package User/Menu
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class UserMenuPassword extends ViewBase {
		/**
		 * @return Store
		 */
		public get store(): any {
			return ChalkySticks.Core.Provider.Store.get();
		}

		/**
		 * @return ChalkySticks.Model.User
		 */
		public get userModel(): ChalkySticks.Model.User {
			return this.store.getters['authentication/user'];
		}

		/**
		 * @return ChalkySticks.Model.Authentication
		 */
		protected authenticationModel: ChalkySticks.Model.Authentication = ChalkySticks.Factory.Authentication.model();

		/**
		 * @type string
		 */
		private password!: string;

		/**
		 * @type string
		 */
		private newPassword!: string;

		/**
		 * @type string
		 */
		private newPasswordConfirmation!: string;

		/**
		 * @return boolean
		 */
		protected newPasswordIsValid(): boolean {
			return this.authenticationModel.attributes.new_password === this.authenticationModel.attributes.new_password_confirmation;
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @param SubmitEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnSubmitForm(e: SubmitEvent): Promise<void> {
			e.preventDefault();

			// Temporary note to user
			if (!this.newPasswordIsValid()) {
				alert('Your new password and confirmation do not match.');
				return;
			}

			// Submit
			this.authenticationModel
				.changePassword(this.password, this.newPassword, this.newPasswordConfirmation)
				.then(() => {
					alert('Your password has been successfully updated.');
				})
				.catch((error: Error) => {
					alert('There was an error changing your password.');
				});
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.user-menu-password {
		header {
			margin: 0 -2rem 1rem -2rem;
			width: auto;
		}

		.actions {
			margin-bottom: 1rem;
			text-align: center;
		}
	}
</style>
