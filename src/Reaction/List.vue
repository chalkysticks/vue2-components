<template>
	<section class="chalky reaction-list" :class="[`layout-${layout}`, { 'is-compact': compact }]">
		<slot name="before"></slot>

		<div class="reaction-buttons">
			<slot name="buttons" :availableReactions="availableReactions" :model="model">
				<div class="reaction-button-container" v-bind:key="reactionType" v-for="reactionType in availableReactions">
					<ReactionButton
						v-bind:model="model"
						v-bind:reactionType="reactionType"
						v-bind:showCount="showCount"
						v-bind:showLabel="showLabels"
						v-bind:size="size"
						v-on:click:complete="$emit('reaction:complete', reactionType)"
						v-on:click:error="$emit('reaction:error', reactionType, $event)"
						v-on:click:start="$emit('reaction:start', reactionType)"
						v-on:click:success="$emit('reaction:success', reactionType)"
						v-on:react="$emit('react', reactionType)"
						v-on:unauthenticated="$emit('unauthenticated')"
						v-on:unreact="$emit('unreact', reactionType)"
					>
						<template v-slot:label>
							<slot :name="`label-${reactionType}`">
								{{ formatReactionLabel(reactionType) }}
							</slot>
						</template>
					</ReactionButton>
				</div>
			</slot>
		</div>

		<!-- Summary of reactions (optional) -->
		<div v-if="showSummary && totalReactions > 0" class="reaction-summary">
			<slot name="summary" v-bind:totalReactions="totalReactions" v-bind:reactionCounts="reactionCounts">
				<div class="reaction-icons">
					<div class="reaction-icon" v-bind:class="`type-${type}`" v-bind:key="type" v-for="(count, type) in reactionCounts">
						<i v-bind:class="getIconClass(type)"></i>
					</div>
				</div>
				<div class="reaction-text">
					{{ formatSummaryText() }}
				</div>
			</slot>
		</div>

		<slot name="after"></slot>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ReactionButton from './Button.vue';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * Reaction list component that displays a set of reaction buttons
	 * and summarizes reactions for a model.
	 *
	 * @class ReactionList
	 * @package Reaction
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({
		components: {
			ReactionButton,
		},
	})
	export default class ReactionList extends ViewBase {
		/**
		 * Get the available reaction types
		 * @return string[]
		 */
		public get availableReactions(): string[] {
			return this.reactions;
		}

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
				this.availableReactions.forEach((type) => {
					counts[type] = this.model.reactions[type]?.length || 0;
				});
			}

			return counts;
		}

		/**
		 * Get total count of all reactions
		 * @return number
		 */
		public get totalReactions(): number {
			return Object.values(this.reactionCounts).reduce((sum, count) => sum + count, 0);
		}

		/**
		 * Whether to show compact buttons without labels
		 * @type boolean
		 */
		@Prop({ default: false })
		public compact!: boolean;

		/**
		 * Layout style (horizontal, vertical)
		 * @type string
		 */
		@Prop({ default: 'horizontal' })
		public layout!: 'horizontal' | 'vertical';

		/**
		 * Parent model that the reactions belong to (Venue, User, Content, etc.)
		 * @type any
		 */
		@Prop({ required: true })
		public model!: any;

		/**
		 * List of reaction types to display
		 *
		 * @type string[]
		 */
		@Prop({
			default: () => ['like', 'dislike', 'wow'],
		})
		public reactions!: string[];

		/**
		 * Whether to show count badges on buttons
		 * @type boolean
		 */
		@Prop({ default: true })
		public showCount!: boolean;

		/**
		 * Whether to show labels on buttons
		 * @type boolean
		 */
		@Prop({ default: true })
		public showLabels!: boolean;

		/**
		 * Whether to show login prompt for unauthenticated users
		 * @type boolean
		 */
		@Prop({ default: true })
		public showLoginPrompt!: boolean;

		/**
		 * Whether to show a summary of reactions
		 * @type boolean
		 */
		@Prop({ default: true })
		public showSummary!: boolean;

		/**
		 * Size of reaction buttons (sm, md, lg)
		 * @type string
		 */
		@Prop({ default: 'md' })
		public size!: string;

		/**
		 * Format a reaction label for display
		 * @param reactionType string
		 * @return string
		 */
		public formatReactionLabel(reactionType: string): string {
			// First letter uppercase, rest lowercase
			return reactionType.charAt(0).toUpperCase() + reactionType.slice(1).toLowerCase();
		}

		/**
		 * Format the summary text based on reaction counts
		 * @return string
		 */
		public formatSummaryText(): string {
			const userModel = this.$store?.getters['authentication/user'];
			let text = '';

			if (this.totalReactions === 0) {
				return 'No reactions yet';
			}

			// const hasReacted = Object.entries(this.reactionCounts).some(([type, count]) => {
			// 	return count > 0 && this.model.reactions[type].some((reaction: any) => reaction.user_id === userModel?.id);
			// });

			// let text = '';

			// if (hasReacted) {
			// 	text = 'You and ';

			// 	if (this.totalReactions === 1) {
			// 		text = 'You reacted to this';
			// 		return text;
			// 	}

			// 	text += `${this.totalReactions - 1} other${this.totalReactions > 2 ? 's' : ''}`;
			// } else {
			// 	text = `${this.totalReactions} ${this.totalReactions === 1 ? 'person' : 'people'}`;
			// }

			return `${text} reacted to this`;
		}

		/**
		 * Get the icon class for a reaction type
		 *
		 * @param reactionType string
		 * @return string
		 */
		public getIconClass(reactionType: string): string {
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
	.chalky.reaction-list {
		margin: 1rem 0;

		.reaction-buttons {
			display: flex;
			flex-wrap: wrap;
			gap: 0.5rem;
		}

		.reaction-summary {
			align-items: center;
			display: flex;
			font-size: 0.9em;
			gap: 0.5rem;
			margin-top: 0.75rem;

			.reaction-icons {
				display: flex;
				margin-right: 0.25rem;

				.reaction-icon {
					align-items: center;
					border-radius: 50%;
					border: 2px solid white;
					display: flex;
					height: 24px;
					justify-content: center;
					margin-left: -8px;
					width: 24px;

					&:first-child {
						margin-left: 0;
					}

					&.type-like {
						background-color: #0077cc;
						color: white;
					}

					&.type-love {
						background-color: #e91e63;
						color: white;
					}

					&.type-wow {
						background-color: #ff9800;
						color: white;
					}

					&.type-laugh {
						background-color: #ffeb3b;
						color: #333;
					}

					&.type-sad {
						background-color: #9e9e9e;
						color: white;
					}

					&.type-angry {
						background-color: #f44336;
						color: white;
					}
				}
			}

			.reaction-text {
				color: var(--chalky-grey-2, #999);
			}
		}

		.login-prompt {
			margin-top: 0.75rem;
			font-size: 0.9em;
			text-align: center;

			a {
				color: var(--chalky-blue, #0077cc);
				text-decoration: none;

				&:hover {
					text-decoration: underline;
				}
			}
		}

		// Layout variations
		&.layout-vertical {
			.reaction-buttons {
				flex-direction: column;
			}
		}

		// Compact mode
		&.is-compact {
			.reaction-buttons {
				.chalky.reaction-button {
					.label {
						display: none;
					}
				}
			}
		}
	}

	// Media Queries
	// ---------------------------------------------------------------------------

	@media (max-width: 576px) {
		.chalky.reaction-list {
			.reaction-summary {
				flex-direction: column;
				align-items: flex-start;
			}
		}
	}
</style>
