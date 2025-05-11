<template>
	<section
		class="chalky media-cardswipe"
		v-bind:class="{
			'state-loading': isLoading,
		}"
		v-bind:style="{
			'--dx': dx + 'px',
			'--dy': dy + 'px',
			'--ratio': ratio,
			'--ratioNormal': ratioNormal,
		}"
	>
		<slot></slot>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import gsap from 'gsap';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * All of this code sucks, but I just want it done for now.
	 *
	 * @author ChalkySticks LLC
	 * @package Media
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class MediaCardSwipe extends ViewBase {
		/**
		 * Tracks the current top card index
		 *
		 * @type number
		 */
		protected activeIndex: number = 0;

		/**
		 * @type number
		 */
		protected dx: number = 0;

		/**
		 * @type number
		 */
		protected dy: number = 0;

		/**
		 * @type ChalkySticks.Core.Input.Pointer
		 */
		protected globalPointer!: ChalkySticks.Core.Input.Pointer;

		/**
		 * @type boolean
		 */
		protected isLoading: boolean = true;

		/**
		 * @type ChalkySticks.Core.Input.Pointer
		 */
		protected pointer!: ChalkySticks.Core.Input.Pointer;

		/**
		 * @type number
		 */
		protected ratio: number = 0;

		/**
		 * @type number
		 */
		protected ratioNormal: number = 0;

		/**
		 * @return void
		 */
		@mounted
		public setupCards(): void {
			setTimeout(() => {
				this.isLoading = false;
				this.setOffsetZIndex();
			}, 1000);
		}

		/**
		 * @return void
		 */
		@mounted
		public attachEvents(): void {
			this.globalPointer = new ChalkySticks.Core.Input.Pointer('pointer', true);
			this.pointer = new ChalkySticks.Core.Input.Pointer('pointer', true, this.$el as HTMLElement);

			this.pointer.on('tap', this.Handle_OnTap.bind(this));
			this.pointer.on('drag', this.Handle_OnDrag.bind(this));
			this.globalPointer.on('up', this.Handle_OnDragRelease.bind(this));
		}

		/**
		 * @return void
		 */
		@beforeDestroy
		public detachEvents(): void {
			this.pointer.off('tap');
			this.pointer.off('drag');
			this.globalPointer.off('up');
		}

		/**
		 * Advances to the next card
		 * @return void
		 */
		protected next(direction: number = 0): void {
			this.$el.classList.add('state-transitioning');

			gsap.to(this, {
				duration: 0.5,
				dx: 200,
				ease: 'power2.out',
				onComplete: () => {
					this.$el.classList.remove('state-transitioning');
					this.activeIndex = (this.activeIndex + 1) % this.getCardCount();
					this.setOffsetZIndex(direction);

					this.dx = 0;
					this.dy = 0;
					this.ratio = 0;
					this.ratioNormal = 0;
				},
				ratio: direction,
				ratioNormal: 1,
			});
		}

		/**
		 * @return void
		 */
		protected reset(): void {
			gsap.to(this, {
				duration: 0.25,
				dx: 0,
				dy: 0,
				ease: 'power2.out',
				ratio: 0,
				ratioNormal: 0,
			});
		}

		/**
		 * @param number direction
		 * @return void
		 */
		protected setOffsetZIndex(direction: number = 0): void {
			const cards = Array.from(this.$el.children) as HTMLElement[];
			const len = cards.length;
			if (len === 0) return;

			// Get normalized indices with wrap-around
			const active = ((this.activeIndex % len) + len) % len;
			const prev = (active - 1 + len) % len;
			const next = (active + 1) % len;

			cards.forEach((card, i) => {
				// Clear and set states
				card.classList.remove('state-active', 'state-previous', 'state-next', 'direction-left', 'direction-right');

				if (i === active) card.classList.add('state-active');
				else if (i === prev) card.classList.add('state-previous');
				else if (i === next) card.classList.add('state-next', `direction-${this.ratio > 0 ? 'left' : 'right'}`);

				// Simple z-index: active highest, then prev/next, then others
				card.style.zIndex = i === active ? '4' : i === next ? '3' : i === prev ? '2' : '1';
			});
		}

		/**
		 * @return number
		 */
		private getCardCount(): number {
			return (this.$el as HTMLElement).children.length;
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnDrag(e: ChalkySticks.Core.IDispatcherEvent<any>): Promise<void> {
			this.dx = e.data.dx;
			this.dy = e.data.dy;
			this.ratio = Math.min(1, Math.abs(this.dx) / 100) * (this.dx < 0 ? -1 : 1);
			this.ratioNormal = Math.min(1, Math.abs(this.dx) / 100);
		}

		/**
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnDragRelease(e: ChalkySticks.Core.IDispatcherEvent<any>): Promise<void> {
			if (Math.abs(this.ratio) >= 0.85) {
				this.next(this.ratio);
			} else {
				this.reset();
			}
		}

		/**
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnTap(e: ChalkySticks.Core.IDispatcherEvent<any>): Promise<void> {
			this.$emit('tap', { index: this.activeIndex });
			this.$emit('select', { index: this.activeIndex });
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.media-cardswipe {
		--dx: 0;
		--dy: 0;
		--ratio: 0.5;

		display: grid;

		.media-feed {
			transition: opacity 0.3s ease-out;
		}

		> * {
			grid-column: 1;
			grid-row: 1;
			pointer-events: none;
			transform: scale(calc(0.8 + var(--ratioNormal) * 0.2));
		}

		&:not(.state-transitioning) {
			transition: transform 0.3s ease-out;
		}

		&:not(.state-transitioning) > .state-active {
			transform: rotate(calc(var(--ratio) * 10deg)) translateX(calc(var(--ratio) * 125px)) translateY(calc(var(--ratio) * -10px)) scale(1);
			will-change: transform;
		}
	}

	// State
	// ---------------------------------------------------------------------------

	.chalky.media-cardswipe.state-loading {
		background: url('~@chalkysticks/sass/build/asset/image/loader/triangle-white-light.svg') no-repeat center center;

		.media-feed {
			opacity: 0;
		}
	}

	// Animation
	// -------------------------------------------------------------------------

	.chalky.media-cardswipe.state-transitioning .state-active {
		animation: cardswipe 0.5s ease-in-out;
	}

	.chalky.media-cardswipe.state-transitioning .state-next {
		animation: cardswipe-bump 0.5s ease-in-out;
	}

	.chalky.media-cardswipe.state-transitioning .state-next.direction-left {
		//animation: cardswipe-left 0.5s ease-in-out;
	}

	.chalky.media-cardswipe.state-transitioning .state-next.direction-right {
		//animation: cardswipe-right 0.5s ease-in-out;
	}

	@keyframes cardswipe-bump {
		0% {
			transform: scale(1);
		}

		30% {
			transform: scale(1.033);
		}

		100% {
			transform: scale(1);
		}
	}

	@keyframes cardswipe {
		0% {
			transform: rotate(calc(var(--ratio) * 10deg)) translateX(calc(var(--ratio) * 125px)) translateY(calc(var(--ratio) * -10px)) scale(1);
			z-index: 200;
		}

		30% {
			transform: rotate(calc(var(--ratio) * 10deg)) translateX(calc(var(--ratio) * 300px)) translateY(calc(var(--ratio) * -10px)) scale(1);
			z-index: 0;
		}

		100% {
			transform: rotate(0deg) translateX(0px) translateY(0px) scale(0.9);
			z-index: 0;
		}
	}

	@keyframes cardswipe-left {
		0% {
			transform: rotate(0deg) translateX(0px) translateY(0px) scale(1);
		}

		30% {
			transform: rotate(-10deg) translateX(-150px) translateY(-10px) scale(1);
		}

		100% {
			transform: rotate(0deg) translateX(0px) translateY(0px) scale(1);
		}
	}

	@keyframes cardswipe-right {
		0% {
			transform: rotate(0deg) translateX(0px) translateY(0px) scale(1);
		}

		30% {
			transform: rotate(10deg) translateX(150px) translateY(-10px) scale(1);
		}

		100% {
			transform: rotate(0deg) translateX(0px) translateY(0px) scale(1);
		}
	}
</style>
