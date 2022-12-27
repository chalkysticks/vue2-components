<template>
	<div class="chalky authentication-navigation">
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
			<AuthenticationAuthPanel class="type-modal" ref="authPanel" />
		</section>
	</div>
</template>

<script lang="ts">
	import ViewBase from '../Core/Base';
	import Environment from '../Core/Environment';
	import AuthenticationAuthPanel from './AuthPanel.vue';
	import { CollectionSchedule, ModelSchedule } from '@chalkysticks/sdk-tv';
	import { Component, Prop, Ref } from 'vue-property-decorator';

	@Component({
		components: {
			AuthenticationAuthPanel,
		},
	})
	export default class AuthenticationNavigation extends ViewBase {
		/**
		 * Reference to AuthPanel
		 *
		 * @type AuthenticationAuthPanel
		 */
		public get authPanel(): AuthenticationAuthPanel {
			return this.$refs.authPanel as AuthenticationAuthPanel;
		}

		/**
		 * Show login modal
		 *
		 * @return boolean
		 */
		public showLogin: boolean = false;

		/**
		 * Attach events
		 *
		 * @return void
		 */
		public attachEvents(): void {
			document.addEventListener('click', this.Handle_OnClickDocument);
		}

		/**
		 * Detach events
		 *
		 * @return void
		 */
		public detachEvents(): void {
			document.removeEventListener('click', this.Handle_OnClickDocument);
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @param MouseEvent e
		 * @return void
		 */
		protected Handle_OnClickDocument(e: MouseEvent): void {
			e.preventDefault();

			if (this.showLogin) {
				this.authPanel.animateOut();

				setTimeout(() => (this.showLogin = false), 500);
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

			// Toggle appearance of auth panel
			this.showLogin = true;

			// Animate
			this.authPanel.animateInStart();
			this.authPanel.animateIn();
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.authentication-navigation {
	}
</style>
