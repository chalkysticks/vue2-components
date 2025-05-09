<template>
	<section
		class="chalky content-list"
		v-bind:class="{
			'state-loading': contentCollection.models.length == 0 || contentCollection.loading,
		}"
	>
		<section class="list" v-bind:key="contentCollection.requestTime">
			<slot name="before-list"></slot>

			<ContentItem
				class="list-item type-minimal"
				v-bind:allowVideo="false"
				v-bind:class="{ 'state-selected': contentModel.id == selectedContentId }"
				v-bind:key="contentModel.id"
				v-bind:contentModel="contentModel"
				v-for="contentModel in contentCollection"
				v-on:click.native="Handle_OnClickContent($event, contentModel)"
			/>

			<slot name="after-list"></slot>
		</section>

		<slot name="actions">
			<footer class="actions" v-if="includeActions">
				<button v-on:click="Handle_OnClickPrevious">Previous</button>
				<button v-on:click="Handle_OnClickNext">Next</button>
			</footer>
		</slot>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ContentItem from './Item.vue';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package Content
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({
		components: {
			ContentItem,
		},
	})
	export default class ContentList extends ViewBase {
		/**
		 * @type boolean
		 */
		@Prop({ default: false })
		public includeActions!: boolean;

		/**
		 * @type number
		 */
		@Prop({ default: 10 })
		public listSize!: number;

		/**
		 * @type ChalkySticks/Collection/Content
		 */
		@Prop({
			default: () => ChalkySticks.Factory.Content.collection(),
		})
		public contentCollection!: ChalkySticks.Collection.Content;

		/**
		 * @constructor
		 */
		@mounted
		public afterCreate() {
			if (this.contentCollection.shouldFetch()) {
				this.contentCollection.fetch();
			}
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @param MouseEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickNext(e: MouseEvent): Promise<void> {
			e.preventDefault();

			this.contentCollection.fetchNext();

			this.$emit('next');
		}

		/**
		 * @param MouseEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickPrevious(e: MouseEvent): Promise<void> {
			e.preventDefault();

			this.contentCollection.fetchPrevious();

			this.$emit('previous');
		}

		/**
		 * @param PointerEvent e
		 * @param ChalkySticks.Model.Content contentModel
		 * @return Promise<void>
		 */
		protected async Handle_OnClickContent(e: PointerEvent, contentModel: ChalkySticks.Model.Content): Promise<void> {
			e.preventDefault();

			this.$emit('content:select', contentModel);
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.content-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		height: 100%;
		justify-content: center;

		.list {
			height: 100%;
			overflow: auto;
			padding: 1rem;

			.list-item {
				border-bottom: 1px solid #fff;
				padding: 1em 0;
			}

			.content-item {
				cursor: pointer;
			}
		}
	}
</style>
