<template>
	<section class="chalky user-menu-password">
		<header class="header-base">
			<button class="control theme-dark size-medium type-left" v-on:click="$emit('click:back')">Back</button>

			<h3>Password</h3>

			<div class="actions">
				<button class="control theme-dark round size-medium type-close" v-on:click="$emit('click:close')"></button>
			</div>
		</header>

		<form id="userMenuPassword" class="padded">
			<fieldset>
				<label>
					<h6>Current Password</h6>
					<input autocomplete="current-password" type="password" placeholder="Enter current password" />
				</label>

				<label>
					<h6>New Password</h6>
					<input autocomplete="new-password" type="password" placeholder="Enter new password" />
				</label>

				<label>
					<h6>Confirm Password</h6>
					<input autocomplete="new-password" type="password" placeholder="Confirm new password" />
					<small class="type-message">Passwords must match.</small>
				</label>
			</fieldset>

			<fieldset class="actions">
				<button class="button-primary size-medium" type="submit">Save</button>
				<br />
				<br />
				<button class="button-secondary size-small" type="reset">Reset</button>
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
	}
</script>

<style lang="scss">
	.chalky.user-menu-password {
		header {
			margin: 0 -2rem 1rem -2rem;
			width: auto;
		}

		.actions {
			text-align: center;
		}
	}
</style>
