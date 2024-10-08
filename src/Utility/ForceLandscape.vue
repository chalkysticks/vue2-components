<template>
	<section class="chalky utility-forcelandscape">
		<ChalkyUtilityPortraitOverlay class="state-active" />
		<ChalkyUtilityScrollToBegin class="state-active" />
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import * as Environment from '../Core/Environment';
	import ViewBase from '../Core/Base';
	import { Component } from 'vue-property-decorator';
	import { waitForSwipeOnLandscape } from 'swipetobegin';

	/**
	 * @author ChalkySticks LLC
	 * @package Utility
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class UtilityForceLandscape extends ViewBase {
		/**
		 * @return void
		 */
		public mounted(): void {
			waitForSwipeOnLandscape({
				callback: () => {
					if (Environment.IS_MOBILE) {
						ChalkySticks.Core.Input.Pointer.instance?.applyForMobile();
					}
				},
			});
		}
	}
</script>

<style lang="scss">
	.utility-forcelandscape {
		height: 100vh;
		left: 0;
		position: fixed;
		top: 0;
		touch-action: manipulation; // Prevents double-tap zoom
		width: 100vw;
		z-index: var(--chalky-utilityscreen-zindex);
	}

	// State
	// ---------------------------------------------------------------------------

	.state-fullscreen.fullscreen-ready .utility-forcelandscape {
		display: none;
	}

	// mk: Warning this is globalized
	/*
	.layout-primary {
		height: 100vh;
		left: 0;
		position: fixed;
		top: 0;
		touch-action: manipulation; // Prevents double-tap zoom
		width: 100vw;
	}
	*/
</style>
