<template>
	<section class="chalky form-search">
		<form class="glass-panel shadow-xl border-blue" v-on:submit="Handle_OnSubmit">
			<i class="branding-chalky-badge size-sm"></i>

			<label>
				<input type="text" v-bind:placeholder="placeholder" v-model="query" />
			</label>
		</form>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import Router from '../Core/Router';
	import ViewBase from '../Core/Base';
	import { Component, Prop, Watch } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package Form
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class FormSearch extends ViewBase {
		/**
		 * @type ChalkySticks/Model/Geocode
		 */
		@Prop({
			default: () => ChalkySticks.Factory.Geocode.model(),
		})
		public geocodeModel!: ChalkySticks.Model.Geocode;

		/**
		 * @type string
		 */
		@Prop({ default: 'New York, NY' })
		public placeholder!: string;

		/**
		 * @type string
		 */
		public query: string = '';

		/**
		 * @type string
		 */
		@Prop({ default: '' })
		public queryParameter!: string;

		/**
		 * @type string
		 */
		@Prop({ default: 'location' })
		public type!: 'location' | 'venue';

		/**
		 * @type ChalkySticks/Collection/Venue
		 */
		@Prop({
			default: () => ChalkySticks.Factory.Venue.collection(),
		})
		public venueCollection!: ChalkySticks.Collection.Venue;

		/**
		 * @param string query
		 * @return Promise<void>
		 */
		public async search(query: string): Promise<void> {
			switch (this.type) {
				case 'location':
					await this.searchLocation(this.query);
					break;

				case 'venue':
					await this.searchVenue(this.query);
					break;
			}
		}

		/**
		 * @return Promise<void>
		 */
		public async searchLocation(query: string): Promise<void> {
			// Fetch coordinates
			await this.geocodeModel.setQueryParam('address', this.query).fetch();

			// Emit model
			this.$emit('search:location', this.geocodeModel);
		}

		/**
		 * @return Promise<void>
		 */
		public async searchVenue(query: string): Promise<void> {
			await this.venueCollection.setQueryParam('q', query).fetch();

			// Emit model
			this.$emit('search:venue', this.venueCollection);
		}

		/**
		 * @param SubmitEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnSubmit(e: SubmitEvent): Promise<void> {
			e.preventDefault();

			// Wait to hear back from the query string
			if (this.queryParameter) {
				Router.router.push({
					query: {
						[this.queryParameter]: this.query,
					},
				});
			}

			// Search directly using search
			else {
				this.search(this.query);
			}
		}

		/**
		 * @param Event e
		 * @return Promise<void>
		 */
		@Watch('$route.query', {
			deep: true,
			immediate: true,
		})
		protected async Handle_OnRouteChange(newQuery: any, oldQuery: any): Promise<void> {
			if (!this.queryParameter) {
				return;
			}

			// Get the new query value
			const newQueryValue = newQuery[this.queryParameter];

			// No query available
			if (!newQueryValue) {
				return;
			}

			// Search if the route changes
			this.query = newQueryValue;
			this.search(this.query);
		}
	}
</script>

<style lang="scss">
	.form-search {
		left: 0.5rem;
		right: 0.5rem;
		// position: absolute;
		z-index: var(--z-page-mid);

		form {
			align-items: center;
			border-radius: var(--rounded-corner);
			border: 1px solid var(--chalky-grey);
			display: flex;
			gap: 0.25rem;
			justify-content: center;
			padding: 0.5em;

			label {
				margin: 0;
			}

			input {
				color: var(--chalky-blue);
				background: transparent;
				border: 0;
				height: 100%;
				font-size: 1.25rem;
				font-weight: var(--font-weight-medium) !important;
				outline: none;
				width: 100%;

				&::placeholder {
					color: var(--chalky-grey-2);
				}
			}
		}

		.glass-panel {
			backdrop-filter: blur(4px);
		}
	}

	// State
	// ---------------------------------------------------------------------------

	.form-search form:focus,
	.form-search form:focus-within,
	.form-search form:active {
		border: 1px solid var(--chalky-blue);
	}

	.form-search form input:active,
	.form-search form input:focus {
		outline: none;
	}
</style>
