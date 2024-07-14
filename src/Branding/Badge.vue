<template>
	<i
		class="chalky branding-badge branding-chalky-badge"
		v-bind:class="{
			'on-light': mode === 'light',
			'on-dark': mode === 'dark',
			'size-sm': size === 'sm',
			'size-md': size === 'md',
			'size-lg': size === 'lg',
		}"
	></i>
</template>

<script lang="ts">
	import Base from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * @class BrandingBadge
	 * @package Branding
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class BrandingBadge extends Base {
		/**
		 * @type string
		 */
		@Prop({
			default: 'dark',
		})
		public mode!: 'dark' | 'light';

		/**
		 * Size of badge
		 * e.g. sm, md, lg
		 *
		 * @type string
		 */
		@Prop({
			default: 'sm',
		})
		public size!: 'sm' | 'md' | 'lg';
	}
</script>
