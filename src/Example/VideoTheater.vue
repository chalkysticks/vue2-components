<template>
	<main class="app theme-dark">
		<ChalkyTvVideoTheater
			channel="9-ball"
			v-bind:allowControl="allowControl"
			v-bind:play="play"
			v-bind:mute="mute"
			v-bind:scheduleModel="liveScheduleModel"
		/>

		Play {{ play }}
		<br />
		Mute {{ mute }}
	</main>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import { Component, Prop, Ref, Vue } from 'vue-property-decorator';

	@Component
	export default class VideoTheater extends Vue {
		/**
		 * @type ChalkySticks
		 */
		public get ChalkySticks(): typeof ChalkySticks {
			return ChalkySticks;
		}

		/**
		 * @type ChalkySticks/Model/Schedule
		 */
		@Prop({
			default: () => ChalkySticks.Factory.Schedule.model(),
		})
		public liveScheduleModel!: ChalkySticks.Model.Schedule;

		/**
		 * @return void
		 */
		protected allowControl: boolean = true;

		/**
		 * @return void
		 */
		protected mute: boolean = true;

		/**
		 * @return void
		 */
		protected play: boolean = false;

		/**
		 * @return void
		 */
		public mounted(): void {
			console.log('Styleguide mounted');

			setTimeout(() => (this.play = true), 1000 * 4);
		}
	}
</script>
