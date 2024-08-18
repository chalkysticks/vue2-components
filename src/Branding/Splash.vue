<template>
	<section
		class="chalky branding-splash"
		v-bind:class="{
			fullscreen: fullscreen,
			fixed: fullscreen,
		}"
	>
		<div class="part part-1">
			<ChalkyBrandingBadge mode="deep" size="md" />
		</div>

		<div class="part part-2">
			<ChalkyBrandingBadge mode="dark" size="lg" />
		</div>

		<div class="part part-3">
			<ChalkyBrandingStandard class="no-icon" mode="dark" size="lg" />
		</div>
	</section>
</template>

<script lang="ts">
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package Branding
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class BrandingSplash extends ViewBase {
		/**
		 * @type boolean
		 */
		@Prop({ default: true })
		public autoAnimate!: boolean;

		/**
		 * @type boolean
		 */
		@Prop({ default: true })
		public fullscreen!: boolean;

		/**
		 * @return void
		 */
		public mounted(): void {
			setTimeout(() => {
				if (this.autoAnimate) {
					this.$el.classList.add('animate-in');
				}
			}, 1000);
		}
	}
</script>

<style lang="scss">
	.branding-splash {
		background-color: var(--chalky-blue-4);
		z-index: var(--z-top);

		.part {
			align-items: center;
			display: flex;
			height: 100%;
			justify-content: center;
			left: 50%;
			position: absolute;
			top: 50%;
			transform: translate(-50%, -50%);
			width: 100%;
		}

		.part-1 {
			background-color: var(--chalky-blue);
			border-radius: 6px;

			.branding-badge {
				animation: chalky-bs-fadeIn 0.5s var(--ease-out-quad) 0.15s forwards;
				opacity: 0;
			}
		}

		.part-2 {
			.branding-badge {
				animation-delay: 1s;
				opacity: 0;
				transform-origin: center center;
			}
		}

		.part-3 {
			opacity: 0;

			h2 {
				background-position: 90% 66%;
			}
		}
	}

	// Animation
	// -------------------------------------------------------------------------

	.branding-splash.animate-in {
		animation: chalky-bs-fadeOut 1s var(--ease-in-out-quad) 3.25s forwards;
		pointer-events: none;

		.part-1 {
			animation: chalky-bs-a-00 1s cubic-bezier(0.04, 0.94, 0.285, 1.065) forwards, chalky-bs-fadeOut 0.5s var(--ease-out-quart) 0.85s forwards;
		}

		.part-2 {
			animation: chalky-bs-fadeOut 1s var(--ease-in-out-quad) 2.25s forwards;

			.branding-badge {
				animation: chalky-bs-scaleIn 1.25s cubic-bezier(0.04, 0.94, 0.285, 1.065) forwards 0.75s,
					chalky-bs-slideLeft 1.5s cubic-bezier(0.04, 0.94, 0.285, 1.065) forwards 1.2s;
			}
		}

		.part-3 {
			animation: chalky-bs-fadeIn 0.75s var(--ease-out-quad) 1.2s forwards, chalky-bs-fadeOut 1s var(--ease-in-out-quad) 2s forwards;
		}
	}

	// Mobile Queries
	// -------------------------------------------------------------------------

	@media only screen and (max-width: 500px) and (orientation: portrait) {
		.branding-splash {
			.part-2,
			.part-3 {
				transform-origin: center center;
				transform: scale(0.75);
				left: 0;
				top: 0;
			}
		}
	}

	// Animations
	// -------------------------------------------------------------------------

	@keyframes chalky-bs-a-00 {
		0% {
			height: 100%;
			width: 100%;
		}

		100% {
			height: 100px;
			width: 100px;
		}
	}

	@keyframes chalky-bs-fadeOut {
		0% {
			opacity: 1;
		}

		100% {
			opacity: 0;
		}
	}

	@keyframes chalky-bs-fadeIn {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	@keyframes chalky-bs-scaleIn {
		0% {
			opacity: 0;
			transform: scale(0.5);
		}

		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes chalky-bs-slideLeft {
		0% {
			transform: translateX(0%);
		}

		100% {
			transform: translateX(-160px);
		}
	}

	@keyframes chalky-bs-slideRight {
		0% {
			transform: translateX(0%);
		}

		100% {
			transform: translateX(150px);
		}
	}
</style>
