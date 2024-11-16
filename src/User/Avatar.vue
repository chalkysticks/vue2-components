<template>
	<section class="chalky user-avatar">
		<span class="notification badge rounded-pill bg-danger" v-if="notificataionCount">{{ notificataionCount }}</span>

		<picture class="avatar" v-bind:class="'size-' + size">
			<source v-bind:srcset="avatarUrl" />
			<img class="icon" src="~@chalkysticks/sass/build/asset/image/icon/user-profile.svg" />
		</picture>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package User
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class UserAvatar extends ViewBase {
		/**
		 * @return string
		 */
		public get avatarUrl(): string {
			return this.userModel.avatar.getUrl();
		}

		/**
		 * @return number
		 */
		public get notificataionCount(): number {
			return 0;
		}

		/**
		 * @return string
		 */
		@Prop({ default: 'md' })
		public size!: string;

		/**
		 * @type ChalkySticks/Model/User
		 */
		@Prop({
			default: () => new ChalkySticks.Model.User(),
		})
		public userModel!: ChalkySticks.Model.User;
	}
</script>

<style lang="scss">
	.user-avatar {
		position: relative;
		overflow: visible;

		.notification {
			position: absolute;
			right: 0;
			top: 0;
			z-index: 1;
		}

		img {
			margin: 0;
		}
	}
</style>
