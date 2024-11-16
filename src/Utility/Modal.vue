<template>
	<section class="chalky utility-modal">
		<div class="dark-panel"></div>

		<slot></slot>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import gsap from 'gsap';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * @author ChalkySticks LLC
	 * @package Utility
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class UtilityModal extends ViewBase {
		// region: Animation
		// ---------------------------------------------------------------------------

		/**
		 * @return void
		 */
		public animateInStart(): void {
			gsap.set(this.$el, {
				backgroundColor: 'rgba(0, 0, 0, 0)',
			});
		}

		/**
		 * @return void
		 */
		public animateIn(): void {
			gsap.to(this.$el, 0.25, {
				backgroundColor: 'rgba(0, 0, 0, 0.75)',
			});
		}

		/**
		 * @return void
		 */
		public animateOut(): void {
			gsap.to(this.$el, 0.25, {
				backgroundColor: 'rgba(0, 0, 0, 0)',
			});
		}

		// endregion: Animation
	}
</script>

<style lang="scss">
	.utility-modal {
		height: 100dvh;
		left: 0;
		position: fixed;
		top: 0;
		width: 100dvw;
		z-index: var(--z-modal-bottom);

		> * {
			z-index: var(--z-modal-mid);
		}
	}
</style>
