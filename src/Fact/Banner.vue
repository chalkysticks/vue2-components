<template>
	<section class="chalky fact-banner">
		<p>{{ factCollection.shuffle().at(0).getFact() }}</p>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package Fact
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class FactBanner extends ViewBase {
		/**
		 * @type ChalkySticks/Collection/Fact
		 */
		@Prop({
			default: () => ChalkySticks.Factory.Fact.collection(),
		})
		public factCollection!: ChalkySticks.Collection.Fact;

		/**
		 * @return void
		 */
		public mounted(): void {
			this.factCollection.fetch();
		}
	}
</script>

<style lang="scss">
	.chalky.fact-banner {
		// Not implemented
	}
</style>
