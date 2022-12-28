<template>
	<i class="chalky branding-badge branding-chalky-badge" :class="className"></i>
</template>

<script lang="ts">
	import Base from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * @class BrandingBadge
	 * @package Branding
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({})
	export default class BrandingBadge extends Base {
		/**
		 * Class Name
		 *
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
	.chalky.branding-badge {

	}
</style>
