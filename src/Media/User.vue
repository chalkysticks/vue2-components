<template>
	<ChalkyMediaFeed class="chalky media-user" v-bind:mediaCollection="userMediaCollection" v-bind="$attrs" v-on="$listeners"></ChalkyMediaFeed>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '../Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package Media/User
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class MediaUserExterior extends ViewBase {
		/**
		 * @type number
		 */
		@Prop({ default: 1 })
		public limit!: number;

		/**
		 * @type ChalkySticks/Collection/UserMedia
		 */
		@Prop({
			default: () => ChalkySticks.Factory.UserMedia.collection(),
		})
		public userMediaCollection!: ChalkySticks.Collection.UserMedia;

		/**
		 * @return void
		 */
		public mounted(): void {
			this.userMediaCollection.setQueryParam('limit', this.limit.toString());
			this.userMediaCollection.person().random().fetch();
		}
	}
</script>
