<template>
	<ChalkyMediaFeed class="chalky media-venue" v-bind:mediaCollection="mediaCollection" v-bind="$attrs" v-on="$listeners">
		<template v-slot="{ mediaModel }">
			<h3>{{ venueModel?.getName() || mediaModel.venue.getName() }}</h3>
			<address>{{ venueModel?.getCity() || mediaModel.venue.getCity() }}, {{ venueModel?.getState() || mediaModel.venue.getState() }}</address>
		</template>
	</ChalkyMediaFeed>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '../Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package Media/Venue
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class MediaVenueTable extends ViewBase {
		/**
		 * @type ChalkySticks/Collection/Media
		 */
		public get mediaCollection(): ChalkySticks.Collection.Media {
			if (this.venueModel) {
				const index = ChalkySticks.Utility.Math.randomInt(0, this.venueModel.media.length - 1);
				return ChalkySticks.Collection.Media.hydrate(this.venueModel.media.slice(index, index + 1));
			}

			return this.venueMediaCollection;
		}

		/**
		 * @type number
		 */
		@Prop({ default: 1 })
		public limit!: number;

		/**
		 * @type ChalkySticks.Enum.MediaType
		 */
		@Prop({ default: ChalkySticks.Enum.MediaType.Table })
		public type!: ChalkySticks.Enum.MediaType;

		/**
		 * @type ChalkySticks/Model/Venue
		 */
		@Prop()
		public venueModel!: ChalkySticks.Model.Venue;

		/**
		 * @type ChalkySticks/Collection/VenueMedia
		 */
		@Prop({
			default: () => ChalkySticks.Factory.VenueMedia.collection(),
		})
		public venueMediaCollection!: ChalkySticks.Collection.VenueMedia;

		/**
		 * @return void
		 */
		public mounted(): void {
			this.venueMediaCollection.setQueryParam('limit', this.limit.toString());
			this.venueMediaCollection.random().include();

			switch (this.type) {
				case ChalkySticks.Enum.MediaType.Exterior:
					this.venueMediaCollection.exterior();
					break;

				case ChalkySticks.Enum.MediaType.Interior:
					this.venueMediaCollection.interior();
					break;

				default:
				case ChalkySticks.Enum.MediaType.Table:
					this.venueMediaCollection.table();
					break;
			}

			this.venueMediaCollection.fetch();
		}
	}
</script>
