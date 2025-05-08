<template>
	<div class="chalky venue-card glass-panel" v-bind:class="'type-' + venueModel.getType()" v-bind:key="venueModel.uniqueKey">
		<slot name="before"></slot>

		<UtilityGallery
			ref="gallery"
			v-bind:key="venueModel.id"
			v-bind:interactive="interactiveGallery"
			v-bind:model="venueModel"
			v-on:tap:small="$emit('click:gallery')"
		/>

		<section class="content" v-if="venueModel.getName()">
			<slot name="content:before"></slot>

			<section class="title">
				<div class="inner">
					<h3 class="name">{{ venueModel.getName() }}</h3>
				</div>
			</section>

			<section class="reactions">
				<div class="inner">
					<ReactionList v-bind:model="venueModel" />
				</div>
			</section>

			<section class="rating">
				<div class="inner">
					<span>{{ rating }}</span>
				</div>
			</section>

			<section class="reactions" v-if="false">
				<div class="inner">
					<span>{{ venueModel.reactions.like.length }} Likes</span>
				</div>
			</section>

			<section class="confirmed">
				<img v-if="hasTableImage" class="icon size-xs" src="~@chalkysticks/sass/build/asset/image/icon/confirmed-venue.svg" />
			</section>

			<address class="address">
				<div class="inner">
					<span class="address">{{ venueModel.getShortAddress() }}</span>
				</div>
			</address>

			<address class="today">
				<div class="inner">
					<h6 class="hours-today">{{ venueModel.hours.getTodayHours()?.formatHours() }}</h6>
					<span class="is-open detail tag badge type-danger" v-if="venueModel.isOpenNow()">Open</span>
				</div>
			</address>

			<section class="description" v-if="venueModel.attributes.description">
				<div class="inner">
					<p>{{ venueModel.getDescription() }}</p>
				</div>
			</section>

			<section class="details" v-if="venueModel.details.models.length">
				<div class="inner">
					<span
						class="detail tag badge"
						v-bind:class="venueDetailModel.getKey()"
						v-bind:key="venueDetailModel.getKey()"
						v-for="venueDetailModel in venueModel.details"
					>
						{{ venueDetailModel.getValue() }}
					</span>
				</div>
			</section>

			<section class="checkins" v-if="showCheckins">
				<header>
					<h5>Who's Here</h5>
				</header>

				<div class="inner" v-bind:key="venueModel.checkins.uniqueKey">
					<VenueCheckins
						v-bind:venueModel="venueModel"
						v-on:checkin:success="$emit('checkin:success')"
						v-on:login:request="$emit('login:request', $event)"
					>
						<template v-slot:checkin:action v-bind:venueModel="venueModel">
							<slot name="checkin:action" v-bind:venueModel="venueModel"></slot>
						</template>
					</VenueCheckins>
				</div>
			</section>

			<section class="comments" v-if="showComments">
				<CommentList direction="asc" maxHeight="80svh" v-bind:model="venueModel">
					<template v-slot:header>
						<h5>Join the Conversation ({{ venueModel.comments.length }})</h5>
					</template>
				</CommentList>
			</section>

			<section class="hours" v-if="showHours">
				<div class="inner">
					<h5>Hours</h5>
				</div>

				<div class="inner" v-bind:key="venueModel.hours.uniqueKey">
					<VenueHours v-bind:venueModel="venueModel" />
				</div>
			</section>

			<section class="actions">
				<div class="inner">
					<VenueButtonCall v-bind:venueModel="venueModel" />
					<VenueButtonWebsite v-bind:venueModel="venueModel" />
					<VenueButtonDirections v-bind:venueModel="venueModel" />
				</div>
			</section>

			<section class="open-closed">
				<span class="is-open detail tag badge type-dark" v-if="venueModel.isOpenNow()">Open</span>
				<span class="is-closed detail tag badge type-danger" v-else>Closed</span>
			</section>

			<section class="distance">
				<svg
					class="icon icon-pin"
					width="16"
					height="16"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 438.536 438.536"
				>
					<g>
						<path
							d="M322.621,42.825C294.073,14.272,259.619,0,219.268,0c-40.353,0-74.803,14.275-103.353,42.825 c-28.549,28.549-42.825,63-42.825,103.353c0,20.749,3.14,37.782,9.419,51.106l104.21,220.986 c2.856,6.276,7.283,11.225,13.278,14.838c5.996,3.617,12.419,5.428,19.273,5.428c6.852,0,13.278-1.811,19.273-5.428 c5.996-3.613,10.513-8.562,13.559-14.838l103.918-220.986c6.282-13.324,9.424-30.358,9.424-51.106 C365.449,105.825,351.176,71.378,322.621,42.825z M270.942,197.855c-14.273,14.272-31.497,21.411-51.674,21.411 s-37.401-7.139-51.678-21.411c-14.275-14.277-21.414-31.501-21.414-51.678c0-20.175,7.139-37.402,21.414-51.675 c14.277-14.275,31.504-21.414,51.678-21.414c20.177,0,37.401,7.139,51.674,21.414c14.274,14.272,21.413,31.5,21.413,51.675 C292.355,166.352,285.217,183.575,270.942,197.855z"
						/>
					</g>
				</svg>

				<span>{{ distance }} mi</span>
			</section>

			<slot name="content:after"></slot>
		</section>

		<slot name="after"></slot>
	</div>
