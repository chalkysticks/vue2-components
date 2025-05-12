<template>
	<div
		class="chalky user-list"
		v-bind:class="{
			'state-loading': userCollection.models.length == 0 || userCollection.loading,
		}"
	>
		<section class="list" v-bind:key="userCollection.models.length">
			<slot name="before-list"></slot>

			<UserCard
				class="list-item type-minimal"
				v-bind:class="{ 'state-selected': userModel.id == selectedUserId }"
				v-bind:interactiveGallery="false"
				v-bind:key="userModel.id"
				v-bind:userModel="userModel"
				v-for="userModel in userCollection"
				v-on:click.native="Handle_OnClickUser($event, userModel)"
			>
				<!-- Pass through slots from parent to UserCard -->
				<template v-slot:before>
					<slot name="user-before" v-bind:userModel="userModel"></slot>
				</template>

				<template v-slot:content:before>
					<slot name="user-content-before" v-bind:userModel="userModel"></slot>
				</template>

				<template v-slot:content:after>
					<slot name="user-content-after" v-bind:userModel="userModel"></slot>
				</template>

				<template v-slot:after>
					<slot name="user-after" v-bind:userModel="userModel"></slot>
				</template>
			</UserCard>

			<slot name="after-list"></slot>
		</section>

		<slot name="actions">
			<footer class="actions" v-if="includeActions">
				<button v-on:click="Handle_OnClickPrevious">Previous</button>
				<button v-on:click="Handle_OnClickNext">Next</button>
			</footer>
		</slot>
	</div>
</template>

