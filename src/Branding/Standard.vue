<template>
	<div
		class="chalky branding-standard branding-logo-text"
		v-bind:class="{
			'on-light': mode === 'light',
			'on-dark': mode === 'dark',
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
	}
</script>
