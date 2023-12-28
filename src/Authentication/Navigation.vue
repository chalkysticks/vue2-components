<template>
	<div class="chalky authentication-navigation" :class="{ 'state-logged-in': authModel.isLoggedIn() }">
		<!-- When we're logged out -->
		<section class="logged-out">
			<button class="type-light" v-on:click="Handle_OnClickSignIn">
				<span>Sign In</span>
			</button>
		</section>

		<!-- When we're logged in -->
		<section class="logged-in">
			<button class="btn btn-plain no-hover" style="overflow: visible">
				<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
					12
				</span>
				<i class="fa fa-bell"></i>
			</button>
			<button class="btn btn-plain no-hover">
				<img src="https://randomuser.me/api/portraits/men/85.jpg" class="rounded-circle" width="50" height="50" />
			</button>
		</section>

		<!-- Helpers -->
		<section class="utility" v-bind:class="{ 'd-none': !showLogin }">
			<AuthenticationAuthPanel :authModel="authModel" class="type-modal" ref="authPanel" />
		</section>
	</div>
</template>

<script lang="ts">
	import * as ChalkySticks from '@chalkysticks/sdk';
	import AuthenticationAuthPanel from './AuthPanel.vue';
	import Environment from '../Core/Environment';
	import ViewBase from '../Core/Base';
	import { Component, Prop, Ref } from 'vue-property-decorator';

	/**
	 * @class AuthenticationNavigation
	 * @package Authentication
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({
		components: {
			AuthenticationAuthPanel,
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
		 * @type ChalkySticks/Model/Authentication
		 */
		@Prop({
			default: () => new ChalkySticks.Model.Authentication(undefined, {
				baseUrl: ChalkySticks.Core.Constants.API_URL_V1,
			})
		})
		public authModel!: typeof ChalkySticks.Model.Authentication;

		/**
		 * @return boolean
		 */
		public showLogin: boolean = false;

		/**
		 * @return void
		 */
		public attachEvents(): void {
			document.addEventListener('click', this.Handle_OnClickDocument);
			this.authModel.on('login:success', this.Handle_OnLogin);
		}

		/**
		 * @return void
		 */
		public detachEvents(): void {
			document.removeEventListener('click', this.Handle_OnClickDocument);
			this.authModel.off('login:success', this.Handle_OnLogin);
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
		 * @return void
		 */
		protected Handle_OnClickDocument(e: MouseEvent): void {
			if (this.showLogin) {
				e.preventDefault();

				this.hide();
			}
		}

		/**
		 * @param MouseEvent e
		 * @return void
		 */
		protected Handle_OnClickSignIn(e: MouseEvent): void {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();

			// Animate
			this.show();
		}

		/**
		 * @return void
		 */
		protected Handle_OnLogin(): void {
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
