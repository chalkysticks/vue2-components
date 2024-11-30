<template>
	<section class="chalky user-menu shadow xl">
		<header>
			<UserAvatar size="sm" v-bind:userModel="store.getters['authentication/user']" />

			<section>
				<h5 class="username" v-bind:key="userId">{{ authModel.user.getName() }}</h5>
				<a class="edit-profile color-chalky-lightblue small" href="#">Edit Profile</a>
			</section>
		</header>

		<!-- This all still needs to be hooked up and stuff -->
		<!-- Probably break this into a new component -->
		<WalletCollection v-bind:userModel="store.getters['authentication/user']" />

		<nav>
			<ul>
				<li>
					<button v-on:click="$emit('click:profile')">
						<img class="icon filter-invert size-xx" src="~@chalkysticks/sass/build/asset/image/icon/user-profile.svg" />
						<span>Profile</span>
					</button>
				</li>
				<li>
					<button v-on:click="$emit('click:password')">
						<img class="icon filter-invert size-xx" src="~@chalkysticks/sass/build/asset/image/icon/password.svg" />
						<span>Password</span>
					</button>
				</li>
				<li>
					<button v-on:click="$emit('click:notifications')">
						<img class="icon filter-invert size-xx" src="~@chalkysticks/sass/build/asset/image/icon/notification.svg" />
						<span>Notifications</span>
					</button>
				</li>
				<li>
					<button v-on:click="$emit('click:billing')">
						<img class="icon filter-invert size-xx" src="~@chalkysticks/sass/build/asset/image/icon/billing.svg" />
						<span>Billing</span>
					</button>
				</li>
				<li>
					<button v-on:click="$emit('click:about')">
						<img class="icon filter-invert size-xx" src="~@chalkysticks/sass/build/asset/image/icon/chalkysticks.svg" />
						<span>About</span>
					</button>
				</li>
			</ul>
		</nav>

		<section class="action-container">
			<button class="button-secondary" v-on:click="$emit('click:logout')">Logout</button>
		</section>

		<footer>
			<a class="type-caps" href="https://www.chalkysticks.com/privacy-policy" target="_blank">Privacy Policy</a>
			<a class="type-caps" href="https://www.chalkysticks.com/terms-of-use" target="_blank">Terms of Service</a>
		</footer>
	</section>
</template>

<script lang="ts">
	import BrandingBadge from '../Branding/Badge.vue';
	import ChalkySticks from '@chalkysticks/sdk';
	import UserAvatar from '../User/Avatar.vue';
	import ViewBase from '../Core/Base';
	import WalletCollection from '../Wallet/Collection.vue';
	import gsap from 'gsap';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @todo this needs work. the avatar isn't rendering
	 *
	 * @author ChalkySticks LLC
	 * @package User
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({
		components: {
			BrandingBadge,
			UserAvatar,
			WalletCollection,
		},
	})
	export default class UserMenu extends ViewBase {
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
		 * @return Promise<void>
		 */
		protected async Handle_OnLogin(): Promise<void> {
			this.$forceUpdate();

			this.userId = this.authModel.user.id;
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
		outline: 1px solid var(--chalky-grey-4);
		padding: 0rem 2rem;
		position: relative;
		width: 90%;
		z-index: var(--z-modal-mid);

		ul li button {
			padding: 0.5rem 0;
			width: 100%;
		}

		header {
			align-items: center;
			display: grid;
			gap: 1rem;
			grid-template-columns: min-content 1fr;
			grid-template-rows: 1fr;
			padding: 1rem 0;

			.user-menu {
				grid-area: 1 / 1 / 2 / 2;
			}
			.user-menu + * {
				grid-area: 1 / 2 / 2 / 3;
			}
		}

		.wallet-collection {
			margin: 0 -1rem 1rem -1rem;
		}

		.action-container {
			margin-top: 2rem;
			text-align: center;
		}

		footer {
			align-items: center;
			display: flex;
			justify-content: space-evenly;
			padding: 1.5rem 0;
		}
	}

	// State
	// ---------------------------------------------------------------------------

	.chalky.user-menu.type-modal {
		left: 50%;
		position: fixed;
		top: 50%;
		transform: translate(-50%, -50%) !important;
		z-index: 999;
	}
</style>
