<template>
	<section class="chalky reaction-favorite" v-bind:class="['rounded', { 'state-active': isActive() }]">
		<button v-bind:disabled="isSubmitting" v-bind:key="model.reactions.uniqueKey" v-on:click="Handle_OnClick">
			<span class="icon-container">
				<img src="~@chalkysticks/sass/build/asset/image/icon/heart-fill.svg" class="heart-icon heart-active tint-chalky-red" />
				<img src="~@chalkysticks/sass/build/asset/image/icon/heart-outline.svg" class="heart-icon heart-inactive filter-invert" />
			</span>

			<span v-if="showLabel" class="label">
				<slot name="label">Favorite</slot>
			</span>
		</button>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * Favorite (Love/Heart) reaction button
	 *
	 * @class ReactionFavorite
	 * @package Reaction
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class ReactionFavorite extends ViewBase {
		/**
		 * Parent model that the reaction belongs to (Venue, User, Content, etc.)
		 * @type any
		 */
		@Prop({ required: true })
		public model!: any;

		/**
		 * Whether to show the reaction label
		 * @type boolean
		 */
		@Prop({ default: false })
		public showLabel!: boolean;

		/**
		 * Size of the button (sm, md, lg)
		 * @type string
		 */
		@Prop({ default: 'lg' })
		public size!: string;

		/**
		 * Whether the button is currently submitting a reaction
		 * @type boolean
		 */
		protected isSubmitting: boolean = false;

		/**
		 * Whether the current user has favorited (loved) this item
		 * @return boolean
		 */
		protected isActive(): boolean {
			return this.model.reactions.hasReaction(ChalkySticks.Enum.ReactionType.Love);
		}

		/**
		 * Click handler for the favorite button
		 * @return Promise<void>
		 */
		protected async Handle_OnClick(): Promise<void> {
			if (this.isSubmitting || !this.$store?.getters['authentication/authenticated']) {
				if (!this.$store?.getters['authentication/authenticated']) {
					this.$emit('unauthenticated');
				}
				return;
			}

			this.isSubmitting = true;

			try {
				this.isActive() ? await this.model.reactions.unfavorite() : await this.model.reactions.favorite();

				console.log(this.model.reactions);

				this.$forceUpdate();
			} catch (error) {
				console.error('Failed to favorite reaction:', error);
			} finally {
				this.isSubmitting = false;
			}
		}
	}
</script>

<style lang="scss">
	.chalky.reaction-favorite {
		--size: 2rem;

		button {
			align-items: center;
			background-color: transparent;
			cursor: pointer;
			display: inline-flex;
			gap: 0.5rem;
			justify-content: center;
			padding: 1em;
			transition: all 0.2s ease;

			&:disabled {
				cursor: not-allowed;
				opacity: 0.7;
			}
		}

		.heart-icon {
			height: var(--size);
			transition: transform 0.18s cubic-bezier(0.4, 0, 0.2, 1);
			vertical-align: middle;
			width: var(--size);
		}
	}

	// State
	// ---------------------------------------------------------------------------

	.chalky.reaction-favorite:not(.state-active) .heart-active,
	.chalky.reaction-favorite.state-active .heart-inactive {
		display: none;
	}
</style>
