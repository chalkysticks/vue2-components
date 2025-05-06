<template>
	<section class="chalky reaction-summary" v-bind:class="{ 'is-horizontal': horizontal }">
		<slot name="before"></slot>

		<header v-if="showHeader">
			<slot name="header">
				<h3>Reactions</h3>
			</slot>
		</header>

		<div v-if="totalReactions === 0" class="empty-state">
			<slot name="empty">
				<p>No reactions yet</p>
			</slot>
		</div>

		<div v-else class="summary-content">
			<!-- Overall reaction count -->
			<div class="total-reactions">
				<slot name="total" v-bind:totalReactions="totalReactions">
					<strong>{{ totalReactions }}</strong>
					{{ totalReactions === 1 ? 'reaction' : 'reactions' }}
				</slot>
			</div>

			<!-- Reaction breakdown -->
			<div class="reaction-breakdown">
				<div class="reaction-item" v-bind:class="`type-${type}`" v-bind:key="type" v-for="(count, type) in filteredReactionCounts">
					<slot v-bind:name="`item-${type}`" v-bind:count="count" v-bind:percentage="getPercentage(count)">
						<div class="reaction-icon">
							<i :class="getIconClass(type)"></i>
						</div>

						<div class="reaction-info">
							<div class="reaction-name">{{ formatReactionName(type) }}</div>

							<div class="reaction-progress-container">
								<div class="reaction-progress" v-bind:style="{ width: `${getPercentage(count)}%` }"></div>
							</div>

							<div class="reaction-count">{{ count }}</div>
						</div>
					</slot>
				</div>
			</div>

			<!-- User reaction status -->
			<div v-if="isAuthenticated && userReaction" class="user-reaction">
				<slot name="user-reaction" v-bind:userReaction="userReaction">
					You reacted with
					<strong>{{ formatReactionName(userReaction) }}</strong>
				</slot>
			</div>
		</div>

		<slot name="after"></slot>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * Summary component to display reaction statistics and breakdowns
	 * for a model. Shows counts and percentages of each reaction type.
	 *
	 * @class ReactionSummary
	 * @package Reaction
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class ReactionSummary extends ViewBase {
		/**
		 * Get whether the user is authenticated
		 * @return boolean
		 */
		public get isAuthenticated(): boolean {
			return this.$store && this.$store.getters['authentication/authenticated'];
		}

		/**
		 * Get counts for each reaction type
		 * @return Record<string, number>
		 */
		public get reactionCounts(): Record<string, number> {
			const counts: Record<string, number> = {};

			if (this.model?.reactions) {
				// Get all reaction types from the model
				const types = Object.keys(this.model.reactions);

				// Filter by specified types if needed
				const filteredTypes = this.reactionTypes.length > 0 ? types.filter((type) => this.reactionTypes.includes(type)) : types;

				// Count each reaction type
				filteredTypes.forEach((type) => {
					counts[type] = this.model.reactions[type]?.length || 0;
				});
			}

			return counts;
		}

		/**
		 * Get reaction counts filtered by threshold
		 * @return Record<string, number>
		 */
		public get filteredReactionCounts(): Record<string, number> {
			const result: Record<string, number> = {};

			// Apply threshold filtering if needed
			if (this.threshold > 0) {
				Object.entries(this.reactionCounts).forEach(([type, count]) => {
					const percentage = this.getPercentage(count);
					if (percentage >= this.threshold) {
						result[type] = count;
					}
				});
				return result;
			}

			return this.reactionCounts;
		}

		/**
		 * Get the current user's reaction type if any
		 * @return string | null
		 */
		public get userReaction(): string | null {
			if (!this.isAuthenticated || !this.model?.reactions) {
				return null;
			}

			const userModel = this.$store.getters['authentication/user'];
			if (!userModel) {
				return null;
			}

			// Check each reaction type to see if user has reacted
			for (const type in this.model.reactions) {
				if (this.model.reactions[type]?.some((reaction: any) => reaction.user_id === userModel.id)) {
					return type;
				}
			}

			return null;
		}

		/**
		 * Get total count of all reactions
		 * @return number
		 */
		public get totalReactions(): number {
			return Object.values(this.reactionCounts).reduce((sum, count) => sum + count, 0);
		}

		/**
		 * Whether to display in horizontal layout
		 * @type boolean
		 */
		@Prop({ default: false })
		public horizontal!: boolean;

		/**
		 * Parent model that the reactions belong to
		 * @type any
		 */
		@Prop({ required: true })
		public model!: any;

		/**
		 * Filter to only show specific reaction types
		 * @type string[]
		 */
		@Prop({ default: () => [] })
		public reactionTypes!: string[];

		/**
		 * Whether to show the header
		 * @type boolean
		 */
		@Prop({ default: true })
		public showHeader!: boolean;

		/**
		 * Minimum percentage to display a reaction type
		 * @type number
		 */
		@Prop({ default: 0 })
		public threshold!: number;

		/**
		 * Format a reaction type name for display
		 * @param reactionType string
		 * @return string
		 */
		protected formatReactionName(reactionType: string): string {
			// First letter uppercase, rest lowercase
			return reactionType.charAt(0).toUpperCase() + reactionType.slice(1).toLowerCase();
		}

		/**
		 * Calculate percentage for a reaction count
		 * @param count number
		 * @return number
		 */
		protected getPercentage(count: number): number {
			if (this.totalReactions === 0) {
				return 0;
			}
			return Math.round((count / this.totalReactions) * 100);
		}

		/**
		 * Get the icon class for a reaction type
		 * @param reactionType string
		 * @return string
		 */
		protected getIconClass(reactionType: string): string {
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

			return iconMap[reactionType] || 'fa fa-star';
		}
	}
