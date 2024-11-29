<template>
	<section class="chalky wallet-collection">
		<div class="info">
			<h5 class="type-small-heading">Wallet</h5>
			<h4>$2,102</h4>
		</div>

		<div class="action">
			<!-- <button>Collect</button> -->
			<h5 class="type-small-heading">6 hours until next collection</h5>
		</div>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package Wallet
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class WalletCollection extends ViewBase {
		// Not implemented
	}
</script>

<style lang="scss">
	.chalky.wallet-collection {
		align-items: center;
		background-color: var(--chalky-blue);
		border-radius: var(--border-radius-outer);
		display: flex;
		gap: 1rem;
		justify-content: space-between;
		margin: 1rem 0;
		padding: 1rem 1.5rem;

		.info {
			width: 30%;
		}

		h5 {
			color: var(--chalky-grey-3);
			margin: 0;
		}

		.action h5 {
			text-align: center;
			width: fit-content;
		}
	}
</style>
