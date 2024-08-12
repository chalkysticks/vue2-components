<template>
	<section class="chalky tv-timeline">
		<div class="times">
			<div class="time" v-for="(time, index) in times" v-bind:key="index">
				<p class="type-heading-4 text-right padded">{{ time }}</p>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package TV
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class TVTimeline extends ViewBase {
		/**
		 * @type number
		 */
		protected get lastHour(): number {
			return 0; // Math.max(0, new Date().getHours() * 60 - 60);
		}

		/**
		 * @type string[]
		 */
		protected get times(): string[] {
			const times: string[] = [];
			let time: number = this.lastHour;

			while (time < this.midnight) {
				const hours: number = Math.floor(time / 60);
				const minutes: number = time % 60;
				const hour: string = hours.toString().padStart(2, '0');
				const minute: string = minutes.toString().padStart(2, '0');

				// Format as 12 hour time with am/pm
				const h: string = (hours % 12 || 12).toString().padStart(2, '0');
				const ampm: string = hours < 12 ? 'am' : 'pm';

				times.push(`${h}:${minute} ${ampm}`);
				time += 60;
			}

			return times;
		}

		/**
		 * @type number
		 */
		protected get midnight(): number {
			return 24 * 60;
		}
	}
</script>

<style lang="scss">
	.tv-timeline {
		position: relative;

		.times {
		}

		.time {
			background-color: var(--chalky-blue-4);
			border-bottom: 2px solid var(--chalky-blue);
			height: var(--chalky-tv-hour-height);

			p {
				font-size: 0.875em;
			}
		}
	}
</style>
