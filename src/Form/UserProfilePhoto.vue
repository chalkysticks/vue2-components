<template>
	<section class="chalky form-userprofilephoto">
		<section class="default" v-if="isChangeMode === false">
			<UserAvatar size="lg" v-bind:userModel="userModel" v-on:click.native="Handle_OnClickChange" />

			<section class="actions">
				<h3>{{ userModel.attributes.name }}</h3>

				<button class="button-primary size-small" v-on:click="Handle_OnClickChange">Change</button>
				&nbsp;
				<button class="button-secondary size-small" v-on:click="Handle_OnClickRemove">Remove</button>
			</section>
		</section>

		<section class="changeMode" v-else>
			<section class="photo-gallery">
				<picture
					v-bind:class="{
						'state-active': mediaModel.id === userModel.avatar.id,
					}"
					v-bind:key="index"
					v-for="(mediaModel, index) in userModel.media"
					v-on:click.native="Handle_OnClickChange"
				>
					<img v-bind:src="mediaModel.getUrlSmall()" v-on:click="Handle_OnSelectAvatar($event, mediaModel)" />

					<button class="control type-close rounded size-small" v-on:click="Handle_OnClickRemoveProfilePhoto($event, mediaModel)">
						Remove
					</button>
				</picture>
			</section>

			<FormImageUploader v-bind:allowMultiple="false" v-bind:model="userModel" v-on:complete="Handle_OnUploadComplete" />
		</section>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import FormImageUploader from './ImageUploader.vue';
	import UserAvatar from '../User/Avatar.vue';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package Form
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({
		components: {
			FormImageUploader,
			UserAvatar,
		},
	})
	export default class FormUserProfilePhoto extends ViewBase {
		/**
		 * The model to upload images to (must support media upload interface)
		 * This could be a venue, user, or any other model with media capabilities
		 *
		 * @type ChalkySticks.Model.User
		 */
		@Prop({ required: true })
		public userModel!: ChalkySticks.Model.User;

		/**
		 * @type boolean
		 */
		protected isChangeMode = false;

		/**
		 * @return Promise<void>
		 */
		protected async removePrimaryPhoto(): Promise<void> {
			const avatarMediaModel = this.userModel.avatar?.id ? this.userModel.avatar : this.userModel.media.primary;

			// Confirm
			if (!confirm('Are you sure you want to remove this photo?')) {
				return;
			}

			// If no avatar media model, return
			if (!avatarMediaModel) {
				return;
			}

			// Remove from the backend
			await avatarMediaModel.useModifiedEndpoint(this.userModel).delete();

			// Remove from the user model's media collection
			this.userModel.media.remove(avatarMediaModel);

			// Update
			this.$forceUpdate();

			// Emit
			this.$emit('remove');
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickChange(e: PointerEvent): Promise<void> {
			e.preventDefault();

			this.isChangeMode = !this.isChangeMode;
		}

		/**
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickRemove(e: PointerEvent): Promise<void> {
			e.preventDefault();

			await this.removePrimaryPhoto();

			// Update
			this.$forceUpdate();

			// Emit
			this.$emit('remove');
		}

		/**
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickRemoveProfilePhoto(e: PointerEvent, mediaModel: ChalkySticks.Model.Media): Promise<void> {
			e.preventDefault();

			// Confirm
			if (!confirm('Are you sure you want to remove this photo?')) {
				return;
			}

			// Remove from the backend
			await mediaModel.useModifiedEndpoint(this.userModel).delete();

			// Remove from the user model's media collection
			this.userModel.media.remove(mediaModel);

			// Update
			this.$forceUpdate();

			// Emit
			this.$emit('remove');
		}

		/**
		 * @param PointerEvent e
		 * @param ChalkySticks.Model.Media mediaModel
		 * @return Promise<void>
		 */
		protected async Handle_OnSelectAvatar(e: PointerEvent, mediaModel: ChalkySticks.Model.Media): Promise<void> {
			// Unset the current avatar
			if (this.userModel.avatar?.id) {
				const avatarModel = this.userModel.avatar.clone();

				avatarModel.set({
					subgroup: ChalkySticks.Enum.MediaSubgroup.Person,
				});

				await avatarModel.useModifiedEndpoint(this.userModel).save();
			}

			// Set new avatar
			mediaModel.set({
				subgroup: ChalkySticks.Enum.MediaSubgroup.Avatar,
			});

			await mediaModel.useModifiedEndpoint(this.userModel).save();

			// Update
			this.$forceUpdate();

			// Emit
			this.$emit('select');
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnUploadComplete(): Promise<void> {
			this.$forceUpdate();

			this.$emit('upload');
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.form-userprofilephoto {
		.default {
			align-items: center;
			display: flex;
			flex-direction: row;
			gap: 1rem;
		}

		h3 {
			margin-bottom: 0.5rem;
			text-align: left;
		}

		.avatar {
			border-radius: 50%;
			border: 3px solid var(--chalky-white);
		}

		.actions {
			text-align: left;
		}

		.photo-gallery {
			overflow-x: auto;
			white-space: nowrap;

			picture {
				aspect-ratio: 3 / 2;
				border-radius: var(--border-radius);
				cursor: pointer;
				display: inline-block;
				margin: 1rem 1rem 1rem 0;
				max-width: 150px;
				overflow: hidden;
				position: relative;
				width: 80%;

				.type-close {
					position: absolute;
					right: 0.25rem;
					top: 0.25rem;
					color: white;

					fill {
					}
				}

				img {
					height: 100%;
					object-fit: cover;
					width: 100%;
				}
			}
		}
	}

	// State
	// ---------------------------------------------------------------------------

	.chalky.form-userprofilephoto picture.state-active {
		border: 2px solid var(--chalky-white);
	}
</style>
