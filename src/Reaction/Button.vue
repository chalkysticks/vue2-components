<template>
	<section class="chalky reaction-button">
		<button
			v-bind:class="[
				'button-secondary',
				'size-x-small',
				`type-${reactionType}`,
				{ 'is-active': model.reactions.hasReaction(reactionType) },
				{ 'is-with-count': showCount && count > 0 },
				size,
			]"
			v-bind:key="model.reactions.uniqueKey"
			v-bind:disabled="isSubmitting"
			v-on:click="Handle_OnClick"
		>
			<slot name="before"></slot>

			<div class="icon-container">
				<slot name="icon">
					<i v-bind:class="iconClass"></i>
				</slot>
			</div>

			<span v-if="showLabel" class="label">
				<slot name="label">
					{{ label }}
				</slot>
			</span>

			<span v-if="showCount && model.reactions[reactionType]" v-bind:key="model.reactions.uniqueKey">
				<slot name="count">
					{{ model.reactions[reactionType].length }}
				</slot>
			</span>

			<slot name="after"></slot>
		</button>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop, Watch } from 'vue-property-decorator';
	import { beforeDestroy, bind, mounted } from '../Utility/Decorators';

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
		 * Get the icon class for this reaction type
		 *
		 * @return string
		 */
		public get iconClass(): string {
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
		 * Get the label for this reaction type
		 *
		 * @return string
		 */
		public get label(): string {
			return ChalkySticks.Utility.String.capitalize(this.reactionType);
		}

		/**
		 * Specific collection for like, love, wow, etc.
		 *
		 * @return ChalkySticks.Collection.Reaction
		 */
		public get reactionCollection(): ChalkySticks.Collection.Reaction {
			return this.model.reactions[this.reactionType];
		}

		/**
		 * Parent model that the reaction belongs to (Venue, User, Content, etc.)
		 *
		 * @type any
		 */
		@Prop({ required: true })
		public model!: any;

		/**
		 * Type of reaction (like, dislike, wow, etc.)
		 *
		 * @type string
		 */
		@Prop({ default: 'like' })
		public reactionType!: string;

		/**
		 * Whether to show the reaction count
		 *
		 * @type boolean
		 */
		@Prop({ default: true })
		public showCount!: boolean;

		/**
		 * Whether to show the reaction label
		 *
		 * @type boolean
		 */
		@Prop({ default: true })
		public showLabel!: boolean;

		/**
		 * Size of the button (sm, md, lg)
		 *
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
		 * @return void
		 */
		@mounted
		public attachEvents(): void {
			this.model.reactions.on('complete', () => {
				console.log('forker face');
				this.$forceUpdate();
			});
		}

		/**
		 * @return void
		 */
		@beforeDestroy
		public detachEvents(): void {
			// Not implemented
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * Click handler for the reaction button
		 * @return Promise<void>
		 */
		protected async Handle_OnClick(): Promise<void> {
			if (this.isSubmitting || !this.$store?.getters['authentication/authenticated']) {
				if (!this.$store?.getters['authentication/authenticated']) {
					this.$emit('login:request');
					ChalkySticks.Core.Event.Bus.dispatch('login:request');
				}

				return;
			}

			this.isSubmitting = true;
			this.$emit('click:start');

			try {
				// Remove reaction
				await this.model.reactions.toggleReaction(this.reactionType);

				this.$emit('click');
			} catch (error) {
				console.error(`Failed to ${this.reactionType} reaction:`, error);
				this.$emit('click:error', error);
			} finally {
				this.isSubmitting = false;
				this.$emit('click:complete');
			}
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.reaction-button {
		button {
			align-items: center;
			cursor: pointer;
			display: inline-flex;
			gap: 0.25rem;
			justify-content: center;
			transition: all 0.2s ease;

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
	}
</style>
