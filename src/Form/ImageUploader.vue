<template>
	<section class="chalky form-imageuploader">
		<form v-if="model" v-bind:key="model.timeCompleted" v-on:submit.prevent="Handle_OnSubmit">
			<fieldset class="image-upload-container">
				<div
					class="dropzone"
					v-bind:class="{ active: isDragging }"
					v-on:dragleave.prevent="Handle_OnDragLeave"
					v-on:dragover.prevent="Handle_OnDragOver"
					v-on:drop.prevent="Handle_OnDrop"
				>
					<div v-if="!previewImages.length" class="dropzone-message">
						<BrandingBadge />

						<p v-if="allowMultiple">
							Drag images here or
							<a href="#" v-on:click.prevent="triggerFileInput">click to browse</a>
						</p>
						<p v-else>
							Drag an image here or
							<a href="#" v-on:click.prevent="triggerFileInput">click to browse</a>
						</p>
					</div>

					<div v-else class="preview-container">
						<div v-for="(preview, index) in previewImages" v-bind:key="index" class="preview-item">
							<img v-bind:src="preview.url" v-bind:alt="`Preview ${index + 1}`" />

							<button
								class="control type-close theme-dark background-chalky-red action-delete"
								v-on:click.prevent="Handle_OnRemoveImage(index)"
							></button>
						</div>

						<div class="add-more" v-if="allowMultiple" v-on:click.prevent="triggerFileInput">
							<span>+</span>
						</div>
					</div>
				</div>

				<!-- Hidden file input -->
				<input
					class="hidden-file-input"
					name="imageFiles"
					ref="fileInput"
					type="file"
					v-bind:accept="acceptTypes"
					v-bind:multiple="allowMultiple"
					v-on:change="Handle_OnFilesChange"
				/>

				<!-- Action buttons -->
				<div v-if="previewImages.length" class="action-buttons">
					<button class="button-primary" v-bind:disabled="isUploading">
						{{ isUploading ? 'Uploading...' : 'Upload' }}
					</button>

					<button class="button-secondary" v-on:click.prevent="Handle_OnClickClearAll">Clear All</button>
				</div>
			</fieldset>
		</form>

		<p v-else>Please provide a valid model to upload images.</p>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import BrandingBadge from '../Branding/Badge.vue';
	import { Component, Prop, Watch } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * A reusable image uploader component that supports single or multiple image uploads,
	 * preview functionality, and metadata entry. Can be used with different model types
	 * that support the media upload interface.
	 *
	 * @author Matt Kenefick <matt@chalkysticks.com>
	 * @package Form
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({
		components: {
			BrandingBadge,
		},
	})
	export default class FormImageUploader extends ViewBase {
		/**
		 * The model to upload images to (must support media upload interface)
		 * This could be a venue, user, or any other model with media capabilities
		 *
		 * @type {ChalkySticks.Model.Venue | ChalkySticks.Model.User}
		 */
		@Prop({ required: true })
		public model!: ChalkySticks.Model.Venue | ChalkySticks.Model.User;

		/**
		 * Title to display above the uploader
		 *
		 * @type {string}
		 */
		@Prop({ default: 'Upload Images' })
		public title!: string;

		/**
		 * Whether to allow multiple file selection
		 *
		 * @type {boolean}
		 */
		@Prop({ default: true })
		public allowMultiple!: boolean;

		/**
		 * Whether to show metadata fields (subgroup, notes)
		 *
		 * @type {boolean}
		 */
		@Prop({ default: true })
		public enableMetadata!: boolean;

		/**
		 * Whether to include notes field
		 *
		 * @type {boolean}
		 */
		@Prop({ default: true })
		public showNotes!: boolean;

		/**
		 * Whether to include subgroup selection
		 *
		 * @type {boolean}
		 */
		@Prop({ default: true })
		public showSubgroupSelect!: boolean;

		/**
		 * Available subgroups for image categorization
		 *
		 * @type {string[]}
		 */
		@Prop({
			default: () => ['exterior', 'image', 'interior', 'person', 'table', 'video'],
		})
		public subgroups!: string[];

		/**
		 * Type of files to accept
		 *
		 * @type {string}
		 */
		@Prop({ default: 'image/*' })
		public acceptTypes!: string;

		/**
		 * Preview images for display before upload
		 *
		 * @type {Array<{file: File, url: string}>}
		 */
		protected previewImages: Array<{ file: File; url: string }> = [];

		/**
		 * Notes entered by user
		 *
		 * @type {string}
		 */
		protected notes: string = '';

		/**
		 * Selected subgroup from dropdown
		 *
		 * @type {string}
		 */
		protected selectedSubgroup: string = '';

		/**
		 * Whether a drag operation is in progress
		 *
		 * @type {boolean}
		 */
		protected isDragging: boolean = false;

		/**
		 * Whether an upload is currently in progress
		 *
		 * @type {boolean}
		 */
		protected isUploading: boolean = false;

		/**
		 * Component setup
		 *
		 * @return {Promise<void>}
		 */
		@mounted
		public async setup(): Promise<void> {
			if (this.subgroups && this.subgroups.length) {
				this.selectedSubgroup = this.subgroups[0];
			}
		}

		/**
		 * @return void
		 */
		@mounted
		public attachEvents(): void {
			this.model.media.on('error', this.Handle_OnMediaUploadError);
		}

		/**
		 * @return void
		 */
		@beforeDestroy
		public detachEvents(): void {
			this.model.media.off('error', this.Handle_OnMediaUploadError);
		}

		/**
		 * Clean up resources when component is destroyed
		 *
		 * @return {void}
		 */
		@beforeDestroy
		public cleanup(): void {
			this.previewImages.forEach((preview) => {
				URL.revokeObjectURL(preview.url);
			});
		}

		/**
		 * Trigger the hidden file input element
		 *
		 * @return {void}
		 */
		protected triggerFileInput(): void {
			const fileInput = this.$refs.fileInput as HTMLInputElement;

			fileInput.click();
		}

		/**
		 * Generate image previews from selected files.
		 * If a file is invalid (size === 0), fall back to loading via <img> + canvas.
		 *
		 * @param {File[]} files - Files from input or drop event
		 * @return {void}
		 */
		protected generatePreviews(files: File[]): void {
			for (const file of files) {
				if (!file.type.startsWith('image/')) {
					continue;
				}

				// Standard file
				if (file.size > 0) {
					const imageUrl = URL.createObjectURL(file);

					this.previewImages.push({
						file: file,
						url: imageUrl,
					});
				} else {
					// Likely from Google Photos &mdash; fix by reloading and converting
					this.loadImageFromFileFallback(file);
				}
			}
		}

		/**
		 * Attempt to load image from zero-size file and re-encode via canvas
		 *
		 * @param {File} file - Possibly empty image File
		 * @return {void}
		 */
		protected async loadImageFromFileFallback(file: File): Promise<void> {
			const imageUrl = URL.createObjectURL(file);
			const image = new Image();

			image.onload = async () => {
				const canvas = document.createElement('canvas');
				const context = canvas.getContext('2d');

				if (!context) {
					console.warn('Failed to get canvas context for image fallback');
					URL.revokeObjectURL(imageUrl);
					return;
				}

				canvas.width = image.width;
				canvas.height = image.height;
				context.drawImage(image, 0, 0);

				canvas.toBlob((blob) => {
					if (!blob) {
						console.warn('Canvas failed to produce a blob');
						return;
					}

					// Construct a new File from blob
					const newFile = new File([blob], file.name || 'photo.jpg', {
						type: blob.type,
					});

					const newUrl = URL.createObjectURL(blob);

					this.previewImages.push({
						file: newFile,
						url: newUrl,
					});

					URL.revokeObjectURL(imageUrl);
				}, 'image/jpeg');
			};

			image.onerror = () => {
				console.warn('Failed to load image for canvas fallback');
				URL.revokeObjectURL(imageUrl);
			};

			image.src = imageUrl;
		}

		/**
		 * Upload all images with metadata to the model
		 *
		 * @return {Promise<void>}
		 */
		protected async uploadImages(): Promise<void> {
			if (!this.previewImages.length || !this.model) {
				return;
			}

			this.isUploading = true;
			this.$emit('upload-start');

			const uploadResults = [];
			const metadata = {
				notes: this.notes,
				subgroup: this.selectedSubgroup,
				type: 'image',
			};

			try {
				// Process each file individually
				for (const preview of this.previewImages) {
					const result = await this.model.media.upload('image', preview.file, metadata);
					uploadResults.push(result);
				}

				// Emit success event with results
				this.$emit('uploaded', uploadResults);

				// Clear the uploader after successful upload
				this.Handle_OnClickClearAll();
			} catch (error) {
				console.error('Error uploading images:', error);
				this.$emit('upload-error', error);
			} finally {
				this.isUploading = false;
			}
		}

		/**
		 * @return void
		 */
		protected clearPreviewImages(): void {
			this.previewImages.forEach((preview) => URL.revokeObjectURL(preview.url));
			this.previewImages = [];
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * Handle file selection from input
		 *
		 * @param {Event} e - Change event
		 * @return {void}
		 */
		protected Handle_OnFilesChange(e: Event): void {
			const files = Array.from((e.target as HTMLInputElement).files || []);

			if (!this.allowMultiple) {
				this.clearPreviewImages();
			}

			this.generatePreviews(files);

			// Reset the input to ensure onChange fires even if same file is selected again
			(e.target as HTMLInputElement).value = '';
		}

		/**
		 * Handle dragover event to show active drop zone
		 *
		 * @param {DragEvent} e - Drag event
		 * @return {void}
		 */
		protected Handle_OnDragOver(e: DragEvent): void {
			this.isDragging = true;
		}

		/**
		 * Handle dragleave event to hide active drop zone
		 *
		 * @param {DragEvent} e - Drag event
		 * @return {void}
		 */
		protected Handle_OnDragLeave(e: DragEvent): void {
			this.isDragging = false;
		}

		/**
		 * Handle file drop
		 *
		 * @param {DragEvent} e - Drop event
		 * @return {void}
		 */
		protected Handle_OnDrop(e: DragEvent): void {
			this.isDragging = false;

			if (!e.dataTransfer) {
				return;
			}

			const files = Array.from(e.dataTransfer.files);

			if (!this.allowMultiple) {
				this.clearPreviewImages();

				// Only take the first file in single file mode
				if (files.length > 0) {
					this.generatePreviews([files[0]]);
				}
			} else {
				this.generatePreviews(files);
			}
		}

		/**
		 * Handle file drop
		 *
		 * @param {DragEvent} e - Drop event
		 * @return {Promise<void>}
		 */
		protected async Handle_OnMediaUploadError(error: any): Promise<void> {
			console.error('Media upload error:', error);
			alert('An error occurred while uploading images. Please try again.');
		}

		/**
		 * Remove a specific image from preview
		 *
		 * @param {number} index - Index of image to remove
		 * @return {void}
		 */
		protected Handle_OnRemoveImage(index: number): void {
			if (index >= 0 && index < this.previewImages.length) {
				URL.revokeObjectURL(this.previewImages[index].url);
				this.previewImages.splice(index, 1);
			}
		}

		/**
		 * Clear all selected images
		 *
		 * @return {void}
		 */
		protected Handle_OnClickClearAll(): void {
			this.clearPreviewImages();
			this.notes = '';
		}

		/**
		 * Handle upload button click
		 *
		 * @param SubmitEvent e
		 * @return {Promise<void>}
		 */
		protected async Handle_OnSubmit(e: SubmitEvent): Promise<void> {
			e.preventDefault();

			// Upload all
			await this.uploadImages();

			// Update
			this.$emit('complete');
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.form-imageuploader {
		fieldset {
			margin: 0;
		}

		.image-upload-container {
			.dropzone {
				border-radius: var(--rounded-corner);
				border: 2px dashed #ccc;
				cursor: pointer;
				min-height: 100px;
				padding: 1rem;
				text-align: center;
				transition: all 0.3s ease;

				&.active {
					background-color: var(--chalky-blue-4);
					border-color: var(--chalky-purple);
				}

				.dropzone-message {
					align-items: center;
					display: flex;
					flex-direction: column;
					height: 100%;
					justify-content: center;

					p {
						font-size: 1rem;
						margin-bottom: 0.5rem;
					}

					small {
						color: #666;
						font-size: 0.8rem;
					}
				}
			}

			// Preview container
			.preview-container {
				display: flex;
				flex-wrap: wrap;
				gap: 1rem;

				.preview-item {
					border: 1px solid #eee;
					border-radius: 4px;
					height: 120px;
					overflow: hidden;
					position: relative;
					width: 120px;

					img {
						height: 100%;
						object-fit: cover;
						width: 100%;
					}
				}

				.add-more {
					align-items: center;
					background-color: #f5f5f5;
					border: 1px dashed #ccc;
					border-radius: 4px;
					cursor: pointer;
					display: flex;
					height: 120px;
					justify-content: center;
					width: 120px;

					span {
						color: #666;
						font-size: 2rem;
					}

					&:hover {
						background-color: #eee;
					}
				}
			}

			// Hidden file input
			.hidden-file-input {
				display: none;
			}

			// Metadata container
			.metadata-container {
				margin-top: 1.5rem;

				label {
					display: block;
					margin-bottom: 1rem;

					h6 {
						margin-bottom: 0.5rem;
					}

					select,
					textarea {
						width: 100%;
					}

					textarea {
						min-height: 80px;
					}
				}
			}

			// Action buttons
			.action-buttons {
				display: flex;
				gap: 1rem;
				margin-top: 1.5rem;
			}
		}
	}

	// Media Queries
	// ---------------------------------------------------------------------------

	@media (max-width: 768px) {
		.chalky.form-imageuploader {
			.image-upload-container {
				.preview-container {
					justify-content: center;

					.preview-item,
					.add-more {
						height: 100px;
						width: 100px;
					}
				}

				.action-buttons {
					flex-direction: column;
				}
			}
		}
	}
</style>
