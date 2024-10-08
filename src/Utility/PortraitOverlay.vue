<template>
	<section class="chalky portraitoverlay">
		<header>
			<ChalkyBrandingBadge size="lg" />
		</header>

		<section>
			<p>
				<strong>
					<slot>ChalkySticks Pad</slot>
				</strong>
				is designed to be used in landscape mode. Please tilt your phone.
			</p>

			<p v-if="env.IS_SAFARI">For iPhone users, it's recommended you tap the Share button below and select "Add to Home Screen".</p>

			<p v-else>We also recommend you use Fullscreen Mode and pin this app to your homescreen.</p>
		</section>

		<footer v-if="!env.IS_SAFARI">
			<button class="button-primary" v-on:click="Handle_OnClickPinApp">Pin to Home</button>
		</footer>
	</section>
</template>

<script lang="ts">
	import Base from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from './Decorators';

	/**
	 * @author Matt Kenefick <matt@chalkysticks.com>
	 * @package Utility
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class UtilityPortraitOverlay extends Base {
		/**
		 * @type BeforeInstallPromptEvent | null
		 */
		private deferredPrompt: BeforeInstallPromptEvent | null = null;

		/**
		 * @type boolean
		 */
		private isInstallable = false;

		/**
		 * @return void
		 */
		@mounted
		public attachEvents(): void {
			window.addEventListener('beforeinstallprompt', this.Handle_OnBeforeInstallPrompt);
		}

		/**
		 * @return void
		 */
		@beforeDestroy
		public detachEvents(): void {
			window.removeEventListener('beforeinstallprompt', this.Handle_OnBeforeInstallPrompt);
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @param Event e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickPinApp(e: Event): Promise<void> {
			if (this.deferredPrompt) {
				this.deferredPrompt.prompt();

				const { outcome } = await this.deferredPrompt.userChoice;

				if (outcome === 'accepted') {
					console.log('User accepted the install prompt');
				} else {
					console.log('User dismissed the install prompt');
				}

				this.deferredPrompt = null;
				this.isInstallable = false;
			}
		}

		/**
		 * @param Event e
		 * @return Promise<void>
		 */
		protected async Handle_OnBeforeInstallPrompt(e: Event): Promise<void> {
			e.preventDefault();

			this.deferredPrompt = e as BeforeInstallPromptEvent;
			this.isInstallable = true;
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	@import '../Theme/App/Mixins.scss';

	.chalky.portraitoverlay {
		background: var(--chalky-blue-4);
		padding: 2rem;
		text-align: center;
		z-index: var(--chalky-utilityscreen-zindex);

		header,
		footer {
			margin: 2rem 0;
		}

		p {
			margin: 1rem auto;
			max-width: 350px;
		}
	}

	// Media Queries
	// ---------------------------------------------------------------------------

	@include media-query('mobile-landscape') {
		.chalky.portraitoverlay {
			display: none;
		}
	}

	// State
	// ---------------------------------------------------------------------------

	@include media-query('mobile-portrait') {
		.chalky.portraitoverlay.state-active {
			display: block;
			height: 100vh;
			left: 0;
			position: fixed;
			top: 0;
			width: 100vw;
		}
	}
</style>
