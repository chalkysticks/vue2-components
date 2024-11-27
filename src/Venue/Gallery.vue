<template>
	<section
		class="chalky venue-gallery stacked"
		v-bind:style="{
			'--drag-offset': dragRatio,
		}"
	>
		<picture
			v-for="(model, index) in media"
			v-bind:key="index"
			v-bind:class="{
				'state-active': activeIndex === index,
			}"
		>
			<img
				v-if="model?.getUrl()"
				v-bind:class="{ 'is-loaded': loadedImages.includes(index) }"
				v-bind:src="imageProxy + model.getUrl()"
				v-on:load="Handle_OnImageLoaded"
			/>

			<img
				v-else
				src="https://map.chalkysticks.com/image/backgrounds/no-photos-venue.jpg"
				v-bind:class="{ 'is-loaded': loadedImages.includes(0) }"
				v-on:load="Handle_OnImageLoaded"
			/>
		</picture>

		<picture v-if="media.length == 0" class="state-active">
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
		 * @todo IMPORTANT
		 *
		 * Swap this out once we have our own one setup
		 *
		 * @return string
		 */
		protected get imageProxy(): string {
			return 'https://image.buck-sandbox.co/unsafe/768x0/filters:format(webp)/';
		}

		/**
		 * @return boolean
		 */
		protected get isInteractive(): boolean {
			return this.interactive && this.media.length > 1;
		}

		/**
		 * @type ChalkySticks.Model.VenueMedia[]
		 */
		protected get media(): ChalkySticks.Model.VenueMedia[] {
			if (!this.interactive) {
				return [this.venueModel.media.at(0)];
			} else {
				const output = [...this.venueModel.media];

				// If there's two, double it so we have at least three
				if (output.length === 2) {
					output.push(...this.venueModel.media);
				}

				return output;
			}
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

			if (this.isInteractive) {
				this.pointer.on('tap', this.Handle_OnTap.bind(this));
				this.pointer.on('drag', this.Handle_OnDrag.bind(this));
				this.pointer.on('up', this.Handle_OnDragRelease.bind(this));
			}
		}

		/**
		 * @return void
		 */
		@beforeDestroy
		public detachEvents(): void {
			this.pointer.off('tap');
			this.pointer.off('drag');
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
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.venue-gallery {
		background: var(--chalky-blue-3) url('~@chalkysticks/sass/build/asset/image/branding/icon-blue-4.svg') no-repeat center / 15%;
		border-radius: var(--rounded-corner);
		display: grid;
		overflow: hidden;
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
</style>
