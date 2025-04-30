<template>
	<section class="chalky utility-dots">
		<div class="dot" v-for="i in amount" v-bind:key="i" v-bind:class="{ active: i - 1 === activeIndex }"></div>
	</section>
</template>

<script lang="ts">
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * @author ChalkySticks LLC
	 * @package Utility
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class ViewGeneralDots extends ViewBase {
		/**
		 * @type number
		 */
		@Prop({ default: 5 })
		public amount!: number;

		/**
		 * @type number
		 */
		@Prop({ default: 0 })
		public activeIndex!: number;
	}
</script>

<style lang="scss">
	.chalky.utility-dots {
		--dot-size: 7px;

		.dot {
			background-color: var(--chalky-grey-2);
			border-radius: 50%;
			box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.7);
			cursor: pointer;
			display: inline-block;
			height: var(--dot-size);
			margin: 0 5px;
			transition: background-color 0.3s;
			width: var(--dot-size);

			&.active {
				background-color: var(--chalky-white);
			}
		}
	}
</style>
