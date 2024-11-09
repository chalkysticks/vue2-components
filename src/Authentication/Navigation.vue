<template>
	<div class="chalky authentication-navigation" v-bind:class="{ 'state-logged-in': store.getters['authentication/authenticated'] }">
		<!-- When we're logged out (using buttons) -->
		<section class="logged-out" v-if="useButton">
			<button class="type-light" v-on:click="Handle_OnClickSignIn">
				<span>Sign In</span>
			</button>
		</section>

		<!-- When we're logged out (using avatar icon) -->
		<section class="logged-out" v-else>
			<button class="icon-only" v-on:click="Handle_OnClickSignIn">
				<picture class="avatar" v-bind:class="'size-' + size">
					<img src="~@chalkysticks/sass/build/asset/image/icon/user-logged-out.svg" />

					<!-- <img alt="User Avatar" v-bind:src="IconUserLoggedOut" /> -->
				</picture>
			</button>
		</section>

		<!-- When we're logged in -->
		<section class="logged-in">
			<button class="btn btn-plain no-hover">
				<UserAvatar size="lg" v-bind:userModel="store.getters['authentication/user']" />
			</button>
		</section>

		<!-- Helpers -->
		<section class="utility" v-bind:class="{ 'd-none': !showLogin }">
			<AuthenticationAuthPanel v-bind:authModel="authModel" class="type-modal" ref="authPanel" />
		</section>
	</div>
</template>

<script lang="ts">
	import AuthenticationAuthPanel from './AuthPanel.vue';
	import ChalkySticks from '@chalkysticks/sdk';
	import UserAvatar from '../User/Avatar.vue';
	import ViewBase from '../Core/Base';
	import { Component, Prop, Ref } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '../Utility/Decorators';

	/**
	 * @class AuthenticationNavigation
	 * @package Authentication
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({
		components: {
			AuthenticationAuthPanel,
			UserAvatar,
		},
	})
	export default class AuthenticationNavigation extends ViewBase {
		/**
		 * @return AuthenticationAuthPanel
		 */
		public get authPanel(): AuthenticationAuthPanel {
			return this.$refs.authPanel as AuthenticationAuthPanel;
		}

		/**
		 * @return Store
		 */
		public get store(): any {
			return ChalkySticks.Core.Provider.Store.get();
		}

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
		 * @return boolean
		 */
		public showLogin: boolean = false;

		/**
		 * @return string
		 */
		@Prop({ default: 'xs' })
		public size!: string;

		/**
		 * @return boolean
		 */
		@Prop({ default: false })
		public useButton!: boolean;

		/**
		 * @return void
		 */
		@mounted
		public attachEvents(): void {
			document.addEventListener('click', this.Handle_OnClickDocument);
			this.authModel.on('login', this.Handle_OnLogin);
		}

		/**
		 * @return void
		 */
		@beforeDestroy
		public detachEvents(): void {
			document.removeEventListener('click', this.Handle_OnClickDocument);
			this.authModel.off('login', this.Handle_OnLogin);
		}

		/**
		 * @return void
		 */
		public hide(): void {
			// Animate out
			this.authPanel.animateOut();

			// Hide login
			setTimeout(() => (this.showLogin = false), 500);
		}

		/**
		 * @return void
		 */
		public show(): void {
			// Toggle appearance of auth panel
			this.showLogin = true;

			// Animate
			this.authPanel.animateInStart();
			this.authPanel.animateIn();
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @param MouseEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickDocument(e: MouseEvent): Promise<void> {
			if (this.showLogin) {
				e.preventDefault();
				this.hide();
			}
		}

		/**
		 * @param MouseEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickSignIn(e: MouseEvent): Promise<void> {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();

			// Animate
			this.show();
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnLogin(): Promise<void> {
			this.$forceUpdate();

			// Hide the modal
			this.hide();
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.authentication-navigation {
		.logged-in {
			display: none;
		}

		// State
		// ---------------------------------------------------------------------

		&.state-logged-in .logged-in {
			display: block;
		}

		&.state-logged-in .logged-out {
			display: none;
		}
	}
</style>
