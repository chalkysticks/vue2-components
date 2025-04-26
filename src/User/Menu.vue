<template>
	<section class="chalky user-menu shadow xl" v-on:click="Handle_OnClick">
		<template v-if="!userId">
			<section class="text-center padded">
				<p class="push-bottom">If you are logged in, you must logout and login again.</p>

				<section>
					<button class="button-secondary" v-on:click="$emit('logout')">Logout</button>
				</section>
			</section>
		</template>

		<template v-else>
			<component
				v-bind:is="activeComponent"
				v-bind:authModel="authModel"
				v-bind:key="userId"
				v-on:click:about="Handle_OnClickView('about')"
				v-on:click:back="Handle_OnClickBack"
				v-on:click:close="Handle_OnClickClose"
				v-on:click:logout="Handle_OnClickLogout"
				v-on:click:notifications="Handle_OnClickView('notifications')"
				v-on:click:password="Handle_OnClickView('password')"
				v-on:click:profile="Handle_OnClickView('profile')"
			/>
		</template>
	</section>
</template>

<script lang="ts">
	import BrandingBadge from '../Branding/Badge.vue';
	import ChalkySticks from '@chalkysticks/sdk';
	import UserAvatar from './Avatar.vue';
	import UserMenuAbout from './Menu/About.vue';
	import UserMenuBilling from './Menu/Billing.vue';
	import UserMenuLanding from './Menu/Landing.vue';
	import UserMenuNotifications from './Menu/Notifications.vue';
	import UserMenuPassword from './Menu/Password.vue';
	import UserMenuProfile from './Menu/Profile.vue';
	import ViewBase from '../Core/Base';
	import gsap from 'gsap';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package User
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({
		components: {
			BrandingBadge,
			UserAvatar,
			UserMenuAbout,
			UserMenuBilling,
			UserMenuLanding,
			UserMenuNotifications,
			UserMenuPassword,
			UserMenuProfile,
		},
	})
	export default class UserMenu extends ViewBase {
		/**
		 * Get the active component based on the view
		 *
		 * @return any
		 */
		public get activeComponent(): any {
			const map: Record<string, any> = {
				about: UserMenuAbout,
				landing: UserMenuLanding,
				notifications: UserMenuNotifications,
				password: UserMenuPassword,
				profile: UserMenuProfile,
			};

			return map[this.activeView] || null;
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
			default: () => new ChalkySticks.Model.Authentication(),
		})
		public authModel!: ChalkySticks.Model.Authentication;

		/**
		 * @type string
		 */
		public userId: string = '';

		/**
		 * @type string
		 */
		public activeView: string = 'landing';

		/**
		 * @return void
		 */
		@mounted
		public attachEvents(): void {
			this.authModel.on('login', this.Handle_OnLogin);
		}

		/**
		 * @return void
		 */
		@beforeDestroy
		public detachEvents(): void {
			this.authModel.off('login', this.Handle_OnLogin);
		}

		// region: Animation
		// ---------------------------------------------------------------------------

		/**
		 * @return void
		 */
		public animateInStart(): void {
			gsap.set(this.$el, {
				opacity: 0.0,
				scale: 0.95,
			});
		}

		/**
		 * @return void
		 */
		public animateIn(): void {
			gsap.to(this.$el, 0.25, {
				opacity: 1.0,
				scale: 1.0,
			});
		}

		/**
		 * @return void
		 */
		public animateOut(): void {
			gsap.to(this.$el, 0.25, {
				opacity: 0.0,
				scale: 0.95,
			});
		}

		// endregion: Animation

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClick(e: PointerEvent): Promise<void> {
			// e.preventDefault();

			e.stopImmediatePropagation();
			e.stopPropagation();
		}

		/**
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickBack(e: PointerEvent): Promise<void> {
			this.activeView = 'landing';
		}

		/**
		 * Switch to specified view
		 *
		 * @param string view
		 * @return void
		 */
		public Handle_OnClickView(view: string): void {
			this.activeView = view;
		}

		/**
		 * Handle logout action
		 *
		 * @return Promise<void>
		 */
		public async Handle_OnClickLogout(): Promise<void> {
			// await this.authModel.logout();
			this.userId = '';
			this.$emit('logout');
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnLogin(): Promise<void> {
			this.$forceUpdate();

			this.userId = this.authModel.user.id;
			this.activeView = 'landing';
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.user-menu {
		--chalky-usermenu-content-width: 400px;
		--chalky-usermenu-graphic-width: 400px;

		background: var(--chalky-blue-4);
		border-radius: var(--border-radius-inner);
		color: var(--chalky-white);
		display: flex;
		flex-direction: column;
		margin: 0 auto;
		max-height: 75dvh;
		min-height: 50dvh;
		outline: 1px solid var(--chalky-grey-4);
		overflow: auto;
		padding: 0rem 2rem;
		position: relative;
		width: 90%;
		z-index: var(--z-modal-mid);
	}

	// State
	// ---------------------------------------------------------------------------

	.chalky.user-menu.type-modal {
		height: 100dvh;
		left: 50%;
		padding: 0 1rem;
		position: fixed;
		top: 50%;
		transform: translate(-50%, -50%) !important;
		z-index: 999;

		.chalky.user-menu-profile header {
			margin: 0;
		}
	}
</style>
