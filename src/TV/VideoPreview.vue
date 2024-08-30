<template>
	<section class="chalky tv-videopreview">
		<figure>
			<img class="thumbnail" v-bind:src="scheduleModel.getThumbnail()" />
			<figcaption class="title">{{ scheduleModel.getTitle() }}</figcaption>
		</figure>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * @author ChalkySticks LLC
	 * @package TV
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class TVVideoPreview extends ViewBase {
		/**
		 * @type ChalkySticks/Model/Schedule
		 */
		@Prop({
			default: () => {
				return new ChalkySticks.Model.Schedule({
					baseUrl: ChalkySticks.Core.Constants.API_URL_V1,
				});
			},
		})
		public scheduleModel!: ChalkySticks.Model.Schedule;
	}
</script>

<style lang="scss">
	.tv-videopreview {
		position: relative;

		figure {
			display: inline-block;
			max-width: 320px;
			position: relative;
			padding-bottom: 5em;
			width: fit-content;
		}

		figure img {
			border-radius: var(--rounded-corner);
			display: block;
			max-width: 100%;
			width: 100%;
		}

		figcaption {
			font-size: var(--font-size-medium);
			font-weight: var(--font-weight-medium);
			line-height: 1.25;
			margin: 0.75em 0;
			max-width: 100%;
			position: absolute;
			word-wrap: break-word;
		}
	}
</style>
