<template>
	<section class="chalky utility-pagination">
		<slot name="before"></slot>

		<button class="page-action action-first" v-if="showFirst" v-on:click="Handle_OnClickFirst">First</button>
		<button class="page-action action-previous" v-if="showPrevious" v-on:click="Handle_OnClickPrevious">Previous</button>

		<template v-if="showNumbers">
			<button
				class="page-number"
				v-bind:class="{ active: getCurrentPage() === pageNumber }"
				v-bind:key="pageNumber"
				v-bind:page="pageNumber"
				v-for="pageNumber in getPageNumbers()"
				v-on:click="Handle_OnClickPageNumber($event, pageNumber)"
			>
				{{ pageNumber }}
			</button>
		</template>

		<button class="page-action action-next" v-if="showNext" v-on:click="Handle_OnClickNext">Next</button>
		<button class="page-action action-last" v-if="showLast" v-on:click="Handle_OnClickLast">Last</button>

		<slot name="after"></slot>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import { Collection } from 'restmc';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, bind, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package Utility
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class UtilityPagination extends ViewBase {
		/**
		 * @type Collection<T>
		 */
		@Prop()
		public collection!: Collection<any>;

		/**
		 * @type number
		 */
		@Prop({ default: 5 })
		public maxPagesToShow!: number;

		/**
		 * @type number
		 */
		@Prop({ default: 1 })
		public minPagesToShow!: number;

		/**
		 * @type boolean
		 */
		@Prop({ default: false })
		public showFirst!: boolean;

		/**
		 * @type boolean
		 */
		@Prop({ default: false })
		public showLast!: boolean;

		/**
		 * @type boolean
		 */
		@Prop({ default: true })
		public showNext!: boolean;

		/**
		 * @type boolean
		 */
		@Prop({ default: true })
		public showNumbers!: boolean;

		/**
		 * @type boolean
		 */
		@Prop({ default: true })
		public showPrevious!: boolean;

		/**
		 * @return void
		 */
		@mounted
		public attachEvents(): void {
			this.collection.on('complete', this.Handle_OnFetchSuccess);
		}

		/**
		 * @return void
		 */
		@beforeDestroy
		public detachEvents(): void {
			this.collection.off('complete', this.Handle_OnFetchSuccess);
		}

		/**
		 * @param number number
		 * @return Promise<any>
		 */
		protected async fetchPage(number: number): Promise<any> {
			return this.collection.fetch(undefined, { page: number });
		}

		// region: Pagination
		// ---------------------------------------------------------------------------

		/**
		 * @return number
		 */
		protected getCurrentPage(): number {
			return this.collection._meta.pagination?.current_page ?? 1;
		}

		/**
		 * Calculates the starting page number to display in pagination based on
		 * current page and minPages/maxPages constraints
		 *
		 * @return number
		 */
		protected getStartingPage(): number {
			const currentPage = this.getCurrentPage();
			const totalPages = this.getTotalPages();
			const maxPagesToShow = this.maxPagesToShow;

			// If we can show all pages within maxPagesToShow, start from 1
			if (totalPages <= maxPagesToShow) {
				return 1;
			}

			const pagesBeforeCurrent = Math.floor(maxPagesToShow / 2);
			let startingPage = Math.max(1, currentPage - pagesBeforeCurrent);
			const potentialEndingPage = startingPage + maxPagesToShow - 1;

			if (potentialEndingPage > totalPages) {
				startingPage = Math.max(1, totalPages - maxPagesToShow + 1);
			}

			return startingPage;
		}

		/**
		 * Calculates the ending page number to display in pagination based on
		 * current page, starting page, and minPages/maxPages constraints
		 *
		 * @return number
		 */
		protected getEndingPage(): number {
			const startingPage = this.getStartingPage();
			const totalPages = this.getTotalPages();
			const maxPagesToShow = this.maxPagesToShow;
			let endingPage = Math.min(totalPages, startingPage + maxPagesToShow - 1);

			// Ensure we show at least minPagesToShow if available
			if (endingPage - startingPage + 1 < this.minPagesToShow) {
				endingPage = Math.min(totalPages, startingPage + this.minPagesToShow - 1);
			}

			return endingPage;
		}

		/**
		 * @return number
		 */
		protected getNextPage(): number {
			return ChalkySticks.Utility.Math.clamp(this.getCurrentPage() + 1, 1, this.getTotalPages());
		}

		/**
		 * Generates an array of page numbers to display
		 *
		 * @return number[]
		 */
		protected getPageNumbers(): number[] {
			const startingPage = this.getStartingPage();
			const endingPage = this.getEndingPage();
			const pageNumbers: number[] = [];

			for (let i = startingPage; i <= endingPage; i++) {
				pageNumbers.push(i);
			}

			return pageNumbers;
		}

		/**
		 * @return number
		 */
		protected getPreviousPage(): number {
			return ChalkySticks.Utility.Math.clamp(this.getCurrentPage() - 1, 1, this.getTotalPages());
		}

		/**
		 * @return number
		 */
		protected getTotalItems(): number {
			return this.collection._meta.pagination?.total ?? 0;
		}

		/**
		 * @return number
		 */
		protected getTotalPages(): number {
			return this.collection._meta.pagination?.total_pages ?? 1;
		}

		/**
		 * @return number
		 */
		protected getTotalPerPage(): number {
			return this.collection._meta.pagination?.per_page ?? 10;
		}

		// endregion: Pagination

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickFirst(e: PointerEvent): Promise<void> {
			e.preventDefault();

			this.fetchPage(1);
		}

		/**
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickPrevious(e: PointerEvent): Promise<void> {
			e.preventDefault();

			this.fetchPage(this.getPreviousPage());
		}

		/**
		 * @param PointerEvent e
		 * @param number pageNumber
		 * @return Promise<void>
		 */
		protected async Handle_OnClickPageNumber(e: PointerEvent, pageNumber: number): Promise<void> {
			e.preventDefault();

			this.fetchPage(pageNumber);
		}

		/**
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickNext(e: PointerEvent): Promise<void> {
			e.preventDefault();

			this.fetchPage(this.getNextPage());
		}

		/**
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickLast(e: PointerEvent): Promise<void> {
			e.preventDefault();

			this.fetchPage(this.getTotalPages());
		}

		/**
		 * @return Promise<void>
		 */
		@bind
		protected async Handle_OnFetchSuccess(): Promise<void> {
			this.$forceUpdate();
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	:root {
		--chalky-pagination-border: 1px solid var(--chalky-blue-4);

		--chalky-pagination-button-background: var(--chalky-blue-4);
		--chalky-pagination-button-background-hover: var(--chalky-blue-3);
		--chalky-pagination-button-background-active: var(--chalky-blue);

		--chalky-pagination-button-border: 0;
		--chalky-pagination-button-border-hover: 0;
		--chalky-pagination-button-border-active: 0;

		--chalky-pagination-button-color: var(--chalky-white);
		--chalky-pagination-button-color-hover: var(--chalky-white);
		--chalky-pagination-button-color-active: var(--chalky-white);
	}

	.chalky.utility-pagination {
		border: var(--chalky-pagination-border);
		border-radius: 0.44rem;
		display: flex;
		overflow: hidden;

		.debug {
			display: none;
		}

		button {
			background: var(--chalky-pagination-button-background);
			border: var(--chalky-pagination-button-border);
			border-radius: 0;
			color: var(--chalky-pagination-button-color);
			cursor: pointer;
			flex: 1;

			&.page-number {
				flex: 0;
				padding: 0;
				width: auto;
				min-width: 60px;
			}
		}
	}

	// User Interaction
	// ---------------------------------------------------------------------------

	.chalky.utility-pagination button:hover {
		background: var(--chalky-pagination-button-background-hover);
		border: var(--chalky-pagination-button-border-hover);
		color: var(--chalky-pagination-button-color-hover);
	}

	// State
	// ---------------------------------------------------------------------------

	.chalky.utility-pagination button:focus,
	.chalky.utility-pagination button:active,
	.chalky.utility-pagination button.active {
		background: var(--chalky-pagination-button-background-active);
		border: var(--chalky-pagination-button-border-active);
		color: var(--chalky-pagination-button-color-active);
	}
</style>
