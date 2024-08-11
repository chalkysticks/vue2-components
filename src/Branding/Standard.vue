<template>
	<div
		class="chalky branding-standard branding-chalky-wordmark"
		v-bind:class="{
			'no-icon': !useIcon,
			'on-dark': mode === 'dark',
			'on-light': mode === 'light',
		}"
		v-bind:mode="mode"
		v-bind:size="size"
	>
		<h2>ChalkySticks</h2>
	</div>
</template>

<script lang="ts">
	import Base from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * @class BrandingStandardd
	 * @package Branding
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class BrandingStandard extends Base {
		/**
		 * @type string
		 */
		@Prop({
			default: 'dark',
		})
		public mode!: 'dark' | 'light';

		/**
		 * Size of badge
		 * e.g. 'xs' | 'sm' | 'md' | 'lg' | 'xl'
		 *
		 * @type string
		 */
		@Prop({
			default: 'sm',
		})
		public size!: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

		/**
		 * @type boolean
		 */
		@Prop({
			default: true,
		})
		public useIcon!: boolean;
	}
</script>
