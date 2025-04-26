<template>
	<section class="chalky user-menu-profile">
		<header class="header-base">
			<button class="control theme-dark size-medium type-left" v-on:click="$emit('click:back')">Back</button>

			<h3>Profile</h3>

			<div class="actions">
				<button class="control theme-dark round size-medium type-close" v-on:click="$emit('click:close')"></button>
			</div>
		</header>

		<section id="userMenuProfilePhotoContainer">
			<UserAvatar size="lg" v-bind:userModel="store.getters['authentication/user']" />

			<div class="actions">
				<h3>Profile Photo</h3>

				<button class="button-primary size-small">Change</button>
				&nbsp;
				<button class="button-secondary size-small">Remove</button>
			</div>
		</section>

		<form id="userMenuProfile" class="padded" v-on:submit="Handle_OnFormSubmit">
			<fieldset>
				<label>
					<h6>Name</h6>

					<input type="text" placeholder="Enter name" v-model="store.getters['authentication/user'].attributes.name" />
				</label>

				<label>
					<h6>Email Address</h6>

					<input disabled type="email" placeholder="Enter email" v-model="store.getters['authentication/user'].attributes.email" />
					<small class="type-message">This field is cannot be changed.</small>
				</label>
			</fieldset>

			<figure v-if="isSaved" class="padded text-center">
				<img class="icon filter-invert" src="~@chalkysticks/sass/build/asset/image/icon/checkmark.svg" />
			</figure>

			<fieldset v-else class="actions">
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
	import UserAvatar from '../Avatar.vue';
	import ViewBase from '../../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package User/Menu
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({
		components: {
			UserAvatar,
		},
	})
	export default class UserMenuProfile extends ViewBase {
		/**
		 * @return Store
		 */
		public get store(): any {
			return ChalkySticks.Core.Provider.Store.get();
		}

		/**
		 * @type boolean
		 */
		protected isSaved: boolean = false;

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @param SubmitEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnFormSubmit(e: SubmitEvent): Promise<void> {
			e.preventDefault();

			const userModel = this.store.getters['authentication/user'];

			// Save to backend
			await userModel?.save();

			// Show save indicator for 2 seconds
			this.isSaved = true;
			setTimeout(() => (this.isSaved = false), 2000);
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.user-menu-profile {
		header {
			margin: 0 -2rem 1rem -2rem;
			width: auto;
		}

		#userMenuProfilePhotoContainer {
			align-items: center;
			display: flex;
			flex-direction: row;
			gap: 1rem;

			h3 {
				margin-bottom: 1rem;
			}

			.actions {
				text-align: left;
			}
		}

		.avatar {
			border-radius: 50%;
			border: 3px solid var(--chalky-white);
		}

		.actions {
			text-align: center;
		}
	}
</style>