</script>

<style lang="scss">
	.chalky.reaction-summary {
		margin: 1rem 0;

		header {
			margin-bottom: 1rem;
		}

		.empty-state {
			color: var(--chalky-grey-2, #999);
			font-style: italic;
			padding: 1rem 0;
			text-align: center;
		}

		.summary-content {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}

		.total-reactions {
			font-size: 1.1em;
			margin-bottom: 0.5rem;
		}

		.reaction-breakdown {
			display: flex;
			flex-direction: column;
			gap: 0.75rem;
		}

		.reaction-item {
			display: flex;
			align-items: center;
			gap: 0.75rem;

			.reaction-icon {
				align-items: center;
				border-radius: 50%;
				display: flex;
				font-size: 1.1em;
				height: 32px;
				justify-content: center;
				width: 32px;
			}

			.reaction-info {
				display: flex;
				flex-grow: 1;
				align-items: center;
				gap: 0.75rem;
			}

			.reaction-name {
				min-width: 60px;
			}

			.reaction-progress-container {
				background-color: var(--chalky-grey-lighter, #f0f0f0);
				border-radius: 4px;
				flex-grow: 1;
				height: 12px;
				overflow: hidden;
				position: relative;
			}

			.reaction-progress {
				border-radius: 4px;
				height: 100%;
				transition: width 0.3s ease;
			}

			.reaction-count {
				font-size: 0.9em;
				min-width: 30px;
				text-align: right;
			}
		}

		.user-reaction {
			border-top: 1px solid var(--chalky-grey-light, #e0e0e0);
			margin-top: 0.5rem;
			padding-top: 1rem;
			font-size: 0.9em;
		}

		// Reaction type variations
		.reaction-item {
			&.type-like {
				.reaction-icon {
					background-color: rgba(0, 119, 204, 0.1);
					color: #0077cc;
				}

				.reaction-progress {
					background-color: #0077cc;
				}
			}

			&.type-love {
				.reaction-icon {
					background-color: rgba(233, 30, 99, 0.1);
					color: #e91e63;
				}

				.reaction-progress {
					background-color: #e91e63;
				}
			}

			&.type-wow {
				.reaction-icon {
					background-color: rgba(255, 152, 0, 0.1);
					color: #ff9800;
				}

				.reaction-progress {
					background-color: #ff9800;
				}
			}

			&.type-laugh {
				.reaction-icon {
					background-color: rgba(255, 235, 59, 0.1);
					color: #ffc107;
				}

				.reaction-progress {
					background-color: #ffc107;
				}
			}

			&.type-sad {
				.reaction-icon {
					background-color: rgba(158, 158, 158, 0.1);
					color: #9e9e9e;
				}

				.reaction-progress {
					background-color: #9e9e9e;
				}
			}

			&.type-angry {
				.reaction-icon {
					background-color: rgba(244, 67, 54, 0.1);
					color: #f44336;
				}

				.reaction-progress {
					background-color: #f44336;
				}
			}

			&.type-dislike {
				.reaction-icon {
					background-color: rgba(97, 97, 97, 0.1);
					color: #616161;
				}

				.reaction-progress {
					background-color: #616161;
				}
			}
		}

		// Horizontal layout
		&.is-horizontal {
			.reaction-breakdown {
				flex-direction: row;
				flex-wrap: wrap;
			}

			.reaction-item {
				flex: 1 1 45%;
				min-width: 180px;
			}
		}
	}

	// Media Queries
	// ---------------------------------------------------------------------------

	@media (max-width: 576px) {
		.chalky.reaction-summary {
			.reaction-item {
				.reaction-info {
					flex-wrap: wrap;
				}

				.reaction-name {
					min-width: 50px;
				}

				.reaction-progress-container {
					flex-basis: 100%;
					order: 3;
					margin-top: 0.25rem;
				}
			}

			&.is-horizontal {
				.reaction-item {
					flex: 1 1 100%;
				}
			}
		}
	}
</style>
