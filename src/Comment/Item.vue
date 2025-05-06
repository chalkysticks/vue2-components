<template>
	<div class="chalky comment-item" v-bind:class="{ 'with-replies': commentModel.children && commentModel.children.length > 0 }">
		<!-- Comment content -->
		<div class="comment">
			<slot name="comment" v-bind:commentModel="commentModel">
				<div class="user">
					<slot name="user" v-bind:userModel="commentModel.user">
						<UserAvatar v-bind:userModel="commentModel.user" size="sm" />
					</slot>
				</div>

				<div class="content">
					<div class="author">
						<slot name="author" v-bind:userModel="commentModel.user">
							<strong>{{ commentModel.user.getName() }}</strong>
						</slot>

						<span class="timestamp">{{ commentModel.getCreatedAt() }}</span>
					</div>

					<div class="body">{{ commentModel.getBody() }}</div>

					<div class="actions">
						<slot name="actions" v-bind:commentModel="commentModel">
							<button class="reply-button" v-if="isAuthenticated" v-on:click="Handle_OnClickReply">Reply</button>
							<button class="delete-button" v-if="isOwnComment" v-on:click="Handle_OnClickDelete">Delete</button>
						</slot>
					</div>
				</div>
			</slot>
		</div>

		<!-- Reply form -->
		<div class="reply-form-container" v-if="showReplyForm">
			<slot name="reply-form" v-bind:commentModel="commentModel">
				<CommentForm
					class="reply-form"
					placeholder="Write a reply..."
					submitText="Reply"
					v-bind:isReply="true"
					v-bind:contextModel="commentModel"
					v-on:submit:error="$emit('reply:error', $event)"
					v-on:submit="Handle_OnReplySuccess"
				/>
			</slot>
		</div>

		<!-- Replies (nested comments) -->
		<div class="replies" v-if="commentModel.children && commentModel.children.length > 0">
			<slot name="replies:before"></slot>

			<CommentItem
				class="reply-item"
				v-bind:commentModel="replyModel"
				v-bind:isReply="true"
				v-bind:key="replyModel.id"
				v-for="replyModel in commentModel.children"
				v-on:delete="Handle_OnDeleteSuccess"
				v-on:reply="Handle_OnReplySuccess"
			/>

			<slot name="replies:after"></slot>
		</div>
	</div>
</template>

<script lang="ts">
	import CommentForm from './Form.vue';
	import UserAvatar from '../User/Avatar.vue';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * Individual comment item component that can be used in comment lists
	 * and can display replies. Includes delete functionality for the user's own comments.
	 *
	 * @class CommentItem
	 * @package Comment
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({
		components: {
			CommentForm,
			UserAvatar,
		},
	})
	export default class CommentItem extends ViewBase {
		/**
		 * Get whether the user is authenticated
		 * @return boolean
		 */
		protected get isAuthenticated(): boolean {
			return this.$store.getters['authentication/authenticated'];
		}

		/**
		 * Get whether the current comment belongs to the logged in user
		 * @return boolean
		 */
		protected get isOwnComment(): boolean {
			const currentUserId = this.$store.getters['authentication/user']?.id;
			return currentUserId && this.commentModel.user.id === currentUserId;
		}

		/**
		 * The comment model to display
		 * @type any
		 */
		@Prop({ required: true })
		public commentModel!: any;

		/**
		 * Whether this is a reply comment
		 * @type boolean
		 */
		@Prop({ default: false })
		public isReply!: boolean;

		/**
		 * Whether to show the reply form
		 * @type boolean
		 */
		protected showReplyForm: boolean = false;

		/**
		 * Toggle reply form visibility
		 * @return void
		 */
		protected toggleReplyForm(): void {
			this.showReplyForm = !this.showReplyForm;
		}

		/**
		 * Delete the comment
		 * @return Promise<void>
		 */
		protected async deleteComment(): Promise<void> {
			if (!this.isOwnComment) {
				return;
			}

			try {
				await this.commentModel.delete();
				this.$emit('delete', this.commentModel);
			} catch (error) {
				this.$emit('delete:error', error);
				console.error('Failed to delete comment:', error);
			}
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * Handle click on reply button
		 * @return Promise<void>
		 */
		protected async Handle_OnClickReply(): Promise<void> {
			this.toggleReplyForm();
		}

		/**
		 * Handle click on delete button
		 * @return Promise<void>
		 */
		protected async Handle_OnClickDelete(): Promise<void> {
			if (confirm('Are you sure you want to delete this comment?')) {
				await this.deleteComment();
			}
		}

		/**
		 * Handle successful reply submission
		 * @param commentModel any
		 * @return Promise<void>
		 */
		protected async Handle_OnReplySuccess(commentModel: any): Promise<void> {
			this.showReplyForm = false;
			this.$emit('reply', commentModel);
			this.$forceUpdate();
		}

		/**
		 * Handle successful deletion of child comment
		 * @param commentModel any
		 * @return Promise<void>
		 */
		protected async Handle_OnDeleteSuccess(commentModel: any): Promise<void> {
			this.$emit('delete', commentModel);
			this.$forceUpdate();
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.comment-item {
		&.with-replies {
			.comment {
				margin-bottom: 0.75rem;
			}
		}

		.comment {
			display: flex;
			gap: 0.75rem;

			.user {
				flex-shrink: 0;
			}

			.content {
				flex-grow: 1;
				overflow-wrap: break-word;
				word-break: break-word;

				.author {
					display: flex;
					gap: 0.5rem;
					margin-bottom: 0.25rem;

					.timestamp {
						color: var(--chalky-grey-2, #999);
						font-size: 0.85em;
					}
				}

				.body {
					margin-bottom: 0.5rem;
					white-space: pre-line;
				}

				.actions {
					display: flex;
					gap: 1rem;

					.reply-button,
					.delete-button {
						background: none;
						border: none;
						cursor: pointer;
						font-size: 0.85em;
						padding: 0;
						text-decoration: none;

						&:hover {
							text-decoration: underline;
						}
					}

					.reply-button {
						color: var(--chalky-blue, #0077cc);
					}

					.delete-button {
						color: var(--chalky-red, #cc0000);
					}
				}
			}
		}

		.reply-form-container {
			margin-bottom: 0.75rem;
			margin-left: 2.5rem;
			margin-top: 0.75rem;
		}

		.replies {
			margin-left: 2.5rem;
			margin-top: 0.75rem;
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}

		&.reply-item {
			padding-top: 0.5rem;

			&:not(:last-child) {
				padding-bottom: 0.5rem;
				border-bottom: 1px solid var(--chalky-grey-lighter, #f0f0f0);
			}
		}
	}

	// Media Queries
	// ---------------------------------------------------------------------------

	@media (max-width: 576px) {
		.chalky.comment-item {
			.reply-form-container,
			.replies {
				margin-left: 1.5rem;
			}
		}
	}
</style>
