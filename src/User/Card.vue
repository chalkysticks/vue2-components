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
					<div class="game" v-bind:class="['game-' + game.getKey()]" v-bind:key="game.id" v-for="game in userModel.games">
						{{ game.getValue() }}
					</div>
				</div>
			</section>

			<slot name="content:after"></slot>
		</section>

		<section class="favorites-venues" v-if="userModel.id">
			<header>
				<h3>Favorite Venues</h3>
			</header>

			<section>
				<ChalkyVenueList
					class="horizontal"
					v-bind:key="favoriteCollection.uniqueKey"
					v-bind:useLocation="true"
					v-bind:venueCollection="favoriteCollection"
					v-if="favoriteCollection.length"
					v-on:venue:select="Handle_OnSelectVenue"
				/>

				<section v-else>This user has not favorited anything yet.</section>
			</section>
		</section>

		<section class="recent-checkins" v-if="userModel.id">
			<header>
				<h3>Recent Checkins</h3>
			</header>

			<section>
				<ChalkyVenueList
					class="horizontal"
					v-bind:key="venueCollection.uniqueKey"
					v-bind:useLocation="true"
					v-bind:venueCollection="venueCollection"
					v-if="venueCollection.length"
					v-on:venue:select="Handle_OnSelectVenue"
				/>

				<section v-else>This user has not checked in anywhere.</section>
			</section>
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
	import { Component, Prop, Ref, Watch } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '../Utility/Decorators';

	/**
	 * @class UserCard
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
	export default class UserCard extends ViewBase {
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
		 * @type ChalkySticks/Model/User
		 */
		@Prop({
			default: () => ChalkySticks.Factory.User.model(),
		})
		public userModel!: ChalkySticks.Model.User;

		/**
		 * @type ChalkySticks/Model/Venue
		 */
		@Prop({
			default: () =>
				ChalkySticks.Factory.Venue.collection({
					limit: 8,
					qp: {
						reaction: ChalkySticks.Enum.ReactionType.Love,
						reaction_from: '',
					},
				}),
		})
		public favoriteCollection!: ChalkySticks.Collection.Venue;

		/**
		 * @type ChalkySticks/Collection/Venue
		 */
		@Prop({
			default: () => ChalkySticks.Factory.Venue.collection(),
		})
		public venueCollection!: ChalkySticks.Collection.Venue;

		/**
		 * @type ChalkySticks/Collection/VenueCheckin
		 */
		@Prop({
			default: () => new ChalkySticks.Collection.VenueCheckin({ limit: 8 }),
		})
		public venueCheckinCollection!: ChalkySticks.Collection.VenueCheckin;

		/**
		 * @return void
		 */
		@mounted
		public attachEvents(): void {
			this.venueCheckinCollection.on('complete', this.Handle_OnVenueCheckinCollectionComplete);
		}

		/**
		 * @return void
		 */
		@beforeDestroy
		public detachEvents(): void {
			this.venueCheckinCollection.off('complete', this.Handle_OnVenueCheckinCollectionComplete);
		}

		/**
		 * @return Promise<void>
		 */
		@mounted
		protected async setup(): Promise<void> {
			if (!this.userModel.id) {
				return;
			}

			// Get favorites for a user
			this.favoriteCollection.setQueryParam('reaction_from', this.userModel.id);
			this.favoriteCollection.setQueryParam('limit', '8');
			this.favoriteCollection.fetch();

			// Get recent checkins for a user
			this.venueCheckinCollection.setQueryParam('user_id', this.userModel.id);
			this.venueCheckinCollection.setQueryParam('limit', '8');
			this.venueCheckinCollection.fetch();
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnUserLoaded(): Promise<void> {
			this.setup();
		}

		/**
		 * @param ChalkySticks.Model.Venue venueModel
		 * @return Promise<void>
		 */
		protected async Handle_OnSelectVenue(venueModel: ChalkySticks.Model.Venue): Promise<void> {
			console.log('Select venue', venueModel);
		}

		/**
		 * Listen for changes on the user ID prop and re-fetch data if it changes.
		 *
		 * @return Promise<void>
		 */
		@Watch('userModel.id')
		protected async Handle_OnUserIdChange(): Promise<void> {
			if (!this.userModel.id) {
				return;
			}

			this.setup();
		}

		/**
		 * @param ChalkySticks.Model.Venue venueModel
		 * @return Promise<void>
		 */
		protected async Handle_OnVenueCheckinCollectionComplete(): Promise<void> {
			this.venueCollection.clear();

			this.venueCheckinCollection.each((venueCheckinModel: ChalkySticks.Model.VenueCheckin) => {
				this.venueCollection.add(venueCheckinModel.venue);
			});
		}

		// endregion: Event Handlers
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

		// Main content area
		.content {
			border-radius: var(--chalky-user-card-content-border-radius);
			background: rgba(255, 255, 255, 0.75);
			border-top-left-radius: 0;
			border-top-right-radius: 0;
			color: var(--chalky-blue);
			margin-bottom: 1rem;
			padding: 1rem;

			&:empty {
				display: none;
			}
		}

		.title {
			margin-bottom: 0.5rem;

			.inner {
				max-width: 70%;
			}

			.name {
				font-size: var(--chalky-user-card-title, 1.3rem);
				font-weight: bold;
			}
		}

		.bio,
		.hometown,
		.talent-level,
		.wallet {
			margin-bottom: 0.5rem;

			.inner {
				font-size: 1rem;
				color: #555;
			}
		}

		.games-played {
			margin-bottom: 1rem;

			.inner {
				display: flex;
				flex-wrap: wrap;
				gap: 0.5rem;

				.game {
					background: #f2f2f2;
					border-radius: 8px;
					padding: 0.2rem 0.7rem;
					font-size: 0.95rem;
				}
			}
		}

		.favorites-venues,
		.recent-checkins {
			margin-bottom: 1.5rem;

			.horizontal {
				margin-top: 0.5rem;
			}
		}

		// Gallery styles
		.utility-gallery {
			margin-bottom: 1rem;
		}

		// Responsive adjustments
		@container (min-width: 400px) {
			--chalky-user-list-thumbnail-size: 60px;
		}
	}

	// List item variant
	.chalky.user-card.list-item {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-rows: auto auto auto;
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

				.name {
					font-size: var(--chalky-user-list-title-font-size);
				}

				.inner {
					max-width: 70%;
				}
			}
		}
	}
</style>
