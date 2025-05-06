<template>
	<button
		class="chalky reaction-button"
		v-bind:class="[`type-${reactionType}`, { 'is-active': isReacted }, { 'is-with-count': showCount && count > 0 }, size]"
		v-bind:disabled="isSubmitting"
		v-on:click="Handle_OnClick"
	>
		<slot name="before"></slot>

		<div class="icon-container">
			<slot name="icon">
				<i :class="iconClass"></i>
			</slot>
		</div>

		<span v-if="showLabel" class="label">
			<slot name="label">
				{{ label }}
			</slot>
		</span>

		<span v-if="showCount && count > 0" class="count">
			<slot name="count">
				{{ count }}
			</slot>
		</span>

		<slot name="after"></slot>
	</button>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop, Watch } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '../Utility/Decorators';

	/**
	 * Reaction button component that allows users to react to content
	 * with different reaction types (like, dislike, etc.)
	 *
	 * @class ReactionButton
	 * @package Reaction
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class ReactionButton extends ViewBase {
		/**
		 * Get the count of this reaction type
		 * @return number
		 */
		public get count(): number {
			return this.model?.reactions?.[this.reactionType]?.length || 0;
		}

		/**
		 * Get the icon class for this reaction type
		 * @return string
		 */
		public get iconClass(): string {
			// Default icons based on reaction type
			const iconMap: { [key: string]: string } = {
				angry: 'fa fa-angry',
				dislike: 'fa fa-thumbs-down',
				laugh: 'fa fa-laugh',
				like: 'fa fa-thumbs-up',
				love: 'fa fa-heart',
				sad: 'fa fa-sad-tear',
				wow: 'fa fa-surprise',
			};

			return iconMap[this.reactionType] || 'fa fa-star';
		}

		/**
		 * Check if the current user has reacted with this reaction type
		 * @return boolean
		 */
		public get isReacted(): boolean {
			const userModel = this.$store?.getters['authentication/user'];

			if (!userModel || !this.model?.reactions?.[this.reactionType]) {
				return false;
			}

			return this.model.reactions[this.reactionType].some((reaction: any) => reaction.user_id === userModel.id);
		}

		/**
		 * Get the label for this reaction type
		 * @return string
		 */
		public get label(): string {
			return this.reactionType.charAt(0).toUpperCase() + this.reactionType.slice(1).toLowerCase();
		}

		/**
		 * Parent model that the reaction belongs to (Venue, User, Content, etc.)
		 * @type any
		 */
		@Prop({ required: true })
		public model!: any;

		/**
		 * Type of reaction (like, dislike, wow, etc.)
		 * @type string
		 */
		@Prop({ default: 'like' })
		public reactionType!: string;

		/**
		 * Whether to show the reaction count
		 * @type boolean
		 */
		@Prop({ default: true })
		public showCount!: boolean;

		/**
		 * Whether to show the reaction label
		 * @type boolean
		 */
		@Prop({ default: true })
		public showLabel!: boolean;

		/**
		 * Size of the button (sm, md, lg)
		 * @type string
		 */
		@Prop({ default: 'md' })
		public size!: string;

		/**
		 * Whether the button is currently submitting a reaction
		 * @type boolean
		 */
		protected isSubmitting: boolean = false;

		/**
		 * Click handler for the reaction button
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
			this.$emit('click:start');

			try {
				// Remove reaction
				if (this.isReacted) {
					await this.model.removeReaction(this.reactionType);
					this.$emit('unreact', this.reactionType);
				}

				// Add reaction
				else {
					await this.model.addReaction(this.reactionType);
					this.$emit('react', this.reactionType);
				}

				this.$emit('click:success');
			} catch (error) {
				console.error(`Failed to ${this.isReacted ? 'remove' : 'add'} ${this.reactionType} reaction:`, error);
				this.$emit('click:error', error);
			} finally {
				this.isSubmitting = false;
				this.$emit('click:complete');
			}
		}
	}
</script>

<style lang="scss">
	.chalky.reaction-button {
		align-items: center;
		background-color: var(--chalky-grey-lighter, #f5f5f5);
		border-radius: 4px;
		border: 1px solid var(--chalky-grey-light, #e0e0e0);
		cursor: pointer;
		display: inline-flex;
		font-size: 14px;
		gap: 0.25rem;
		justify-content: center;
		padding: 0.5rem 0.75rem;
		transition: all 0.2s ease;

		&:hover {
			background-color: var(--chalky-grey-light, #e0e0e0);
		}

		&:disabled {
			cursor: not-allowed;
			opacity: 0.7;
		}

		&.is-active {
			background-color: var(--chalky-blue-light, #e6f2ff);
			border-color: var(--chalky-blue, #0077cc);
			color: var(--chalky-blue, #0077cc);
		}

		&.is-with-count {
			.count {
				background-color: rgba(0, 0, 0, 0.1);
				border-radius: 4px;
				font-size: 0.85em;
				font-weight: bold;
				margin-left: 0.25rem;
				padding: 0.1rem 0.35rem;
			}
		}

		// Reaction type variations
		&.type-like {
			&.is-active {
				color: #0077cc;
			}
		}

		&.type-love {
			&.is-active {
				color: #e91e63;
			}
		}

		&.type-wow {
			&.is-active {
				color: #ff9800;
			}
		}

		&.type-laugh {
			&.is-active {
				color: #ffeb3b;
			}
		}

		&.type-sad {
			&.is-active {
				color: #9e9e9e;
			}
		}

		&.type-angry {
			&.is-active {
				color: #f44336;
			}
		}
	}

	// Media Queries
	// ---------------------------------------------------------------------------

	@media (max-width: 576px) {
		.chalky.reaction-button {
			&.sm {
				font-size: 11px;
				padding: 0.25rem 0.4rem;
			}

			&.md {
				font-size: 13px;
				padding: 0.4rem 0.6rem;
			}

			&.lg {
				font-size: 15px;
				padding: 0.6rem 0.8rem;
			}
		}
	}
</style>
