<template>
	<div class="root">
		<VideoTheater />

		<!-- <Styleguide /> -->
		<!-- <ForcedLandscape /> -->
	</div>
</template>

<script lang="ts">
	import ForcedLandscape from './Example/ForcedLandscape.vue';
	import Styleguide from './Example/Styleguide.vue';
	import VideoTheater from './Example/VideoTheater.vue';
	import { Component, Prop, Ref, Vue } from 'vue-property-decorator';

	@Component({
		components: {
			ForcedLandscape,
			Styleguide,
			VideoTheater,
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
