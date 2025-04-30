<template>
	<div class="chalky user-card glass-panel" v-bind:key="userModel.id">
		<slot name="before"></slot>

		<UtilityGallery
			ref="gallery"
			v-bind:key="userModel.id"
			v-bind:interactive="interactiveGallery"
			v-bind:model="userModel"
			v-on:tap:small="$emit('click:gallery')"
		/>

		<section class="content" v-bind:key="userModel.uniqueKey" v-if="userModel.getName()">
			<slot name="content:before"></slot>

			<section class="title">
				<div class="inner">
					<h3 class="name">{{ userModel.getName() }}</h3>
				</div>
			</section>

			<section class="bio">
				<div class="inner">
					<h3 class="name">{{ userModel.getBiography() }}</h3>
				</div>
			</section>

			<section class="hometown">
				<div class="inner">
					<h3 class="name">{{ userModel.getHometown() }}</h3>
				</div>
			</section>

			<section class="talent-level">
				<div class="inner">
					<h3 class="name">{{ userModel.getTalentLevel() }}</h3>
				</div>
			</section>

			<section class="wallet">
				<div class="inner">
					<h3 class="name">${{ userModel.getWalletBalance() }}</h3>
				</div>
			</section>

			<section class="games-played">
				<div class="inner">
					<div class="game" v-for="game in userModel.games">
						{{ game.getValue() }}
					</div>
				</div>
			</section>

			<slot name="content:after"></slot>
		</section>

		<slot name="after"></slot>
	</div>
</template>

<script lang="ts">
	import ButtonCheckin from '../Button/Checkin.vue';
	import ChalkySticks from '@chalkysticks/sdk';
	import UserAvatar from '../User/Avatar.vue';
	import UtilityGallery from '../Utility/Gallery.vue';
	import ViewBase from '../Core/Base';
	import { Component, Prop, Ref } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '../Utility/Decorators';

	/**
	 * @class VenueCard
	 * @package Venue
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({
		components: {
			ButtonCheckin,
			UserAvatar,
			UtilityGallery,
		},
	})
	export default class VenueCard extends ViewBase {
		/**
		 * @return string
		 */
		public get distance(): string {
			const myLatitude = this.$store.getters['location/latitude'];
			const myLongitude = this.$store.getters['location/longitude'];
			const distance = this.userModel.getDistance(myLatitude, myLongitude, 'mi');

			// const venueLatitude = this.userModel.getLatitude();
			// const venueLongitude = this.userModel.getLongitude();
			// const distance = ChalkySticks.Utility.Geolocation.distanceBetween(myLatitude, myLongitude, venueLatitude, venueLongitude);

			return distance.toFixed(2);
		}

		/**
		 * @return boolean
		 */
		public get hasTableImage(): boolean {
			return !!this.userModel.media.findWhere({
				subgroup: 'table',
			});
		}

		/**
		 * If we're within 0.1 miles of the venue, we consider it "nearby".
		 *
		 * @return boolean
		 */
		public get isNearby(): boolean {
			return parseFloat(this.distance) < 0.1;
		}

		/**
		 * @return string
		 */
		public get rating(): string {
			const rating = Math.round(this.userModel.getRating());
			const filled = '★ '.repeat(rating);
			const empty = '☆ '.repeat(5 - rating);
			const output = filled + empty;

			return output;
		}

		/**
		 * @type UtilityGallery
		 */
		@Ref('gallery')
		protected utilityGallery!: UtilityGallery;

		/**
		 * @type boolean
		 */
		@Prop({ default: true })
		public interactiveGallery!: boolean;

		/**
		 * @type ChalkySticks/Model/Venue
		 */
		@Prop({
			default: () => new ChalkySticks.Model.Venue(),
		})
		public userModel!: ChalkySticks.Model.Venue;

		/**
		 * @return boolean
		 */
		protected isCheckedInHere(): boolean {
			const userModel = this.$store.getters['authentication/user'];

			// Check if the user is checked in here
			return this.userModel.checkins.models.some((checkin) => checkin.user.id === userModel?.id);
		}

		/**
		 * @return string
		 */
		protected getMapUrl(): string {
			let output: string;

			// Set root url
			output = 'https://www.google.com/maps/place/';

			// Set address
			output += encodeURIComponent(this.userModel.getAddress());

			return output;
		}
	}
</script>

