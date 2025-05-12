<template>
	<section class="chalky comment-list" v-bind:class="['direction-' + direction]" v-bind:style="{ maxHeight: maxHeight }">
		<slot name="before"></slot>

		<header v-if="showHeader" v-bind:key="model.comments.uniqueKey">
			<slot name="header">
				<h3>Comments ({{ model.comments.length }})</h3>
			</slot>
		</header>

		<section class="comment-container" v-bind:key="model.comments.uniqueKey">
			<!-- Loading spinner when fetching comments -->
			<div class="loading" v-if="isLoading">
				<slot name="loading">
					<UtilityDots />
				</slot>
			</div>

			<!-- Empty state when no comments -->
			<div class="empty-state" v-else-if="!model.comments.length">
				<slot name="empty">
					<p>No comments yet. Be the first to comment!</p>
				</slot>
			</div>

			<!-- Comment list -->
			<div class="comments" v-else>
				<slot name="comments:before"></slot>

				<CommentItem
					v-bind:commentModel="commentModel"
					v-bind:key="commentModel.id"
					v-for="commentModel in model.comments.models"
					v-on:delete="Handle_OnDeleteSuccess"
					v-on:reply="Handle_OnCommentSuccess"
				/>

				<slot name="comments:after"></slot>
			</div>
		</section>

		<section v-if="showCommentForm && isAuthenticated" class="main-comment-form">
			<slot name="comment-form">
				<CommentForm v-bind:contextModel="model" v-on:submit:error="$emit('comment:error', $event)" v-on:submit="Handle_OnCommentSuccess" />
			</slot>
		</section>

		<section v-else-if="showCommentForm && !isAuthenticated" class="login-prompt">
			<slot name="login-prompt">
				<p>
					<a href="#" @click.prevent="$emit('login')">Sign in</a>
					to leave a comment
				</p>
			</slot>
		</section>

		<slot name="after"></slot>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import CommentForm from './Form.vue';
	import CommentItem from './Item.vue';
	import UtilityDots from '../Utility/Dots.vue';
	import ViewBase from '../Core/Base';
	import { Component, Prop, Watch } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '../Utility/Decorators';

	/**
	 * Comment list component that displays a list of comments with replies
	 * and provides functionality to add new comments and replies.
	 *
	 * @class CommentList
	 * @package Comment
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({
		components: {
			CommentForm,
			CommentItem,
			UtilityDots,
		},
	})
	export default class CommentList extends ViewBase {
		/**
		 * Get whether the user is authenticated
		 * @return boolean
		 */
		protected get isAuthenticated(): boolean {
			return this.$store.getters['authentication/authenticated'];
		}

		/**
		 * Sort direction for comments
		 * @type string
		 */
		@Prop({ default: 'desc' })
		public direction!: 'asc' | 'desc';

		/**
		 * Parent model that the comments belong to (Venue, User, Content, etc.)
		 * @type any
		 */
		@Prop({ required: true })
		public model!: any;

		/**
		 * How tall the comment list should be
		 *
		 * @type string
		 */
		@Prop()
		public maxHeight!: string;

		/**
		 * Whether to show the comment form
		 * @type boolean
		 */
		@Prop({ default: true })
		public showCommentForm!: boolean;

		/**
		 * Whether to show the header
		 * @type boolean
		 */
		@Prop({ default: true })
		public showHeader!: boolean;

		/**
		 * Whether comments are currently loading
		 * @type boolean
		 */
		protected isLoading: boolean = false;

		/**
		 * Handle successful comment submission
		 *
		 * @param commentModel any
		 * @return Promise<void>
		 */
		protected async Handle_OnCommentSuccess(commentModel: any): Promise<void> {
			this.$emit('comment', commentModel);
			this.$forceUpdate();
		}

		/**
		 * Handle successful comment deletion
		 *
		 * @param commentModel any
		 * @return Promise<void>
		 */
		protected async Handle_OnDeleteSuccess(commentModel: any): Promise<void> {
			this.$emit('delete', commentModel);
			this.$forceUpdate();
		}
	}
</script>

<style lang="scss">
	.chalky.comment-list {
		display: flex;
		flex-direction: column;
		margin: 1rem 0;

		header {
			margin-bottom: 1rem;
		}

		.comment-wrapper {
			overflow: hidden;
			position: relative;
		}

		.comment-container {
			overflow: auto;
			position: relative;
		}

		.loading {
			padding: 1rem 0;
			text-align: center;
		}

		.empty-state {
			color: var(--chalky-grey-2, #999);
			font-style: italic;
			padding: 1rem 0;
			text-align: center;
		}

		.comments {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}

		.main-comment-form {
			margin-top: 1rem;
		}

		.login-prompt {
			margin-top: 1rem;
			text-align: center;

			a {
				color: var(--chalky-blue, #0077cc);
				text-decoration: none;

				&:hover {
					text-decoration: underline;
				}
			}
		}

		// Apply border styling to top-level comment items
		// Use deep selector to style components
		.chalky.comment-item {
			border: 0;
			padding: 1rem;

			&:last-child {
				border-bottom: none;
			}
		}
	}

	// Variations
	// ---------------------------------------------------------------------------

	.chalky.comment-list.direction-asc {
		.comments {
			flex-direction: column-reverse;
		}
	}

	.chalky.comment-list.variation-compact {
		--chalky-comments-avatar-size: 1rem;

		.comments {
			gap: 0.5em;
		}

		.comment-item {
			padding: 0.25em;
		}

		.author {
			font-size: 0.75em;
		}

		.user-avatar .avatar {
			height: var(--chalky-comments-avatar-size);
			width: var(--chalky-comments-avatar-size);
		}
	}
</style>
