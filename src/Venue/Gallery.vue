<template>
	<section
		class="chalky venue-gallery stacked"
		v-bind:class="{
			'state-loaded-some': loadedImages.length > 0,
		}"
		v-bind:style="{
			'--drag-offset': dragRatio,
		}"
	>
		<picture
			v-bind:key="index"
			v-bind:class="{
				'state-active': activeIndex === index,
			}"
			v-for="(model, index) in media"
		>
			<img
				v-bind:class="{ 'is-loaded': loadedImages.includes(index) }"
				v-bind:src="model.getUrlLarge()"
				v-if="model?.getUrl()"
				v-on:load="Handle_OnImageLoaded"
			/>

			<img
				class="no-photo"
				src="https://map.chalkysticks.com/image/backgrounds/no-photos-venue.jpg"
				v-bind:class="{ 'is-loaded': loadedImages.includes(0) }"
				v-on:load="Handle_OnImageLoaded"
			/>
		</picture>

		<picture v-if="media.length == 0" class="state-active">
			<img
				src="https://map.chalkysticks.com/image/backgrounds/no-photos-venue.jpg"
				v-bind:class="{ 'is-loaded': loadedImages.includes(0) }"
				v-on:load="Handle_OnImageLoaded"
			/>
		</picture>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import gsap from 'gsap';
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
		 * @return number
		 */
		protected get containerWidth(): number {
			return this.$el.clientWidth;
		}

		/**
		 * @return boolean
		 */
		protected get isInteractive(): boolean {
			return this.interactive && this.media.length > 1;
		}

		/**
		 * @type ChalkySticks.Model.Media[]
		 */
		protected get media(): ChalkySticks.Model.Media[] {
			const MEDIA_SORT_ORDER = ['table', 'interior', 'exterior'];

			const sortedMediaModels = this.venueModel.media.models
				.filter((model) => MEDIA_SORT_ORDER.includes(model.getSubgroup()))
				.sort((a, b) => {
					return MEDIA_SORT_ORDER.indexOf(a.getSubgroup()) - MEDIA_SORT_ORDER.indexOf(b.getSubgroup());
				});

			if (!this.interactive) {
				return [sortedMediaModels[0]];
			}

			// In interactive mode, return all media models
			// If only 2 items present, duplicate them to ensure at least 3
			const mediaModels = [...sortedMediaModels];
			if (mediaModels.length === 2) {
				mediaModels.push(...sortedMediaModels);
			}

			return mediaModels;
		}

		/**
		 * @type number
		 */
		protected activeIndex: number = 0;

		/**
		 * @type boolean
		 */
		protected automatic: boolean = true;

		/**
		 * @type number
		 */
		protected dragRatio: number = 0;

		/**
		 * @type boolean
		 */
		protected hasInteracted: boolean = false;

		/**
		 * @type number
		 */
		protected intervalDuration: number = 1000 * 5;

		/**
		 * @type boolean
		 */
		@Prop({ default: false })
		public interactive!: boolean;

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
		 * @type ChalkySticks.Core.Input.Pointer
		 */
		protected pointer!: ChalkySticks.Core.Input.Pointer;

		/**
		 * @return void
		 */
		@mounted
		public attachEvents(): void {
			this.pointer = new ChalkySticks.Core.Input.Pointer('pointer', true, this.$el as HTMLElement);
			this.pointer.on('tap:small', this.Handle_OnTapSmall.bind(this));

			if (this.isInteractive) {
				this.pointer.on('drag', this.Handle_OnDrag.bind(this));
				this.pointer.on('tap', this.Handle_OnTap.bind(this));
				this.pointer.on('up', this.Handle_OnDragRelease.bind(this));
			}
		}

		/**
		 * @return void
		 */
		@beforeDestroy
		public detachEvents(): void {
			this.pointer.off('drag');
			this.pointer.off('tap');
			this.pointer.off('tap:small');
			this.pointer.off('up');
		}

		/**
		 * @return void
		 */
		protected next() {
			this.activeIndex = this.activeIndex + 1;

			if (this.activeIndex >= this.venueModel.media.length) {
				this.activeIndex = 0;
			}
		}

		/**
		 * @return void
		 */
		protected previous() {
			this.activeIndex = this.activeIndex - 1;

			if (this.activeIndex < 0) {
				this.activeIndex = this.venueModel.media.length - 1;
			}
		}

		/**
		 * @return void
		 */
		protected start() {
			ChalkySticks.Utility.Interval.add(
				() => {
					this.next();
				},
				this.intervalDuration,
				'gallery-' + this.cid,
			);

			this.automatic = true;
		}

		/**
		 * @return void
		 */
		protected stop() {
			ChalkySticks.Utility.Interval.remove('gallery-' + this.cid);
			this.automatic = false;
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @param ChalkySticks.Core.IDispatcherEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnDrag(e: ChalkySticks.Core.IDispatcherEvent<any>): Promise<void> {
			this.hasInteracted = true;
			this.dragRatio = this.pointer.dx / this.containerWidth;

			if (this.automatic) {
				this.stop();
			}
		}

		/**
		 * @param ChalkySticks.Core.IDispatcherEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnDragRelease(e: ChalkySticks.Core.IDispatcherEvent<any>): Promise<void> {
			const dragRatio = this.dragRatio > 0.3 ? 1 : this.dragRatio < -0.3 ? -1 : 0;

			// Animate to new area
			await gsap.to(this, {
				dragRatio: dragRatio,
				duration: 0.5,
			});

			// Advance the "state" class
			if (this.dragRatio > 0.5) {
				this.previous();
			} else if (this.dragRatio < -0.5) {
				this.next();
			} else {
				// Do nothing
			}

			// Reset drag ratio
			this.dragRatio = 0;
		}

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

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnTap(): Promise<void> {
			this.hasInteracted = true;
			this.$emit('tap');
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnTapSmall(): Promise<void> {
			this.$emit('tap:small');
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.venue-gallery {
		background: var(--chalky-blue-3) url('~@chalkysticks/sass/build/asset/image/branding/icon-blue-4.svg') no-repeat center / 15%;
		border-radius: var(--chalky-venue-gallery-border-radius);
		display: grid;
		overflow: hidden;
		position: relative;
		user-select: none;

		picture {
			aspect-ratio: 16 / 9;
			grid-area: 1 / 1;
			pointer-events: none;
			position: relative;

			img {
				height: 100%;
				left: 0;
				object-fit: cover;
				opacity: 0;
				position: absolute;
				top: 0;
				transition: opacity 0.25s var(--ease-out-quad);
				width: 100%;

				// mk: We do this because the "No photo" keeps the structure of
				// the gallery visually, but once the actual photo loads, we
				// can hide the "No photos".
				&.is-loaded {
					opacity: 1;

					+ .is-loaded {
						display: none;
					}
				}

				// mk: But if the no photo is the first and only one, then we
				// must show it.
				&.no-photo.is-loaded:first-child:last-child {
					display: initial;
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

		picture {
			transform: translateX(calc(-100% + var(--drag-offset) * 100%));
		}

		picture.state-active {
			transform: translateX(calc(var(--drag-offset) * 100%));
		}

		picture.state-active ~ picture {
			transform: translateX(calc(100% + var(--drag-offset) * 100%));
		}

		picture:first-child.state-active ~ picture:last-of-type {
			transform: translateX(calc(-100% + var(--drag-offset) * 100%));
		}

		picture:first-child:not(.state-active) {
			transform: translateX(calc(100% + var(--drag-offset) * 100%));
		}

		picture:first-child:has(+ .state-active) {
			transform: translateX(calc(-100% + var(--drag-offset) * 100%));
		}

		picture.state-active + picture {
			z-index: 5;
		}
	}

	// Animation
	// ---------------------------------------------------------------------------

	.venue-gallery::before {
		animation: shimmer 2s infinite;
		background: linear-gradient(90deg, transparent, var(--chalky-grey-3), transparent);
		content: '';
		height: 200%;
		opacity: 0.2;
		position: absolute;
		top: 0;
		transform: translateY(-25%) translateX(-130%) rotate(30deg);
		width: 50%;
	}

	@keyframes shimmer {
		100% {
			opacity: 0;
			transform: translateY(-25%) translateX(200%) rotate(30deg);
		}
	}
</style>