<style lang="scss">
	.chalky.user-card {
		border-radius: var(--chalky-user-card-border-radius);
		padding: 0.5rem;
		position: relative;

		header + .inner {
			margin-top: 1rem;
		}

		.title {
			float: left;
			margin-right: 1rem;
			max-width: 50%;

			h1 {
				font-size: var(--chalky-user-card-title);
			}
		}

		.description {
			clear: both;
		}

		.rating {
			display: block;
			transform: translate(0, 2px);
		}

		.utility-gallery + .content {
			background: rgba(255, 255, 255, 0.75);
			color: var(--chalky-blue);
			padding: 1rem;
		}

		.today {
			.inner {
				align-items: center;
				display: flex;
				gap: 0.5rem;

				.badge {
					font-size: 0.675em;
					font-weight: bold;
					padding: 0.5em 0.75em;
				}
			}
		}

		.content {
			border-radius: var(--chalky-user-card-content-border-radius);
			border-top-left-radius: 0;
			border-top-right-radius: 0;

			&:empty {
				display: none;
			}
		}

		.confirmed {
			position: absolute;
			right: 0.75rem;
			top: 0.75rem;
		}

		.address {
			clear: both;
			margin-bottom: 1.5rem;
		}

		.description {
			margin-top: 0.5rem;
		}

		.actions {
			margin-top: 3em;

			.inner {
				align-items: center;
				display: flex;
				gap: 0.5rem;
				justify-content: space-between;
			}

			.action {
				// flex: 1;
				align-items: center;
				display: inline-flex;
				flex-grow: 1;
				gap: 0.5em;
				justify-content: center;
			}
		}

		.open-closed {
			position: absolute;
			right: 0.75rem;
			top: 0.5rem;

			.is-open {
				display: none;
			}
		}

		.distance {
			align-items: center;
			display: flex;
			flex-direction: column;
			font-size: var(--chalky-user-card-distance-font-size);
			font-weight: var(--chalky-user-card-distance-font-weight);
			gap: 0.25rem;
			justify-content: center;
			letter-spacing: -0.05em;
		}

		dl {
			margin: 1rem 0;

			dt {
				float: left;
				margin-right: 0.5rem;
			}
		}

		.checkins {
			.inner {
				align-items: center;
				display: flex;
				justify-content: space-between;
			}

			.inner .actions {
				flex-shrink: 1;
			}
		}

		.whos-here-users {
			display: grid;
			place-items: center;

			> * {
				grid-area: 1 / 1;

				&:nth-child(1) {
					transform: translate(0, 0);
				}

				&:nth-child(2) {
					transform: translate(2rem, 0);
				}

				&:nth-child(3) {
					transform: translate(4rem, 0);
				}

				&:nth-child(4) {
					transform: translate(6rem, 0);
				}

				&:nth-child(5) {
					transform: translate(8rem, 0);
				}
			}
		}
	}

	// Variations
	// ---------------------------------------------------------------------------

	.chalky.user-card.glass-panel {
		.confirmed {
		}
	}

	.chalky.user-card:not(.list-item) {
		.distance {
			display: none;
		}
	}

	.chalky.user-card.list-item {
		display: grid;
		grid-column-gap: 0px;
		grid-row-gap: 0px;
		grid-template-columns: auto 1fr;
		grid-template-rows: auto auto auto;
		// height: var(--chalky-user-list-thumbnail-size);
		max-width: 100%;
		padding: 0;

		.utility-gallery {
			align-items: center;
			display: flex;
			padding: 0;

			picture {
				border-radius: var(--rounded-corner);
				height: var(--chalky-user-list-thumbnail-size);
				overflow: hidden;
				width: calc(var(--chalky-user-list-thumbnail-size) * 1.5);
			}

			picture:not(:first-child) {
				display: none;
			}
		}

		.content {
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding: 0 1rem;
			padding-right: 60px;

			.title {
				align-content: flex-end;
				max-width: 100%;

				h3 {
					font-size: var(--chalky-user-list-title-font-size);
				}

				.inner {
					max-width: 70%;
				}
			}

			.confirmed {
				right: 0.25rem;
				top: 0.25rem;
			}

			.address {
				align-content: flex-start;
				font-size: var(--chalky-user-list-address-font-size);
				line-height: 1.25;
				margin-bottom: 0;
			}

			.distance {
				position: absolute;
				right: 1rem;
				top: 50%;
				transform: translate(0, -50%);
			}

			.checkins {
				bottom: 25%;
				position: absolute;
				right: 0.5rem;

				header,
				.user-avatar,
				.action {
					display: none;
				}

				.user-avatar:first-child {
					display: block;
				}

				.user-avatar {
					--avatar-size-sm: var(--chalky-user-list-checkin-avatar-size);
				}
			}
		}

		.checkin-cta,
		.today,
		.hours,
		.details,
		.description,
		.rating,
		.actions {
			display: none;
		}
	}

	// Media Queries
	// ---------------------------------------------------------------------------

	@container (min-width: 400px) {
		.chalky.user-card {
			--chalky-user-list-thumbnail-size: 60px;
		}
	}
</style>
