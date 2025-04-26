<template>
	<section class="chalky user-menu-landing">
		<header class="header">
			<UserAvatar size="md" v-bind:userModel="store.getters['authentication/user']" />

			<section>
				<h3 class="username">{{ store.getters['authentication/user'].getName() }}</h3>
				<a class="edit-profile color-chalky-lightblue" v-on:click="$emit('click:profile')">Edit Profile</a>
			</section>

			<div class="actions">
				<button class="control theme-dark size-medium round type-close" v-on:click="$emit('click:close')"></button>
			</div>
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
				<!-- <li>
					<button v-on:click="$emit('click:notifications')">
						<img class="icon filter-invert size-xx" src="~@chalkysticks/sass/build/asset/image/icon/notification.svg" />
						<span>Notifications</span>
					</button>
				</li> -->
				<!-- <li>
					<button v-on:click="$emit('click:billing')">
						<img class="icon filter-invert size-xx" src="~@chalkysticks/sass/build/asset/image/icon/billing.svg" />
						<span>Billing</span>
					</button>
				</li> -->
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
	import ChalkySticks from '@chalkysticks/sdk';
	import UserAvatar from '../Avatar.vue';
	import ViewBase from '../../Core/Base';
	import WalletCollection from '../../Wallet/Collection.vue';
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
			WalletCollection,
		},
	})
	export default class UserMenuLanding extends ViewBase {
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
	}
</script>

<style lang="scss">
	.chalky.user-menu-landing {
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

			.user-avatar {
				border-radius: 50%;
				border: 3px solid var(--chalky-white);
			}

			.actions {
				position: absolute;
				right: 1rem;
				top: 1rem;
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
</style>
