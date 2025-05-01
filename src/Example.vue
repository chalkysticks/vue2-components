<template>
	<div class="root">
		<Styleguide />

		<!-- <AlertPromptExample /> -->
		<!-- <VideoTheater /> -->
		<!-- <ForcedLandscape /> -->
	</div>
</template>

<script lang="ts">
	import AlertPromptExample from './Example/AlertPromptExample.vue';
	import ForcedLandscape from './Example/ForcedLandscape.vue';
	import Styleguide from './Example/Styleguide.vue';
	import VideoTheater from './Example/VideoTheater.vue';
	import { Component, Prop, Ref, Vue } from 'vue-property-decorator';

	@Component({
		components: {
			AlertPromptExample,
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
