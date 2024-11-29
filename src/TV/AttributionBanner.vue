<template>
	<section class="chalky tv-attributionbanner">
		<a v-bind:href="url" v-bind:title="title">
			<figure class="thumbnail">
				<img v-bind:src="thumbnailUrl" crossorigin="anonymous" referrerpolicy="no-referrer" />
			</figure>

			<div class="details">
				<h5 class="type-small-heading">Presented By</h5>
				<p class="type-small-paragraph">{{ title }} Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet</p>
			</div>

			<div class="youtube">
				<img src="@/Assets/image/graphic/youtube.svg" />
			</div>
		</a>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package TV
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class TVAttributionBanner extends ViewBase {
		/**
		 * @return string
		 */
		private get thumbnailUrl(): string {
			return this.scheduleModel?.channel?.getThumbnail();
		}

		/**
		 * @return string
		 */
		private get title(): string {
			return this.scheduleModel?.channel?.getTitle();
		}

		/**
		 * @return string
		 */
		private get url(): string {
			return this.scheduleModel?.channel?.getUrl();
		}

		/**
		 * @type ChalkySticks.Model.Schedule
		 */
		@Prop()
		public scheduleModel!: ChalkySticks.Model.Schedule;
	}
</script>

<style lang="scss">
	.chalky.tv-attributionbanner {
		--thumbnail-size: 36px;

		color: var(--chalky-white);

		a {
			align-items: center;
			color: inherit;
			display: grid;
			gap: 0.5rem;
			grid-template-columns: auto minmax(0, 1fr) auto;
			grid-template-rows: 1fr;
			text-decoration: none;
		}

		p {
			margin: 0;
			min-width: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		figure {
			background-color: var(--chalky-blue);
			border-radius: var(--thumbnail-size);
			border: 2px solid var(--chalky-blue);
			height: var(--thumbnail-size);
			position: relative;
			overflow: hidden;
			width: var(--thumbnail-size);

			img {
				height: 100%;
				left: 0;
				object-fit: cover;
				position: absolute;
				top: 0;
				width: 100%;
			}
		}

		h5 {
			color: var(--chalky-grey-2);
		}

		h5,
		p {
			margin: 0;
		}

		.youtube {
			margin-left: 2rem;
		}
	}
</style>
