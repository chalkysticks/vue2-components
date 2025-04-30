<template>
	<section class="chalky tv-attributionbanner">
		<a v-bind:href="url" v-bind:title="title" target="_blank">
			<figure class="thumbnail" v-bind:style="{ opacity: imageLoaded ? 1 : 0 }">
				<img
					crossorigin="anonymous"
					referrerpolicy="no-referrer"
					v-bind:src="thumbnailUrl"
					v-if="!imageFailed"
					v-on:error="Handle_OnImageError"
					v-on:load="Handle_OnImageLoad"
				/>

				<img v-else class="icon filter-invert" src="~@chalkysticks/sass/build/asset/image/icon/social-youtube.svg" style="padding: 4px" />
			</figure>

			<div class="details">
				<h5 class="type-small-heading">Presented By</h5>
				<p class="type-small-paragraph">{{ title }}</p>
			</div>

			<div class="youtube">
				<img src="../Assets/image/graphic/youtube.svg" />
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
			return this.scheduleModel?.channel?.getTitle() || '...';
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

		/**
		 * @type boolean
		 */
		private imageFailed: boolean = false;

		/**
		 * @type boolean
		 */
		private imageLoaded: boolean = false;

		/**
		 * @param Event e
		 * @return Promise<void>
		 */
		protected async Handle_OnImageError(e: Event): Promise<void> {
			this.imageFailed = true;
		}

		/**
		 * @param Event e
		 * @return Promise<void>
		 */
		protected async Handle_OnImageLoad(e: Event): Promise<void> {
			this.imageLoaded = true;
		}
	}
</script>

<style lang="scss">
	.chalky.tv-attributionbanner {
		--thumbnail-size: 36px;

		color: var(--chalky-white);
		display: flex;
		min-height: 50px;

		a {
			align-items: center;
			border: 0;
			color: inherit;
			display: grid;
			flex-grow: 1;
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
			background-color: var(--chalky-blue-4);
			border-radius: var(--thumbnail-size);
			border: 2px solid var(--chalky-blue);
			height: var(--thumbnail-size);
			position: relative;
			opacity: 0;
			overflow: hidden;
			transition: opacity 0.5s ease-in-out;
			width: var(--thumbnail-size);

			img {
				// -4px because of border
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
