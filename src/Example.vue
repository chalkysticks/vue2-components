<template>
	<div class="root">
		<Styleguide />

		<!-- <ForcedLandscape /> -->
	</div>
</template>

<script lang="ts">
	import ForcedLandscape from './Example/ForcedLandscape.vue';
	import Styleguide from './Example/Styleguide.vue';
	import { Component, Prop, Ref, Vue } from 'vue-property-decorator';

	@Component({
		components: {
			ForcedLandscape,
			Styleguide,
		},
	})
	export default class Example extends Vue {
		// Do nothing
	}
</script>

<style lang="scss">
	.app {
		height: 100%;
	}
</style>
