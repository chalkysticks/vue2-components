<template>
	<section class="chalky venue-formatteddetails">
		<div class="detail-list background-chalky-blue">
			<div
				class="list-item"
				v-bind:class="venueDetailModel.getKey()"
				v-bind:key="venueDetailModel.getKey()"
				v-for="venueDetailModel in venueModel.details"
			>
				<img class="icon" v-bind:src="getIcon(venueDetailModel)" />
				<h3 class="title" v-html="getTitle(venueDetailModel)"></h3>
				<p class="description" v-html="getDescription(venueDetailModel)"></p>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';
	import { assetRef } from '../Manager/Asset';

	/**
	 * @author ChalkySticks LLC
	 * @package Venue
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class VenueFormattedDetails extends ViewBase {
		/**
		 * @type ChalkySticks.Model.Venue
		 */
		@Prop({ required: true })
		public venueModel!: ChalkySticks.Model.Venue;

		/**
		 * @type string
		 */
		protected language: any = [
			{
				description: 'This spot doesn&rsquo;t accept cards &mdash; make sure to hit the ATM first.',
				icon: assetRef('asset/image/icon/venue-detail/cash-only.svg'),
				key: 'cash-only',
				title: 'Bring cash',
			},
			{
				description: 'Grab a bite without ever leaving the venue.',
				icon: assetRef('asset/image/icon/venue-detail/has-food.svg'),
				key: 'has-food',
				title: 'Fuel up between games',
			},
			{
				description: 'Join a team or catch the competitive action.',
				icon: assetRef('asset/image/icon/venue-detail/has-league.svg'),
				key: 'has-league',
				title: 'League nights happen here',
			},
			{
				description: 'Test your skills against the best &mdash; or just spectate and enjoy.',
				icon: assetRef('asset/image/icon/venue-detail/has-tournaments.svg'),
				key: 'tournaments',
				title: 'Tournaments hosted regularly',
			},
			{
				description: 'Perfect for fast-paced bar-style games.',
				icon: assetRef('asset/image/icon/venue-detail/has-table.svg'),
				key: '7-foot-table',
				title: 'Play on a 7-foot table',
			},
			{
				description: 'A classic in-between size &mdash; great for casual and serious play.',
				icon: assetRef('asset/image/icon/venue-detail/has-table.svg'),
				key: '8-foot-table',
				title: 'Play on an 8-foot table',
			},
			{
				description: 'Preferred by pros, built for precision.',
				icon: assetRef('asset/image/icon/venue-detail/has-table.svg'),
				key: '9-foot-table',
				title: 'Full-size 9-foot table',
			},
			{
				description: 'Less waiting, more playing.',
				icon: assetRef('asset/image/icon/venue-detail/has-table.svg'),
				key: 'multiple-tables',
				title: 'Plenty of tables to choose from',
			},
			{
				description: `No quarters needed &mdash; rack 'em up and enjoy.`,
				icon: assetRef('asset/image/icon/venue-detail/free-table.svg'),
				key: 'free-table',
				title: 'Free to Play',
			},
			{
				description: 'Take on the challenge of a different cue sport.',
				icon: assetRef('asset/image/icon/venue-detail/has-snooker.svg'),
				key: 'snooker',
				title: 'Snooker table available',
			},
			{
				description: 'A cue game with no pockets &mdash; it&rsquo;s all about angles and finesse.',
				icon: assetRef('asset/image/icon/venue-detail/has-billiards.svg'),
				key: 'billiards',
				title: 'Carom billiards available',
			},
			{
				description: 'Take a break from pool with a quick paddle match.',
				icon: assetRef('asset/image/icon/venue-detail/has-pingpong.svg'),
				key: 'ping-pong',
				title: 'Ping pong tables onsite',
			},
			{
				description: 'Fast hands, quick shots, and competitive spirit welcome.',
				icon: assetRef('asset/image/icon/venue-detail/has-foosball.svg'),
				key: 'foosball',
				title: 'Foosball table ready',
			},
			{
				description: 'This venue allows smoking &mdash; check the vibe before you go.',
				icon: assetRef('asset/image/icon/venue-detail/has-smoking.svg'),
				key: 'smoking',
				title: 'Smoking permitted',
			},
			{
				description: 'Catch a show while you shoot &mdash; tunes and tables come together.',
				icon: assetRef('asset/image/icon/venue-detail/has-livemusic.svg'),
				key: 'live-music',
				title: 'Live music events',
			},
			{
				description: 'A local legend for those who like a little extra on the line.',
				icon: assetRef('asset/image/icon/venue-detail/has-gambling.svg'),
				key: 'gambling',
				title: 'Games of chance rumored',
			},
			{
				description: 'Classic bar staple &mdash; darts, bullseyes, and bragging rights.',
				icon: assetRef('asset/image/icon/venue-detail/has-darts.svg'),
				key: 'darts',
				title: 'Take aim and throw',
			},
		];

		/**
		 * @param ChalkySticks.Model.VenueDetail venueDetailModel
		 * @type string
		 */
		protected getIcon(venueDetailModel: ChalkySticks.Model.VenueDetail): string {
			const language = this.getLanguageItem(venueDetailModel);
			return this.getLanguageItem(venueDetailModel)?.icon || venueDetailModel.getKey();
		}

		/**
		 * @param ChalkySticks.Model.VenueDetail venueDetailModel
		 * @type string
		 */
		protected getTitle(venueDetailModel: ChalkySticks.Model.VenueDetail): string {
			const language = this.getLanguageItem(venueDetailModel);
			return this.getLanguageItem(venueDetailModel)?.title || venueDetailModel.getKey();
		}

		/**
		 * @param ChalkySticks.Model.VenueDetail venueDetailModel
		 * @type string
		 */
		protected getDescription(venueDetailModel: ChalkySticks.Model.VenueDetail): string {
			const language = this.getLanguageItem(venueDetailModel);
			return this.getLanguageItem(venueDetailModel)?.description || venueDetailModel.getKey();
		}

		/**
		 * @return void
		 */
		private getLanguageItem(venueDetailModel: ChalkySticks.Model.VenueDetail): any {
			return this.language.find((item: any) => item.key === venueDetailModel.getKey());
		}
	}
</script>

<style lang="scss">
	@import '~@chalkysticks/sass/src/app/typography.scss';

	.chalky.venue-formatteddetails {
		.detail-list {
			border-radius: var(--border-radius);
			padding: 1rem 0 0.5rem 0;

			.list-item {
				column-gap: 1rem;
				display: grid;
				grid-template-columns: auto 1fr;
				grid-template-rows: auto auto;
				grid-template-areas:
					'icon title'
					'icon description';
				padding: 0.5rem 2rem;
			}

			.title {
				@extend .type-paragraph;

				grid-area: title;
			}

			.description {
				@extend .type-small-paragraph;

				color: var(--chalky-grey);
				grid-area: description;
			}

			.icon {
				grid-area: icon;
				height: 32px;
				width: 32px;
			}
		}
	}
</style>
