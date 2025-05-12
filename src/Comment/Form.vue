<template>
	<section class="chalky comment-form">
		<slot name="before"></slot>

		<form v-on:submit="Handle_OnSubmit" v-if="contextModel && contextModel.id">
			<slot name="form:before"></slot>

			<div class="user" v-bind:key="isAuthenticated">
				<slot name="user" v-bind:userModel="userModel" v-if="showAvatar">
					<UserAvatar v-bind:userModel="userModel" size="sm" />
				</slot>
			</div>

			<div class="input">
				<slot name="input">
					<textarea
						v-bind:disabled="isSubmitting"
						v-bind:maxlength="maxLength"
						v-bind:placeholder="placeholder"
						v-bind:rows="rows"
						v-model="comment"
						v-on:keyup.ctrl.enter="Handle_OnSubmit"
						ref="commentInput"
					></textarea>
				</slot>
			</div>

			<div class="actions">
				<slot name="actions" v-bind:isDisabled="!comment.trim() || isSubmitting">
					<button type="submit" class="button-primary" v-bind:disabled="!comment.trim() || isSubmitting">
						<slot name="submit-text">
							{{ submitText }}
						</slot>
					</button>
				</slot>
			</div>

			<slot name="form:after"></slot>
		</form>

		<section v-else>
			<slot name="no-model">
				<p class="error">Provide something to comment on.</p>
			</slot>
		</section>

		<slot name="after"></slot>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import Store from '@/Store';
	import UserAvatar from '../User/Avatar.vue';
	import ViewBase from '../Core/Base';
	import { Component, Prop, Ref, Watch } from 'vue-property-decorator';
	import { beforeDestroy, bind, mounted } from '../Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package Comment
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({
		components: {
			UserAvatar,
		},
	})
	export default class CommentForm extends ViewBase {
		/**
		 * Get whether the user is authenticated
		 * @return boolean
		 */
		protected get isAuthenticated(): boolean {
			return this.$store.getters['authentication/authenticated'];
		}

		/**
		 * Reference to the comment input textarea
		 *
		 * @type HTMLTextAreaElement
		 */
		@Ref('commentInput')
		protected commentInput!: HTMLTextAreaElement;

		/**
		 * If the form should grow when the user types in it
		 *
		 * @type boolean
		 */
		@Prop({ default: false })
		public autoGrow!: boolean;

		/**
		 * If the form is for a reply to an existing comment
		 *
		 * @type boolean
		 */
		@Prop({ default: false })
		public isReply!: boolean;

		/**
		 * Maximum comment length
		 *
		 * @type number
		 */
		@Prop({ default: 1000 })
		public maxLength!: number;

		/**
		 * Parent model that the comment belongs to (Venue, User, Content, etc.)
		 *
		 * @type any
		 */
		@Prop({ required: true })
		public contextModel!: any;

		/**
		 * Placeholder text for the comment textarea
		 *
		 * @type string
		 */
		@Prop({ default: 'Add a comment...' })
		public placeholder!: string;

		/**
		 * Parent comment model (for replies)
		 *
		 * @type ChalkySticks/Model/Comment
		 */
		@Prop({
			default: null,
		})
		public parentCommentModel!: ChalkySticks.Model.Comment | null;

		/**
		 * Number of rows for the textarea
		 *
		 * @type number
		 */
		@Prop({ default: 3 })
		public rows!: number;

		/**
		 * Whether to show the user avatar
		 *
		 * @type boolean
		 */
		@Prop({ default: false })
		public showAvatar!: boolean;

		/**
		 * Text for the submit button
		 *
		 * @type string
		 */
		@Prop({ default: 'Post' })
		public submitText!: string;

		/**
		 * User model for the commenter
		 *
		 * @type ChalkySticks/Model/User
		 */
		@Prop({
			default: () => Store.getters['authentication/user'],
		})
		public userModel!: ChalkySticks.Model.User;

		/**
		 * The comment text
		 *
		 * @type string
		 */
		protected comment: string = '';

		/**
		 * Whether the form is currently submitting
		 *
		 * @type boolean
		 */
		protected isSubmitting: boolean = false;

		/**
		 * Focus if it's a reply
		 *
		 * @return void
		 */
		@mounted
		protected autoFocus(): void {
			if (this.isReply) {
				this.focus();
			}
		}

		/**
		 * Clears the comment form
		 *
		 * @return void
		 */
		protected clear(): void {
			this.comment = '';
			this.isSubmitting = false;
		}

		/**
		 * @return void
		 */
		protected focus(): void {
			this.commentInput?.focus();
		}

		/**
		 * @return Promise<void>
		 */
		protected async submitComment(): Promise<void> {
			const params = {
				body: this.comment.trim(),
			};

			// Context model is a Comment
			if (this.isReply) {
				const commentModel = await this.contextModel.reply(params);
				await commentModel.save();

				this.contextModel.children.push(commentModel);
			}

			// Context model is a commentable
			else {
				await this.contextModel.comments.comment(params).save();
				console.log('commenting', this.contextModel);
			}
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * Handle textarea input events
		 * @param Event e
		 * @return void
		 */
		protected Handle_OnInput(e: Event): void {
			this.$emit('input', this.comment);
		}

		/**
		 * Auto-resize textarea to fit content
		 *
		 * @return void
		 */
		@Watch('comment')
		protected Handle_OnCommentChange(): void {
			if (this.commentInput && this.autoGrow) {
				this.commentInput.style.height = 'auto';
				this.commentInput.style.height = this.commentInput.scrollHeight + 2 + 'px';
			}
		}

		/**
		 * Submit handler for form submission
		 * @param Event e
		 * @return Promise<void>
		 */
		protected async Handle_OnSubmit(e: Event): Promise<void> {
			e.preventDefault();

			// Don't submit if empty or already submitting
			if (!this.comment.trim() || this.isSubmitting) {
				return;
			}

			// Set submitting state
			this.isSubmitting = true;

			try {
				const commentModel = await this.submitComment();

				this.clear();
				this.$emit('submit', commentModel);
			} catch (error) {
				this.$emit('submit:error', error);
			}

			// Reset submitting state
			this.isSubmitting = false;
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.comment-form {
		form {
			display: grid;
			grid-template-areas:
				'user input'
				'whatever actions';
			grid-template-columns: auto 1fr;
			grid-template-rows: repeat(2, auto);
			gap: 0.5rem;

			.user {
				padding-right: 0.5rem;
			}

			.actions {
				grid-area: actions;
				display: flex;
				justify-content: flex-end;
				margin: 0;
			}
		}
	}
</style>
