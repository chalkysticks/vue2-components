<template>
	<div class="chalky branding-standard branding-logo-text" :class="className">
		<h2>ChalkySticks</h2>
	</div>
</template>

<script lang="ts">
	import Base from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';

	@Component
	export default class BrandingStandard extends Base {
		/**
		 * @type string
		 */
		public get className(): string {
			return [
				this.mode === 'dark' ? 'on-light' : 'on-dark',
				'size-' + this.size,
			].join(' ');
		}

		/**
		 * Mode
		 * e.g. dark, light
		 *
		 * @type string
		 */
		@Prop({
			default: 'dark',
			type: String,
		})
		public mode!: string;

		/**
		 * Size of badge
		 * e.g. sm, md, lg
		 *
		 * @type string
		 */
		@Prop({
			default: 'sm',
			type: String,
		})
		public size!: string;
	}
</script>

<style lang="scss">
	.chalky.branding-standard {

	}
</style>