<script lang="ts">
	import * as UtilityMap from '../Utility/Map';
	import ChalkySticks from '@chalkysticks/sdk';
	import UserCard from './Card.vue';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { created, mounted } from '../Utility/Decorators';

	/**
	 * @class UserList
	 * @package User
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({
		components: {
			UserCard,
		},
	})
	export default class UserList extends ViewBase {
		/**
		 * Function names to bind to class, typically used for event handlers
		 *
		 * @type string[]
		 */
		public bindings: string[] = ['Handle_OnLocationChange'];

		/**
		 * @type boolean
		 */
		@Prop({ default: false })
		public includeActions!: boolean;

		/**
		 * @type number
		 */
		@Prop({ default: 0 })
		public selectedUserId!: number;

		/**
		 * @type boolean
		 */
		@Prop({ default: false })
		public useLocation!: boolean;

		/**
		 * @type ChalkySticks/Collection/User
		 */
		@Prop({
			default: () => ChalkySticks.Factory.User.collection(),
		})
		public userCollection!: ChalkySticks.Collection.User;

		/**
		 * @constructor
		 */
		@mounted
		public afterCreate() {
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
		protected async Handle_OnClickNext(e: MouseEvent): Promise<void> {
			e.preventDefault();

			this.userCollection.fetchNext();

			this.$emit('next');
		}

		/**
		 * @param MouseEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickPrevious(e: MouseEvent): Promise<void> {
			e.preventDefault();

			this.userCollection.fetchPrevious();

			this.$emit('previous');
		}

		/**
		 * @param PointerEvent e
		 * @param ChalkySticks.Model.User userModel
		 * @return Promise<void>
		 */
		protected async Handle_OnClickUser(e: PointerEvent, userModel: ChalkySticks.Model.User): Promise<void> {
			e.preventDefault();

			this.$emit('user:select', userModel);
		}

		/**
		 * This is ignored if we don't pass useLocation
		 *
		 * @param MouseEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnLocationChange(e: ChalkySticks.Core.Event.IDispatcherEvent<ChalkySticks.Core.IGeolocationPayload>): Promise<void> {
			// Don't sync to global location
			if (!this.useLocation) {
				return;
			}

			// Simplify coordinates
			const coordinates = ChalkySticks.Utility.Geolocation.simplifyCoordinates(e.data.position.coords, undefined, 1e2);

			// Update query parameters
			this.userCollection.setQueryParams(coordinates);
			this.userCollection.fetch();
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.user-list {
		--chalky-utility-gallery-border-radius: 0.25em;
		--chalky-user-list-address-font-size: 0.875em;
		--chalky-user-list-checkin-avatar-size: 30px;
		--chalky-user-list-thumbnail-size: 2.5em;
		--chalky-user-list-title-font-size: 1em;

		display: flex;
		flex-direction: column;
		gap: 1rem;
		height: 100%;
		justify-content: center;

		.list {
			background-color: var(--chalky-white);
			height: 100%;
			overflow: auto;
			padding: 1rem;

			.user-card {
				transition: opacity 0.5s ease-in-out;
			}

			.chalky.user-card .content {
				background: transparent;
			}

			.glass-panel {
				background: transparent;
			}

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

	// Variations
	// ---------------------------------------------------------------------------

	.chalky.user-list.horizontal {
		--chalky-user-list-thumbnail-size: 150px;

		.list {
			-webkit-overflow-scrolling: touch;
			align-items: center;
			background-color: transparent;
			display: flex;
			gap: 0.75em;
			overflow-x: auto;
			padding: 0 var(--padding);
			scrollbar-width: thin;

			> * {
				margin-bottom: 0;

				&::after {
					display: none;
				}
			}
		}

		.user-card {
			background: transparent;
			display: flex;
			flex-direction: column;
			flex: 0 0 auto;
			grid-template-columns: 1fr;
			margin: 0;
			white-space: nowrap;
			width: calc(var(--chalky-user-list-thumbnail-size) * 1.5);

			.gallery {
				background-color: transparent;
				margin: 0;
			}

			.content {
				background: transparent;
				padding: 0;
			}

			.title {
				margin-bottom: 0.5rem;
				padding: 0.5rem 0;

				.name {
					color: var(--chalky-grey-2);
					font-size: var(--font-size-small);
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}

			.distance {
				bottom: 0.5rem;
				color: var(--chalky-grey-3);
				flex-direction: row;
				font-size: var(--font-size-x-small);
				margin-bottom: 0.5rem;
				top: auto;
				transform: none;

				.icon {
					width: 10px;
				}
			}

			.checkins {
				bottom: 25%;
				left: 0.5rem;
				position: absolute;
				right: 0.5rem;
			}

			.confirmed,
			.address,
			.details,
			.description,
			.actions {
				display: none;
			}
		}

		.actions {
			display: none;
		}
	}

	// Variations
	// ---------------------------------------------------------------------------

	.chalky.user-list.variation-compact {
		--chalky-user-gallery-border-radius: 0.25em;
		--chalky-user-list-address-font-size: 0.875em;
		--chalky-user-list-checkin-avatar-size: 30px;
		--chalky-user-list-thumbnail-size: 2.5em;
		--chalky-user-list-title-font-size: 1em;

		.content {
			column-gap: 1rem;
			display: grid;
			grid-template-columns: 1fr auto;
			grid-template-rows: auto auto;
			grid-template-areas:
				'title checkins'
				'address checkins';
		}

		.user-card {
			grid-column-gap: 0.75rem;
			margin-bottom: 0.5em;

			.address {
				margin-top: -0.25em;
				opacity: 0.85;
			}

			.confirmed,
			.user-gallery,
			.distance {
				display: none;
			}

			.content {
				padding: 0;
			}
		}
	}

	.chalky.user-list.variation-small {
		--chalky-user-gallery-border-radius: 0.25em;
		--chalky-user-list-address-font-size: 0.875em;
		--chalky-user-list-checkin-avatar-size: 30px;
		--chalky-user-list-thumbnail-size: 2.5em;
		--chalky-user-list-title-font-size: 1em;
		--chalky-reaction-favorite-padding: 0.25em;
		--chalky-reaction-favorite-size: 1.5em;

		.content {
			column-gap: 1rem;
			display: grid;
			grid-template-columns: 1fr auto;
			grid-template-rows: auto auto;
			grid-template-areas:
				'title reactions'
				'address reactions';
		}

		.checkins,
		.open-closed,
		.distance {
			display: none;
		}

		.reactions {
			display: block;
			text-align: right;

			.reaction-list,
			.reaction-summary {
				display: none;
			}
		}
	}

	.chalky.user-list.variation-normal {
		.content {
			column-gap: 1rem;
			display: grid;
			grid-template-columns: 1fr auto;
			grid-template-rows: auto auto;
			grid-template-areas:
				'title checkins'
				'address checkins';
		}

		.distance {
			display: none;
		}

		.open-closed {
			height: 100%;
			left: 0;
			padding: 0;
			right: auto;
			top: 0;

			.badge {
				align-items: center;
				border-radius: 0;
				display: flex;
				height: 100%;
				margin: 0;
				top: 0;
			}

			.is-open {
				display: none;
			}
		}
	}

	// State
	// ---------------------------------------------------------------------------

	.chalky.user-list.state-loading {
		.list {
			background: url('~@chalkysticks/sass/build/asset/image/loader/triangle-white-light.svg') no-repeat center center;
		}

		.user-card {
			opacity: 0;
		}
	}
</style>
