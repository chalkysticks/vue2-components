<template>
	<div
		class="chalky venue-list"
		v-bind:class="{
			'state-loading': venueCollection.models.length == 0 || venueCollection.loading,
		}"
	>
		<section class="list" v-bind:key="venueCollection.requestTime">
			<slot name="before-list"></slot>

			<VenueCard
				class="list-item type-minimal"
				v-bind:class="{ 'state-selected': venueModel.id == selectedVenueId }"
				v-bind:interactiveGallery="false"
				v-bind:key="venueModel.id"
				v-bind:venueModel="venueModel"
				v-for="venueModel in venueCollection"
				v-on:click.native="Handle_OnClickVenue($event, venueModel)"
			>
				<!-- Pass through slots from parent to VenueCard -->
				<template v-slot:before>
					<slot name="venue-before" v-bind:venue="venueModel"></slot>
				</template>

				<template v-slot:content:before>
					<slot name="venue-content-before" v-bind:venue="venueModel"></slot>
				</template>

				<template v-slot:content:after>
					<slot name="venue-content-after" v-bind:venue="venueModel"></slot>
				</template>

				<template v-slot:after>
					<slot name="venue-after" v-bind:venue="venueModel"></slot>
				</template>
			</VenueCard>

			<slot name="after-list"></slot>
		</section>

		<slot name="actions">
			<footer class="actions" v-if="includeActions">
				<button v-on:click="Handle_OnClickPrevious">Previous</button>
				<button v-on:click="Handle_OnClickNext">Next</button>
			</footer>
		</slot>
	</div>
</template>

