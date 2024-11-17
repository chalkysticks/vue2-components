<template>
	<section class="chalky venue-gallery">
		<picture v-bind:key="index" v-for="(media, index) in venueModel.media">
			<source v-bind:srcset="media.getUrl()" />
			<img
				src="https://map.chalkysticks.com/image/backgrounds/no-photos-venue.jpg"
				v-on:load="Handle_OnImageLoaded"
				v-bind:class="{ 'is-loaded': loadedImages.includes(index) }"
			/>
		</picture>

		<picture v-if="venueModel.media.length == 0">
			<img
				src="https://map.chalkysticks.com/image/backgrounds/no-photos-venue.jpg"
				v-on:load="Handle_OnImageLoaded"
				v-bind:class="{ 'is-loaded': loadedImages.includes(0) }"
			/>
		</picture>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @class Gallery
	 * @package Venue
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class VenueGallery extends ViewBase {
		/**
		 * @type ChalkySticks/Model/Venue
		 */
		@Prop({
			default: () => new ChalkySticks.Model.Venue(),
		})
		public venueModel!: ChalkySticks.Model.Venue;

		/**
		 * @type number[]
		 */
		protected loadedImages: number[] = [];

		/**
		 * Handle when an image has loaded
		 *
		 * @param Event e
		 * @eturn Promise<void>
		 */
		protected async Handle_OnImageLoaded(e: Event): Promise<void> {
			const img = e.target as HTMLImageElement;
			const picture = img.closest('picture');

			if (picture) {
				const index = Array.from(picture.parentElement?.children || []).indexOf(picture);

				if (!this.loadedImages.includes(index)) {
					this.loadedImages.push(index);
				}
			}
		}
	}
</script>

<style lang="scss">
	.venue-gallery {
		background: var(--chalky-blue-3) url('~@chalkysticks/sass/build/asset/image/branding/icon-blue-4.svg') no-repeat center / 15%;
		border-radius: var(--rounded-corner);
		overflow: hidden;

		picture {
			aspect-ratio: 16 / 9;
			display: none;

			img {
				opacity: 0;
				transition: opacity 0.25s var(--ease-out-quad);

				&.is-loaded {
					opacity: 1;
				}
			}

			&:first-child {
				display: block;
				width: 100%;

				img {
					height: 100%;
					object-fit: cover;
					width: 100%;
				}
			}
		}
	}
</style>
