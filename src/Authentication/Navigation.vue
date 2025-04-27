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
					<img class="filter-invert" src="~@chalkysticks/sass/build/asset/image/icon/user-logged-out.svg" />
				</picture>
			</button>
		</section>

		<!-- When we're logged in -->
		<section class="logged-in">
			<button class="plain no-hover" v-on:click="Handle_OnClickUserMenu">
				<UserAvatar
					v-bind:key="store.getters['authentication/user'].uniqueKey"
					v-bind:size="size"
					v-bind:userModel="store.getters['authentication/user']"
				/>
			</button>

			<svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
				<ellipse cx="7.07572" cy="7.44" rx="6.92429" ry="7.2" fill="#2B3544" />
				<path
					d="M6.75004 9.57296L4.67439 7.10633C4.42954 6.81537 4.62826 6.36 5.00008 6.36H9.15139C9.52321 6.36 9.72193 6.81536 9.47708 7.10633L7.40143 9.57296C7.22901 9.77786 6.92246 9.77786 6.75004 9.57296Z"
					fill="#CCCCCC"
				/>
			</svg>
		</section>

		<!-- Helpers -->
		<section class="utility">
			<UtilityModal ref="authModal" v-bind:class="{ 'd-none': !shouldShowLogin }">
				<AuthenticationAuthPanel
					class="type-modal"
					ref="authPanel"
					v-bind:authModel="authModel"
					v-bind:includeBasic="includeBasic"
					v-bind:includeSocial="includeSocial"
					v-on="$listeners"
				/>
			</UtilityModal>

			<UtilityModal ref="settingsModal" v-bind:class="{ 'd-none': !shouldShowSettings }">
				<UserMenu class="type-modal" ref="settingsPanel" v-bind:authModel="authModel" v-on:click:close="hideSettings" v-on="$listeners" />
			</UtilityModal>
		</section>
	</div>
</template>

<script lang="ts">
	import AuthenticationAuthPanel from './AuthPanel.vue';
	import ChalkySticks from '@chalkysticks/sdk';
	import UserAvatar from '../User/Avatar.vue';
	import UtilityModal from '../Utility/Modal.vue';
	import UserMenu from '../User/Menu.vue';
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
			UserMenu,
			UtilityModal,
		},
	})
	export default class AuthenticationNavigation extends ViewBase {
		/**
		 * @return UtilityModal
		 */
		public get authModal(): UtilityModal {
			return this.$refs.authModal as UtilityModal;
		}

		/**
		 * @return AuthenticationAuthPanel
		 */
		public get authPanel(): AuthenticationAuthPanel {
			return this.$refs.authPanel as AuthenticationAuthPanel;
		}

		/**
		 * @return UtilityModal
		 */
		public get settingsModal(): UtilityModal {
			return this.$refs.settingsModal as UtilityModal;
		}

		/**
		 * @return UserMenu
		 */
		public get settingsPanel(): UserMenu {
			return this.$refs.settingsPanel as UserMenu;
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
		public shouldShowLogin: boolean = false;

		/**
		 * @return boolean
		 */
		public shouldShowSettings: boolean = false;

		/**
		 * Whether or not to include basic login form
		 *
		 * @type boolean
		 */
		@Prop({
			default: true,
		})
		public includeBasic!: boolean;

		/**
		 * Whether or not to include social media buttons
		 *
		 * @type boolean
		 */
		@Prop({
			default: false,
		})
		public includeSocial!: boolean;

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
		 * @return Promise<void>
		 */
		public async hideLogin(): Promise<void> {
			this.authModal.animateOut();
			this.authPanel.animateOut();

			await ChalkySticks.Core.Utility.sleep(500);

			this.shouldShowLogin = false;
		}

		/**
		 * @return Promise<void>
		 */
		public async showLogin(): Promise<void> {
			// Toggle appearance of auth panel
			this.shouldShowLogin = true;

			// Animate
			this.authModal.animateInStart();
			this.authModal.animateIn();

			// Animate
			this.authPanel.animateInStart();
			this.authPanel.animateIn();
		}

		/**
		 * @return Promise<void>
		 */
		public async hideSettings(): Promise<void> {
			this.settingsModal.animateOut();
			this.settingsPanel.animateOut();

			await ChalkySticks.Core.Utility.sleep(500);

			this.shouldShowSettings = false;
		}

		/**
		 * @return Promise<void>
		 */
		public async showSettings(): Promise<void> {
			// Toggle appearance of auth panel
			this.shouldShowSettings = true;

			// Animate
			this.settingsModal.animateInStart();
			this.settingsModal.animateIn();

			// Animate
			this.settingsPanel.animateInStart();
			this.settingsPanel.animateIn();
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @param MouseEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickDocument(e: MouseEvent): Promise<void> {
			if (this.shouldShowSettings || this.shouldShowLogin) {
				e.preventDefault();

				this.hideLogin();
				this.hideSettings();
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
			this.showLogin();
		}

		/**
		 * @param MouseEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickUserMenu(e: MouseEvent): Promise<void> {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();

			// Animate
			this.showSettings();
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnLogin(): Promise<void> {
			this.$forceUpdate();

			// Hide the modal
			this.hideLogin();
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.authentication-navigation {
		.logged-in {
			display: none;

			button {
				font-size: 0;
			}
		}

		.logged-out {
			align-items: center;
			display: flex;
			justify-content: center;
			transform: scale(0.7);
		}

		.logged-in {
			align-items: center;
			display: flex;
			flex-direction: row;
			gap: 0.25em;

			> button {
				border: 4px solid var(--chalky-blue);
				border-radius: 50%;
			}
		}
	}

	// State
	// ---------------------------------------------------------------------

	.chalky.authentication-navigation {
		&.state-logged-in .logged-in {
			display: flex;
			transform: scale(1.125);
		}

		&.state-logged-in .logged-out {
			display: none;
		}
	}
</style>
