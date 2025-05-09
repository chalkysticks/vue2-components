<template>
	<section
		class="chalky content-item"
		v-bind:key="contentModel.id"
		v-bind:class="{
			[contentModel.getMediaType()]: true, // Use the media type as a class for styling
			'state-loading': !contentModel || contentModel.id <= 0, // Loading state
			'state-empty': !contentModel || (contentModel.getContent() || '').trim().length <= 0, // Empty content
		}"
	>
		<slot name="before"></slot>

		<article>
			<picture class="thumbnail border-blue padded shadow-xl">
				<img
					v-bind:alt="contentModel.getTitle() || 'Content Image'"
					v-bind:src="contentModel.getThumbnailUrl()"
					v-bind:title="contentModel.getTitle() || 'Content Image'"
				/>
			</picture>

			<h1 class="title">{{ contentModel.getTitle() }}</h1>

			<div class="tags">
				<span v-for="(tag, index) in contentModel.tags" v-bind:key="index" class="tag">
					{{ tag.getTag() }}
				</span>
			</div>

			<div class="body" v-html="contentModel.getContent()"></div>

			<section class="video" v-if="allowVideo && contentModel.getMediaType() === 'video'">
				<iframe
					allowfullscreen
					frameborder="0"
					height="315"
					title="YouTube Video"
					v-bind:src="contentModel.getYouTubeEmbed()"
					v-if="contentModel.getYouTubeEmbed()"
					width="100%"
				></iframe>
			</section>

			<picture class="media" v-else>
				<img
					v-bind:alt="contentModel.getTitle() || 'Content Image'"
					v-bind:src="contentModel.getMediaUrl()"
					v-bind:title="contentModel.getTitle() || 'Content Image'"
				/>
			</picture>
		</article>

		<slot name="after"></slot>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package Content
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class ContentItem extends ViewBase {
		/**
		 * @type boolean
		 */
		@Prop({ default: false })
		public allowVideo!: boolean;

		/**
		 * @type ChalkySticks/Model/Content
		 */
		@Prop({
			default: () => new ChalkySticks.Model.Content(),
		})
		public contentModel!: ChalkySticks.Model.Content;
	}
</script>

<style lang="scss">
	.chalky.content-item {
		picture {
			aspect-ratio: 16 / 10;
			background-color: var(--chalky-blue);
			display: block;
			overflow: hidden;
			position: relative;

			img {
				height: 100%;
				left: 0;
				object-fit: cover;
				position: absolute;
				top: 0;
				width: 100%;
			}
		}

		.thumbnail {
			margin-bottom: 1em;
		}

		.title {
			font-size: var(--font-size-large);
		}

		.tags {
			display: flex;
			gap: 0.5em;
			margin: var(--font-size-normal) 0;
		}

		.video {
			border-radius: var(--rounded-corner);
			font-size: 0;
			margin: 2rem;
			overflow: hidden;
		}
	}

	// Variations
	// ---------------------------------------------------------------------------

	.chalky.content-item.preview {
		.body,
		.video {
			display: none;
		}
	}

	.chalky.content-item.list-item {
		.body,
		.video,
		.media,
		.tags,
		.thumbnail {
			display: none;
		}
	}
</style>
