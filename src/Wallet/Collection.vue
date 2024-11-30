<template>
	<section class="chalky wallet-collection">
		<div class="info">
			<h5 class="type-small-heading">Wallet</h5>
			<h4>{{ formattedBalance }}</h4>
		</div>

		<div class="action">
			<button v-if="canCollect" v-on:click="Handle_OnClickCollect">Collect</button>
			<h5 v-else class="type-small-heading">{{ timeSinceLastCollection }} until next collection</h5>
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
		/**
		 * @type boolean
		 */
		public get canCollect(): boolean {
			return this.userModel?.lastCollection?.canCollect() || !this.userModel?.lastCollection?.id;
		}

		/**
		 * @type string
		 */
		public get formattedBalance(): string {
			const amount: number = this.userModel.getWalletBalance() || 0;
			const formatter: Intl.NumberFormat = new Intl.NumberFormat('en-US', {
				currency: 'USD',
				style: 'currency',
			});
			const output = formatter.format(amount);

			return output;
		}

		/**
		 * @return string
		 */
		protected get timeSinceLastCollection(): string {
			const walletModel: ChalkySticks.Model.Wallet = this.userModel.lastCollection;
			const createdAt: Date = new Date(walletModel.getCreatedAt());
			createdAt.setSeconds(createdAt.getSeconds() + ChalkySticks.Constants.WALLET_COLLECTION_TIME);
			const timeUntil: string = ChalkySticks.Utility.Format.getRelativeTime(createdAt);

			return timeUntil;
		}

		/**
		 * @type ChalkySticks.Model.User
		 */
		@Prop({
			default: () => ChalkySticks.Factory.User.model(),
		})
		public userModel!: ChalkySticks.Model.User;

		/**
		 * @return void
		 */
		/**
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickCollect(e: PointerEvent): Promise<void> {
			e.preventDefault();

			// Collections
			const response = await ChalkySticks.Factory.Wallet.model().collect(this.$store.getters['authentication/token']);

			console.log('Response', response);

			this.$forceUpdate();
		}
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
