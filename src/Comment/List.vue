<template>
	<section class="chalky comment-list">
		<slot name="before"></slot>

		<header v-if="showHeader" v-bind:key="model.comments.uniqueKey">
			<slot name="header">
				<h3>Comments ({{ model.comments.length }})</h3>
			</slot>
		</header>

		<div class="comment-container" v-bind:key="model.comments.uniqueKey">
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
		</div>

		<!-- Main comment form -->
		<div v-if="showCommentForm && isAuthenticated" class="main-comment-form">
			<slot name="comment-form">
				<CommentForm v-bind:contextModel="model" v-on:submit:error="$emit('comment:error', $event)" v-on:submit="Handle_OnCommentSuccess" />
			</slot>
		</div>

		<!-- Login prompt if not authenticated -->
		<div v-else-if="showCommentForm && !isAuthenticated" class="login-prompt">
			<slot name="login-prompt">
				<p>
					<a href="#" @click.prevent="$emit('login')">Sign in</a>
					to leave a comment
				</p>
			</slot>
		</div>

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
		 * Parent model that the comments belong to (Venue, User, Content, etc.)
		 * @type any
		 */
		@Prop({ required: true })
		public model!: any;

		/**
		 * Sort direction for comments
		 * @type string
		 */
		@Prop({ default: 'desc' })
		public sortDirection!: 'asc' | 'desc';

		/**
		 * Sort field for comments
		 * @type string
		 */
		@Prop({ default: 'created_at' })
		public sortField!: string;

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
		 * Load comments when parent model changes
		 * @return void
		 */
		@mounted
		protected async loadComments(): Promise<void> {
			this.isLoading = true;

			try {
				// Fetch comments if they haven't been loaded yet
				if (!this.model.comments || !this.model.comments.models.length) {
					this.model.setQueryParams({
						include: 'comments',
					});

					await this.model.fetch();
				}

				this.$emit('load');
			} catch (error) {
				this.$emit('load:error', error);
				console.error('Failed to load comments:', error);
			}

			this.isLoading = false;
		}

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
		margin: 1rem 0;

		header {
			margin-bottom: 1rem;
		}

		.comment-container {
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
			margin-top: 2rem;
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
</style>
