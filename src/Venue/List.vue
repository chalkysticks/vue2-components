<template>
	<div class="chalky venue-list">
		<section class="list">
			<VenueCard
				class="list-item type-minimal"
				v-bind:key="venueModel.id"
				v-bind:venueModel="venueModel"
				v-for="venueModel in venueCollection"
				v-on:click.native="Handle_OnClickVenue($event, venueModel)"
			/>
		</section>

		<footer class="actions">
			<button v-on:click="Handle_OnClickPrevious">Previous</button>
			<button v-on:click="Handle_OnClickNext">Next</button>
		</footer>
	</div>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import VenueCard from './Card.vue';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';

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
		 * @type number
		 */
		@Prop({ default: 10 })
		public listSize: number;

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
		constructor() {
			super();

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
		--thumbnail-size: 100px;
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
</style>
