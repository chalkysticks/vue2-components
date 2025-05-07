<template>
	<a class="chalky venue-button-share btn button-tertiary size-small" v-bind:href="'javascript:void(0)'" v-on:click="Handle_OnClickShare">
		<i class="icon fa fa-share-alt"></i>
		<span>Share</span>
	</a>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * @author ChalkySticks LLC
	 * @package Venue/Button
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class VenueButtonShare extends ViewBase {
		/**
		 * @type ChalkySticks/Model/Venue
		 */
		@Prop({
			default: () => new ChalkySticks.Model.Venue(),
		})
		public venueModel!: ChalkySticks.Model.Venue;

		/**
		 * @type string
		 */
		@Prop({
			default: '',
		})
		public shareUrl!: string;

		/**
		 * Get share URL considering all environments (web, Capacitor, etc.)
		 *
		 * @return string
		 */
		protected getShareUrl(): string {
			// First check if a specific URL was provided
			if (this.shareUrl) {
				return this.shareUrl;
			}

			// Fall back to window.location if available
			if (typeof window !== 'undefined' && window.location) {
				return window.location.href;
			}

			// Last resort: Use a fallback URL structure
			return `https://www.chalkysticks.com/venue/${this.venueModel.id}`;
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * Handler for when user clicks the share button
		 *
		 * @return Promise<void>
		 */
		protected async Handle_OnClickShare(): Promise<void> {
			const shareUrl = this.getShareUrl();
			const shareTitle = this.venueModel.getName();
			const shareText = this.venueModel.getDescription() || `Check out ${shareTitle}!`;

			// Check if the Share API is available
			if (navigator.share) {
				// Build the share data
				const shareData = {
					title: shareTitle,
					text: shareText,
					url: shareUrl,
				};

				try {
					// Trigger the native share dialog
					await navigator.share(shareData);
					this.$emit('share:success');
				} catch (error) {
					// User probably canceled the share operation
					this.$emit('share:error', error);
				}
			} else {
				// Fallback for browsers that don't support the Share API
				this.$emit('share:fallback', {
					description: shareText,
					title: shareTitle,
					url: shareUrl,
				});
			}
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.venue-button-share {
		align-items: center;
		display: inline-flex;
		flex-grow: 1;
		gap: 0.5em;
		justify-content: center;
	}
</style>
