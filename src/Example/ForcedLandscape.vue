<template>
	<main class="app theme-dark">
		<ChalkyUtilityForceLandscape />

		<section class="primary-content">
			<p>What is up bro></p>
		</section>
	</main>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import { Component, Prop, Ref, Vue } from 'vue-property-decorator';

	@Component
	export default class Example extends Vue {
		/**
		 * @type ChalkySticks
		 */
		public get ChalkySticks(): typeof ChalkySticks {
			return ChalkySticks;
		}
	}
</script>

<style lang="scss">
	.app {
		height: 100%;
	}
</style>
