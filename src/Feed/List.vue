<template>
	<section
		class="chalky feed-list"
		v-bind:class="{
			'state-loading': feedCollection.models.length == 0 || feedCollection.loading,
		}"
	>
		<section class="list" v-bind:key="feedCollection.uniqueKey">
			<slot name="before-list"></slot>

			<section class="list-item type-minimal" v-bind:key="feedModel.id" v-bind:feedModel="feedModel" v-for="feedModel in feedCollection">
				<div v-html="feedModel.getHtmlMessage()"></div>
			</section>

			<slot name="after-list"></slot>
		</section>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package Feed
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class FeedList extends ViewBase {
		/**
		 * @type ChalkySticks/Collection/Feed
		 */
		@Prop({
			default: () => ChalkySticks.Factory.Feed.collection(),
		})
		public feedCollection!: ChalkySticks.Collection.Feed;

		/**
		 * @constructor
		 */
		@mounted
		public afterCreate() {
			// Check if we need to load data
			if (this.feedCollection.shouldFetch()) {
				this.feedCollection.fetch();
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
		protected async Handle_OnLocationChange(e: ChalkySticks.Core.Event.IDispatcherEvent<ChalkySticks.Core.IGeolocationPayload>): Promise<void> {
			const coordinates = ChalkySticks.Utility.Geolocation.simplifyCoordinates(e.data.position.coords, undefined, 1e2);

			// Update query parameters
			this.feedCollection.setQueryParams(coordinates);
			this.feedCollection.fetch();
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.feed-list {
		// Not implemented
	}
</style>