<script lang="ts">
	import * as UtilityMap from '../Utility/Map';
	import ChalkySticks from '@chalkysticks/sdk';
	import VenueCard from './Card.vue';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { created, mounted } from '../Utility/Decorators';

	/**
	 * @class VenueList
	 * @package Venue
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({
		components: {
			VenueCard,
		},
	})
	export default class VenueList extends ViewBase {
		/**
		 * Function names to bind to class, typically used for event handlers
		 *
		 * @type string[]
		 */
		public bindings: string[] = ['Handle_OnLocationChange'];

		/**
		 * @type boolean
		 */
		@Prop({ default: false })
		public includeActions!: boolean;

		/**
		 * @type number
		 */
		@Prop({ default: 0 })
		public selectedVenueId!: number;

		/**
		 * @type boolean
		 */
		@Prop({ default: true })
		public useLocation!: boolean;

		/**
		 * @type ChalkySticks/Collection/Venue
		 */
		@Prop({
			default: () => ChalkySticks.Factory.Venue.collection(),
		})
		public venueCollection!: ChalkySticks.Collection.Venue;

		/**
		 * @constructor
		 */
		@mounted
		public afterCreate() {
			// Check if we need to load data
			if (this.venueCollection.shouldFetch()) {
				this.venueCollection.fetch();
			}

			// Attach events
			this.attachEvents();
		}

		/**
		 * @return void
		 */
		public attachEvents(): void {
			ChalkySticks.Core.Event.Bus.on('location:change', this.Handle_OnLocationChange);
		}

		/**
		 * @return void
		 */
		public detachEvents(): void {
			ChalkySticks.Core.Event.Bus.off('location:change', this.Handle_OnLocationChange);
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @param MouseEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickNext(e: MouseEvent): Promise<void> {
			e.preventDefault();

			this.venueCollection.fetchNext();

			this.$emit('next');
		}

		/**
		 * @param MouseEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickPrevious(e: MouseEvent): Promise<void> {
			e.preventDefault();

			this.venueCollection.fetchPrevious();

			this.$emit('previous');
		}

		/**
		 * @param PointerEvent e
		 * @param ChalkySticks.Model.Venue venueModel
		 * @return Promise<void>
		 */
		protected async Handle_OnClickVenue(e: PointerEvent, venueModel: ChalkySticks.Model.Venue): Promise<void> {
			e.preventDefault();

			this.$emit('venue:select', venueModel);
		}

		/**
		 * @param MouseEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnLocationChange(e: ChalkySticks.Core.Event.IDispatcherEvent<ChalkySticks.Core.IGeolocationPayload>): Promise<void> {
			// Don't sync to global location
			if (!this.useLocation) {
				return;
			}

			// Trigger store
			this.$store.dispatch('location/position', e.data.position);

			// Simplify coordinates
			const coordinates = ChalkySticks.Utility.Geolocation.simplifyCoordinates(e.data.position.coords, undefined, 1e2);

			// Update query parameters
			this.venueCollection.setQueryParams(coordinates);
			this.venueCollection.fetch();
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.venue-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		height: 100%;
		justify-content: center;

		.list {
			background-color: var(--chalky-white);
			height: 100%;
			overflow: auto;
			padding: 1rem;

			.venue-card {
				transition: opacity 0.5s ease-in-out;
			}

			.chalky.venue-card .content {
				background: transparent;
			}

			.glass-panel {
				background: transparent;
			}

			> * {
				margin-bottom: 1.5rem;
				position: relative;

				&::after {
					border-top: 1px solid #ddd;
					bottom: -0.75rem;
					content: ' ';
					height: 1px;
					left: 0.5rem;
					position: absolute;
					right: 0.5rem;
				}
			}
		}

		> .actions {
			display: flex;
			gap: 1rem;
			justify-content: center;

			button {
				flex: 1;
			}
		}
	}

	// Variations
	// ---------------------------------------------------------------------------

	.chalky.venue-list.horizontal {
		--chalky-venue-list-thumbnail-size: 150px;

		.list {
			-webkit-overflow-scrolling: touch;
			align-items: center;
			background-color: transparent;
			display: flex;
			gap: 0.75em;
			overflow-x: auto;
			padding: 0 var(--padding);
			scrollbar-width: thin;

			.venue-gallery {
				border-radius: var(--chalky-venue-gallery-border-radius);
			}

			> * {
				margin-bottom: 0;

				&::after {
					display: none;
				}
			}
		}

		.venue-card {
			background: transparent;
			display: flex;
			flex-direction: column;
			flex: 0 0 auto;
			grid-template-columns: 1fr;
			margin: 0;
			white-space: nowrap;
			width: calc(var(--chalky-venue-list-thumbnail-size) * 1.5);

			.gallery {
				background-color: transparent;
				margin: 0;

				picture {
					width: 100%;
				}
			}

			.content {
				background: transparent;
				padding: 0;
			}

			.title {
				margin-bottom: 0.5rem;
				padding: 0.5rem 0;

				.name {
					color: var(--chalky-grey-2);
					font-size: var(--font-size-small);
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}

			.distance {
				bottom: 0.5rem;
				color: var(--chalky-grey-3);
				flex-direction: row;
				font-size: var(--font-size-x-small);
				margin-bottom: 0.5rem;
				top: auto;
				transform: none;

				.icon {
					width: 10px;
				}
			}

			.address,
			.details,
			.description,
			.actions {
				display: none;
			}
		}

		.actions {
			display: none;
		}
	}

	// Variations
	// ---------------------------------------------------------------------------

	.chalky.venue-list.variation-compact {
		--chalky-venue-gallery-border-radius: 0.25em;
		--chalky-venue-list-address-font-size: 0.875em;
		--chalky-venue-list-checkin-avatar-size: 30px;
		--chalky-venue-list-thumbnail-size: 2.5em;
		--chalky-venue-list-title-font-size: 1em;

		.confirmed,
		.venue-gallery,
		.distance {
			display: none;
		}

		.content {
			padding: 0;
		}
	}

	.chalky.venue-list.variation-small {
		--chalky-venue-gallery-border-radius: 0.25em;
		--chalky-venue-list-address-font-size: 0.875em;
		--chalky-venue-list-checkin-avatar-size: 30px;
		--chalky-venue-list-thumbnail-size: 2.5em;
		--chalky-venue-list-title-font-size: 1em;

		.distance {
			display: none;
		}
	}

	// State
	// ---------------------------------------------------------------------------

	.chalky.venue-list.state-loading {
		.list {
			background: url('~@chalkysticks/sass/build/asset/image/loader/triangle-white-light.svg') no-repeat center center;
		}

		.venue-card {
			opacity: 0;
		}
	}
</style>
