<template>
	<div class="chalky venue-list" :class="{ }">
		<VenueCard v-bind:key="venueModel.id" v-for="venueModel in venueCollection" :venueModel="venueModel" />

		<footer class="actions">
			<button v-on:click="Handle_OnClickPrevious">Previous</button>
			<button v-on:click="Handle_OnClickNext">Next</button>
		</footer>
	</div>
</template>

<script lang="ts">
	import ViewBase from '../Core/Base';
	import { Core, Venues } from '@chalkysticks/sdk';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * We can use the following modifiers as classes:
	 *
	 * size-sm
	 *
	 * @class VenueList
	 * @package Venue
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class VenueList extends ViewBase {
		/**
		 * @type ChalkySticks/Collection/Venue
		 */
		@Prop({
			default: () => new Venues.Collection.Venue({
				baseUrl: Core.Constants.API_URL_V1,
				qp: {
					limit: 5,
				},
			}),
		})
		public venueCollection!: Venues.Collection.Venue;

		/**
		 * @constructor
		 */
		constructor() {
			super();

			// Check if we need to load data
			if (!this.venueCollection.length) {
				this.venueCollection.fetch();
			}
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
		}

		/**
		 * @param MouseEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickPrevious(e: MouseEvent): Promise<void> {
			e.preventDefault();

			this.venueCollection.fetchPrevious();
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.venue-list {
		--thumbnail-size: 100px;

		&.size-sm {
			--thumbnail-size: 75px;
			font-size: 0.875rem;

			.description,
			.address {
				display: none;
			}
		}

		.venue-card {
			display: grid;
			grid-column-gap: 0px;
			grid-row-gap: 0px;
			grid-template-columns: auto 1fr;
			grid-template-rows: auto auto auto;
			margin: 1em 0;

			.gallery { grid-area: 1 / 1 / 4 / 2; }
			.title { grid-area: 1 / 2 / 2 / 3; }
			.address { grid-area: 2 / 2 / 3 / 3; }
			.actions { grid-area: 3 / 2 / 4 / 3; }

			.gallery {
				margin-right: 1rem;

				picture {
					aspect-ratio: 1 / 1;
					height: var(--thumbnail-size);
					width: var(--thumbnail-size);
				}
			}

			.details {
				display: none;
			}

			.actions {
				.action {
					padding: 1rem;
				}

				.icon + .caption {
					display: none;
				}
			}
		}
	}
</style>
