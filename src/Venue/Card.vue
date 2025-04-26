<template>
	<div class="chalky venue-card glass-panel" v-bind:class="'type-' + venueModel.getType()" v-bind:key="venueModel.id">
		<slot name="before"></slot>

		<VenueGallery
			ref="gallery"
			v-bind:key="venueModel.id"
			v-bind:interactive="interactiveGallery"
			v-bind:venueModel="venueModel"
			v-on:tap:small="$emit('click:gallery')"
		/>

		<section class="content" v-if="venueModel.getName()">
			<slot name="content:before"></slot>

			<section class="title">
				<div class="inner">
					<h3 class="name">{{ venueModel.getName() }}</h3>
				</div>
			</section>

			<section class="rating">
				<div class="inner">
					<span>{{ rating }}</span>
				</div>
			</section>

			<section class="confirmed">
				<img v-if="hasTableImage" class="icon size-xs" src="~@chalkysticks/sass/build/asset/image/icon/confirmed-venue.svg" />
			</section>

			<address class="address">
				<div class="inner">
					<span class="address">{{ venueModel.getAddress() }}</span>
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

			<section class="checkins">
				<header>
					<h5>Who's Here</h5>
				</header>

				<div class="inner">
					<div class="users" v-if="venueModel.checkins.models.length">
						<UserAvatar
							size="sm"
							v-bind:key="index"
							v-bind:userModel="venueCheckinModel.user"
							v-for="(venueCheckinModel, index) in venueModel.checkins"
						/>
					</div>

					<div class="checkin-cta" v-else>
						<p>Be the first to check in!</p>

						<div v-if="isNearby && !$store.getters['authentication/authenticated']">
							<strong>Looks like you might be here?</strong>
						</div>
					</div>

					<div class="action" v-if="$store.getters['authentication/authenticated'] && isNearby">
						<ButtonCheckin v-bind:venueModel="venueModel" v-on:checkin="Handle_OnCheckinSuccess" />
					</div>
				</div>
			</section>

			<section class="hours">
				<header>
					<h5>Hours</h5>
				</header>

				<div class="inner">
					<div class="today">
						<!-- Add timeline of todays hours -->
					</div>

					<dl>
						<dt class="hours-monday">Monday</dt>
						<dd class="hours-monday">{{ venueModel.hours.getHoursForDay('monday')?.formatHours() }}</dd>

						<dt class="hours-tuesday">Tuesday</dt>
						<dd class="hours-tuesday">{{ venueModel.hours.getHoursForDay('tuesday')?.formatHours() }}</dd>

						<dt class="hours-wednesday">Wednesday</dt>
						<dd class="hours-wednesday">{{ venueModel.hours.getHoursForDay('wednesday')?.formatHours() }}</dd>

						<dt class="hours-thursday">Thursday</dt>
						<dd class="hours-thursday">{{ venueModel.hours.getHoursForDay('thursday')?.formatHours() }}</dd>

						<dt class="hours-friday">Friday</dt>
						<dd class="hours-friday">{{ venueModel.hours.getHoursForDay('friday')?.formatHours() }}</dd>

						<dt class="hours-saturday">Saturday</dt>
						<dd class="hours-saturday">{{ venueModel.hours.getHoursForDay('saturday')?.formatHours() }}</dd>

						<dt class="hours-sunday">Sunday</dt>
						<dd class="hours-sunday">{{ venueModel.hours.getHoursForDay('sunday')?.formatHours() }}</dd>
					</dl>
				</div>
			</section>

			<section class="actions">
				<div class="inner">
					<a
						class="btn button-tertiary size-small action"
						target="_blank"
						v-bind:href="'tel:' + venueModel.getPhone()"
						v-if="venueModel.getPhone()"
					>
						<i class="icon fa fa-phone"></i>
						<span class="caption">Call</span>
					</a>
					<a
						class="btn button-tertiary size-small action"
						target="_blank"
						v-bind:href="venueModel.getWebsite()"
						v-if="venueModel.getWebsite()"
					>
						<i class="icon fa fa-globe"></i>
						<span class="caption">Website</span>
					</a>
					<a class="btn button-tertiary size-small action" target="_blank" v-bind:href="getMapUrl()" v-if="venueModel.getAddress()">
						<i class="icon fa fa-map-marker"></i>
						<span class="caption">Directions</span>
					</a>
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
	import UserAvatar from '../User/Avatar.vue';
	import VenueGallery from './Gallery.vue';
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
			VenueGallery,
		},
	})
	export default class VenueCard extends ViewBase {
		/**
		 * @type VenueGallery
		 */
		@Ref('gallery')
		protected venueGallery!: VenueGallery;

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
		public venueModel!: ChalkySticks.Model.Venue;

		/**
		 * @return string
		 */
		protected getMapUrl(): string {
			let output: string;

			// Set root url
			output = 'https://www.google.com/maps/place/';

			// Set address
			output += encodeURIComponent(this.venueModel.getAddress());

			return output;
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * DOES NOT WORK
		 *
		 * @return Promise<void>
		 */
		protected async Handle_OnCheckinSuccess(): Promise<void> {
			this.$forceUpdate();
		}

		// endregion: Event Handlers
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

		.venue-gallery + .content {
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

			.action {
				display: inline-block;
				// flex: 1;
				flex-grow: 1;
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

		.venue-gallery {
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
				bottom: 2.5rem;
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
		.chalky.venue-card {
			--chalky-venue-list-thumbnail-size: 60px;
		}
	}
</style>
