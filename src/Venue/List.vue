<template>
	<div class="chalky venue-list">
		<section class="list">
			<slot name="before-list"></slot>
			<VenueCard
				class="list-item type-minimal"
				v-bind:class="{ 'state-selected': venueModel.id == selectedVenueId }"
				v-bind:key="venueModel.id"
				v-bind:venueModel="venueModel"
				v-for="venueModel in venueCollection"
				v-on:click.native="Handle_OnClickVenue($event, venueModel)"
			/>
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
	import ChalkySticks from '@chalkysticks/sdk';
	import VenueCard from './Card.vue';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { created } from '../Utility/Decorators';

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
		@Prop({ default: 10 })
		public listSize!: number;

		/**
		 * @type number
		 */
		@Prop({ default: 0 })
		public selectedVenueId!: number;

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
		@created
		public afterCreate() {
			// Set query parameters
			this.venueCollection.setQueryParams({
				limit: this.listSize || this.venueCollection.limit,
			});

			// Check if we need to load data
			if (!this.venueCollection.length) {
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
		protected async Handle_OnLocationChange(e: ChalkySticks.Core.Event.IDispatcherEvent<GeolocationPosition>): Promise<void> {
			this.$store.dispatch('location/position', e.data);

			this.venueCollection.setQueryParams({
				lat: e.data.coords.latitude,
				lon: e.data.coords.longitude,
			});

			this.venueCollection.fetch();
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.venue-list {
		--thumbnail-size: 150px;

		display: flex;
		flex-direction: column;
		gap: 1rem;

		.list {
			background-color: #fff;
			overflow: auto;
			padding: 1rem;

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
		.list {
			-webkit-overflow-scrolling: touch;
			align-items: center;
			background-color: transparent;
			display: flex;
			gap: 0.75em;
			overflow-x: auto;
			padding: 0 var(--padding);
			scrollbar-width: thin;

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
			width: calc(var(--thumbnail-size) * 1.5);

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
</style>