</template>

<script lang="ts">
	import ButtonCheckin from '../Button/Checkin.vue';
	import ChalkySticks from '@chalkysticks/sdk';
	import CommentList from '../Comment/List.vue';
	import ReactionList from '../Reaction/List.vue';
	import UserAvatar from '../User/Avatar.vue';
	import UtilityGallery from '../Utility/Gallery.vue';
	import VenueButtonCall from './Button/Call.vue';
	import VenueButtonDirections from './Button/Directions.vue';
	import VenueButtonWebsite from './Button/Website.vue';
	import VenueCheckins from './Checkins.vue';
	import VenueHours from './Hours.vue';
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
			CommentList,
			ReactionList,
			UserAvatar,
			UtilityGallery,
			VenueButtonCall,
			VenueButtonDirections,
			VenueButtonWebsite,
			VenueCheckins,
			VenueHours,
		},
	})
	export default class VenueCard extends ViewBase {
		/**
		 * @return string
		 */
		public get distance(): string {
			const myLatitude = this.$store.getters['location/latitude'];
			const myLongitude = this.$store.getters['location/longitude'];
			const distance = this.venueModel.getDistance(myLatitude, myLongitude, 'mi');

			// const venueLatitude = this.venueModel.getLatitude();
			// const venueLongitude = this.venueModel.getLongitude();
			// const distance = ChalkySticks.Utility.Geolocation.distanceBetween(myLatitude, myLongitude, venueLatitude, venueLongitude);

			return distance.toFixed(2);
		}

		/**
		 * @return boolean
		 */
		public get hasTableImage(): boolean {
			return !!this.venueModel.media.findWhere({
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
			const rating = Math.round(this.venueModel.getRating());
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
		 * @type boolean
		 */
		@Prop({ default: true })
		public showCheckins!: boolean;

		/**
		 * @type boolean
		 */
		@Prop({ default: false })
		public showComments!: boolean;

		/**
		 * @type boolean
		 */
		@Prop({ default: true })
		public showHours!: boolean;

		/**
		 * @type ChalkySticks/Model/Venue
		 */
		@Prop({
			default: () => new ChalkySticks.Model.Venue(),
		})
		public venueModel!: ChalkySticks.Model.Venue;

		/**
		 * @return boolean
		 */
		protected isCheckedInHere(): boolean {
			const userModel = this.$store.getters['authentication/user'];

			// Check if the user is checked in here
			return this.venueModel.checkins.models.some((checkin) => checkin.user.id === userModel?.id);
		}
	}
</script>

<style lang="scss">
	.chalky.venue-card {
		border-radius: var(--chalky-venue-card-border-radius);
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
				font-size: var(--chalky-venue-card-title);
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
			border-radius: var(--chalky-venue-card-content-border-radius);
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
			font-size: var(--chalky-venue-card-distance-font-size);
			font-weight: var(--chalky-venue-card-distance-font-weight);
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
	}

	// Variations
	// ---------------------------------------------------------------------------

	.chalky.venue-card.glass-panel {
		.confirmed {
		}
	}

	.chalky.venue-card:not(.list-item) {
		.distance {
			display: none;
		}
	}

	.chalky.venue-card.list-item {
		display: grid;
		grid-column-gap: 0px;
		grid-row-gap: 0px;
		grid-template-columns: auto 1fr;
		grid-template-rows: auto auto auto;
		// height: var(--chalky-venue-list-thumbnail-size);
		max-width: 100%;
		padding: 0;

		.utility-gallery {
			align-items: center;
			display: flex;
			padding: 0;

			picture {
				border-radius: var(--rounded-corner);
				height: var(--chalky-venue-list-thumbnail-size);
				overflow: hidden;
				width: calc(var(--chalky-venue-list-thumbnail-size) * 1.5);
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
					font-size: var(--chalky-venue-list-title-font-size);
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
				font-size: var(--chalky-venue-list-address-font-size);
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
					--avatar-size-sm: var(--chalky-venue-list-checkin-avatar-size);
				}
			}
		}

		.comments,
		.reactions,
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

	// List item view styles
	.chalky.venue-card.list-item {
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
				--avatar-size-sm: var(--chalky-venue-list-checkin-avatar-size);
			}
		}
	}

	// Media Queries
	// ---------------------------------------------------------------------------

	@container (min-width: 400px) {
		.chalky.venue-card {
			--chalky-venue-list-thumbnail-size: 60px;
		}
	}
</style>
