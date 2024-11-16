<template>
	<section class="chalky utility-modal">
		<slot></slot>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package Utility
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class UtilityModal extends ViewBase {
		// Not implemented
	}
</script>

<style lang="scss">
	.utility-modal {
		animation: modalBackgroundFade 0.7s ease-in-out forwards;
		content: ' ';
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

	// Animation
	// ---------------------------------------------------------------------------

	@keyframes modalBackgroundFade {
		0% {
			background-color: rgba(0, 0, 0, 0);
		}

		100% {
			background-color: rgba(0, 0, 0, 0.7);
		}
	}
</style>
