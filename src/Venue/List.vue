<template>
	<div class="chalky venue-list">
		<section class="list">
			<VenueCard
				class="list-item type-minimal"
				v-bind:key="venueModel.id"
				v-bind:venueModel="venueModel"
				v-for="venueModel in venueCollection"
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
	 * We can use the following modifiers as classes:
	 *
	 * size-sm
	 *
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
				limit: 5,
			});

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
