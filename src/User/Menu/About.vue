<template>
	<section class="chalky user-menu-about">
		<header class="header-base">
			<button class="control theme-dark size-medium type-left" v-on:click="$emit('click:back')">Back</button>

			<h3>About</h3>

			<div class="actions">
				<button class="control theme-dark round size-medium type-close" v-on:click="$emit('click:close')"></button>
			</div>
		</header>

		<section class="content padded">
			<div class="badge-container text-center">
				<ChalkyBrandingBadge size="lg" mode="dark" />
			</div>

			<div class="app-info text-center">
				<h2>ChalkySticks</h2>
				<p class="version">Version 3.0.1</p>
				<p class="tagline">Unleash your inner pool shark</p>
			</div>

			<footer>
				<a class="type-caps" href="https://www.chalkysticks.com/privacy-policy" target="_blank">Privacy Policy</a>
				<a class="type-caps" href="https://www.chalkysticks.com/terms-of-use" target="_blank">Terms of Service</a>
			</footer>
		</section>
	</section>
</template>

<script lang="ts">
	import ChalkyBrandingBadge from '../../Branding/Badge.vue';
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package User/Menu
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({
		components: {
			ChalkyBrandingBadge,
		},
	})
	export default class UserMenuAbout extends ViewBase {
		// Not implemented
	}
</script>

<style lang="scss">
	.chalky.user-menu-about {
		header {
			margin: 0 -2rem 1rem -2rem;
			width: auto;
		}

		footer {
			align-items: center;
			display: flex;
			justify-content: space-evenly;
			padding: 1.5rem 0;
		}
	}
</style>
