<template>
	<section class="chalky user-menu-profile">
		<header class="header-base">
			<button class="control theme-dark size-medium type-left" v-on:click="$emit('click:back')">Back</button>
			<h3>Profile</h3>
			<div class="actions">
				<button class="control theme-dark round size-medium type-close" v-on:click="$emit('click:close')"></button>
			</div>
		</header>

		<FormUserProfilePhoto v-bind:userModel="userModel" v-on:remove="Handle_OnRemoveAvatar" v-on:select="Handle_OnSelectAvatar" />

		<form id="userMenuProfile" v-on:submit="Handle_OnFormSubmit">
			<fieldset>
				<label>
					<h6>Name</h6>
					<input type="text" placeholder="Enter name" v-model="userModel.attributes.name" />
				</label>

				<figure class="google-login padded background-chalky-blue" v-if="userModel.attributes.is_google">
					<img class="filter-invert" src="~@chalkysticks/sass/build/asset/image/icon/social-google.svg" />

					<div>
						<h5>Logged in With Google</h5>
						<p>{{ userModel.attributes.email }}</p>
					</div>
				</figure>

				<label v-else>
					<h6>Email Address</h6>
					<input disabled type="email" placeholder="Enter email" v-model="userModel.attributes.email" />
					<small class="type-message">This field is cannot be changed.</small>
				</label>

				<label>
					<h6>Bio</h6>
					<textarea type="text" placeholder="Tell us about yourself and your game" v-model="userModel.biography"></textarea>
				</label>

				<label>
					<h6>Phone</h6>
					<input type="text" placeholder="Phone number (optional)" v-model="userModel.attributes.phone" />
				</label>

				<label>
					<h6>Hometown</h6>
					<input type="text" placeholder="Where are you from" v-model="userModel.hometown" />
				</label>

				<!-- {{ userModel.authCheckin }} -->
				<!-- {{ userModel.talentLevel }} -->

				<hr />

				<h5 class="push-bottom">Games you play</h5>

				<section class="games-played push-bottom">
					<label>
						<input class="switch" type="checkbox" v-model="userModel.plays8Ball" />
						<span>8 Ball</span>
					</label>

					<label>
						<input class="switch" type="checkbox" v-model="userModel.plays9Ball" />
						<span>9 Ball</span>
					</label>

					<label>
						<input class="switch" type="checkbox" v-model="userModel.plays10Ball" />
						<span>10 Ball</span>
					</label>

					<label>
						<input class="switch" type="checkbox" v-model="userModel.playsArtistic" />
						<span>Artistic</span>
					</label>

					<label>
						<input class="switch" type="checkbox" v-model="userModel.playsBanks" />
						<span>Banks</span>
					</label>

					<label>
						<input class="switch" type="checkbox" v-model="userModel.playsBilliards" />
						<span>Billiards</span>
					</label>

					<label>
						<input class="switch" type="checkbox" v-model="userModel.playsOneCushion" />
						<span>One Cushion</span>
					</label>

					<label>
						<input class="switch" type="checkbox" v-model="userModel.playsOnePocket" />
						<span>One Pocket</span>
					</label>

					<label>
						<input class="switch" type="checkbox" v-model="userModel.playsPyramid" />
						<span>Pyramid</span>
					</label>

					<label>
						<input class="switch" type="checkbox" v-model="userModel.playsSnooker" />
						<span>Snooker</span>
					</label>

					<label>
						<input class="switch" type="checkbox" v-model="userModel.playStraight" />
						<span>Straight Pool</span>
					</label>
				</section>
			</fieldset>

			<figure v-if="isSaved" class="padded text-center">
				<img class="icon filter-invert" src="~@chalkysticks/sass/build/asset/image/icon/checkmark.svg" />
			</figure>

			<fieldset v-else class="actions">
				<button class="button-primary size-medium" type="submit">Save</button>
			</fieldset>
		</form>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import FormUserProfilePhoto from '../../Form/UserProfilePhoto.vue';
	import UserAvatar from '../Avatar.vue';
	import ViewBase from '../../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package User/Menu
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({
		components: {
			FormUserProfilePhoto,
			UserAvatar,
		},
	})
	export default class UserMenuProfile extends ViewBase {
		/**
		 * @return Store
		 */
		public get store(): any {
			return ChalkySticks.Core.Provider.Store.get();
		}

		/**
		 * @return ChalkySticks.Model.User
		 */
		public get userModel(): ChalkySticks.Model.User {
			return this.store.getters['authentication/user'];
		}

		/**
		 * @type boolean
		 */
		protected isSaved: boolean = false;

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @param SubmitEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnFormSubmit(e: SubmitEvent): Promise<void> {
			e.preventDefault();

			const userModel = this.store.getters['authentication/user'];

			// Save to backend
			await userModel?.save();

			// Show save indicator for 2 seconds
			this.isSaved = true;
			setTimeout(() => (this.isSaved = false), 2000);
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnRemoveAvatar(): Promise<void> {
			this.$forceUpdate();
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnSelectAvatar(): Promise<void> {
			this.$forceUpdate();
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.user-menu-profile {
		header {
			margin: 0 -2rem 1rem -2rem;
			width: auto;
		}

		.actions {
			margin-bottom: 1rem;
			text-align: center;
		}

		.google-login {
			align-items: center;
			display: flex;
			gap: 1rem;
			margin-bottom: 2rem;

			p {
				margin: 0;
			}
		}

		.games-played {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
			grid-template-rows: auto;
			gap: 1rem;

			label {
				margin: 0.5rem 0;
			}
		}
	}
</style>
