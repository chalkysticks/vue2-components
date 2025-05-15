<template>
	<section class="chalky form-userprofilephoto">
		<!-- Default View -->
		<section class="default" v-bind:key="userModel.uniqueKey" v-if="isChangeMode === false">
			<UserAvatar size="md" v-bind:key="userModel.uniqueKey" v-bind:userModel="userModel" v-on:click.native="Handle_OnClickChange" />

			<section class="actions">
				<h3>{{ userModel.attributes.name }}</h3>

				<button class="button-primary size-small" v-on:click="Handle_OnClickChange">Change</button>
				&nbsp;
				<button class="button-secondary size-small" v-on:click="Handle_OnClickRemove">Remove</button>
			</section>
		</section>

		<!-- Selection Gallery -->
		<section class="changeMode" v-else>
			<section class="photo-gallery" ref="photoGallery">
				<picture
					v-bind:class="{
						'state-active': mediaModel.attributes.subgroup === 'avatar',
					}"
					v-bind:key="userModel.uniqueKey + index"
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
	import { Component, Prop, Ref } from 'vue-property-decorator';
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
		 * Reference to the photo gallery element
		 *
		 * @type HTMLDivElement
		 */
		@Ref('photoGallery')
		protected photoGallery!: HTMLDivElement;

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
			await avatarMediaModel.delete();

			// Remove from the user model's media collection
			this.userModel.media.remove(avatarMediaModel);

			// Events
			this.$emit('remove');
		}

		/**
		 * @return void
		 */
		protected scrollToEnd(): void {
			this.photoGallery.scrollTo({
				behavior: 'smooth',
				left: this.photoGallery.scrollWidth,
			});
		}

		/**
		 * Unset the current avatar relationship
		 *
		 * @return Promise<void>
		 */
		protected async unsetAvatars(): Promise<void> {
			const promises: Promise<void>[] = [];
			for (const mediaModel of this.userModel.media) {
				// If the media model is an avatar, unset it
				if (mediaModel.attributes.subgroup === ChalkySticks.Enum.MediaSubgroup.Avatar) {
					promises.push(
						mediaModel.save({
							subgroup: ChalkySticks.Enum.MediaSubgroup.Person,
						}),
					);
				}
			}
			await Promise.all(promises);
		}

		/**
		 * Set the avatar for the user model
		 *
		 * @param mediaModel ChalkySticks.Model.Media
		 * @return Promise<void>
		 */
		protected async setAvatar(mediaModel: ChalkySticks.Model.Media): Promise<void> {
			// If no media model, return
			if (!mediaModel) {
				return;
			}

			// Find media model in the user's media collection
			const existingMediaModel = this.userModel.media.findWhere({
				id: mediaModel.id,
			});

			// Set new avatar
			await existingMediaModel.save({
				subgroup: ChalkySticks.Enum.MediaSubgroup.Avatar,
			});

			// Set the attributes
			this.userModel.avatar.set(existingMediaModel.attributes);

			// Clear the user's avatar relationship
			this.userModel.clearRelationship('avatar');
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

			// Remove the photo we have now
			await this.removePrimaryPhoto();
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
			await mediaModel.delete();

			// Remove from the user model's media collection
			this.userModel.media.remove(mediaModel);

			// Emit
			this.$emit('remove');
		}

		/**
		 * @param PointerEvent e
		 * @param ChalkySticks.Model.Media mediaModel
		 * @return Promise<void>
		 */
		protected async Handle_OnSelectAvatar(e: PointerEvent, mediaModel: ChalkySticks.Model.Media): Promise<void> {
			// Unset current avatar
			await this.unsetAvatars();

			// // Set new avatar
			await this.setAvatar(mediaModel);

			// Update user
			this.userModel.dispatch('change');

			// Emit
			this.$emit('select');
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnUploadComplete(): Promise<void> {
			// Scroll to the end of the photo gallery
			setTimeout(() => this.scrollToEnd(), 100);

			// Emit
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
