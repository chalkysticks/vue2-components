<template>
	<section class="chalky venue-checkins">
		<!-- Users who are checked in -->
		<div class="whos-here-users" v-if="venueModel.checkins.models.length">
			<UserAvatar
				size="sm"
				v-bind:key="index"
				v-bind:userModel="venueCheckinModel.user"
				v-for="(venueCheckinModel, index) in venueModel.checkins"
			/>
		</div>

		<!-- No check-ins yet -->
		<div class="checkin-cta" v-else>
			<!-- Different messaging based on authentication state -->
			<div v-if="$store.getters['authentication/authenticated']">
				<p>Be the first to check in!</p>
			</div>

			<div v-else>
				<p>No one has checked in yet.</p>
			</div>

			<!-- Show special prompt if user appears to be nearby but not logged in -->
			<div class="nearby-prompt" v-if="isNearby && !$store.getters['authentication/authenticated']">
				<p>
					<strong>Are you at {{ venueModel.getName() }}?</strong>
				</p>
				<p>
					<a class="btn button-primary size-small" v-on:click="Handle_OnClickLogin">Log in to check in</a>
				</p>
			</div>
		</div>

		<!-- Current user is already checked in -->
		<div v-if="isCheckedInHere()" class="action checked-in">
			<span class="checked-in-indicator">
				<i class="icon fa fa-check-circle"></i>
				<strong>You are here</strong>
			</span>
		</div>

		<!-- User is authenticated but not checked in -->
		<div class="action" v-else-if="$store.getters['authentication/authenticated']">
			<slot name="checkin:action" v-bind:venueModel="venueModel">
				<ButtonCheckin v-bind:venueModel="venueModel" v-on:checkin="Handle_OnCheckin" />
			</slot>
		</div>

		<!-- User is nearby but not authenticated -->
		<div class="action" v-else-if="isNearby && !$store.getters['authentication/authenticated']">
			<a class="chalky venue-button-login btn button-primary size-small" v-on:click="Handle_OnClickLogin">Log in to check in</a>
		</div>
	</section>
</template>

<script lang="ts">
	import ButtonCheckin from '../Button/Checkin.vue';
	import ChalkySticks from '@chalkysticks/sdk';
	import UserAvatar from '../User/Avatar.vue';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * @author ChalkySticks LLC
	 * @package Venue
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({
		components: {
			ButtonCheckin,
			UserAvatar,
		},
	})
	export default class VenueCheckins extends ViewBase {
		/**
		 * If we're within 0.1 miles of the venue, we consider it "nearby".
		 *
		 * @return boolean
		 */
		public get isNearby(): boolean {
			const myLatitude = this.$store.getters['location/latitude'];
			const myLongitude = this.$store.getters['location/longitude'];
			const distance = this.venueModel.getDistance(myLatitude, myLongitude, 'mi');

			return distance < 0.1;
		}

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

		/**
		 * Handle when user successfully checks in
		 *
		 * @return void
		 */
		protected Handle_OnCheckin(): void {
			this.$emit('checkin:success');
		}

		/**
		 * Handle when user clicks the login button
		 *
		 * @return void
		 */
		protected Handle_OnClickLogin(): void {
			// Emit an event that the parent can listen for to show login modal or redirect
			this.$emit('login:request', {
				intent: 'checkin',
				isNearby: this.isNearby,
				venueId: this.venueModel.id,
				venueName: this.venueModel.getName(),
			});

			// You could also trigger router navigation
			// this.$router.push('/login?redirect=' + encodeURIComponent(window.location.href));
		}
	}
</script>

<style lang="scss">
	.chalky.venue-checkins {
		.inner {
			align-items: center;
			display: flex;
			justify-content: space-between;
		}

		.inner .actions {
			flex-shrink: 1;
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

		.checkin-cta {
			text-align: center;
			margin-bottom: 1rem;

			p {
				margin-bottom: 0.5rem;
			}
		}

		.nearby-prompt {
			margin-top: 1rem;
			padding: 0.75rem;
			background-color: rgba(0, 0, 0, 0.05);
			border-radius: var(--rounded-corner);
		}

		.checked-in-indicator {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			color: var(--chalky-green);

			.icon {
				font-size: 1.2em;
			}
		}
	}
</style>
