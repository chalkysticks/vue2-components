<template>
	<section class="chalky user-menu-notifications">
		<header class="header-base">
			<button class="control theme-dark size-medium type-left" v-on:click="$emit('click:back')">Back</button>

			<h3>Notifications</h3>

			<div class="actions">
				<button class="control theme-dark round size-medium type-close" v-on:click="$emit('click:close')"></button>
			</div>
		</header>

		<form id="userMenuNotifications" class="padded">
			<fieldset>
				<label>
					<h6>Email Notifications</h6>
					<input class="switch" type="checkbox" />
					<span>Receive email notifications</span>
				</label>

				<label>
					<h6>Push Notifications</h6>
					<input class="switch" type="checkbox" />
					<span>Receive push notifications</span>
				</label>

				<label>
					<h6>Friend Requests</h6>
					<input class="switch" type="checkbox" />
					<span>Receive friend request notifications</span>
				</label>

				<label>
					<h6>Event Reminders</h6>
					<input class="switch" type="checkbox" checked />
					<span>Receive event reminder notifications</span>
				</label>
			</fieldset>

			<fieldset class="actions">
				<button class="button-primary size-medium" type="submit">Save</button>
				<br />
				<br />
				<button class="button-secondary size-small" type="reset">Reset</button>
			</fieldset>
		</form>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '@/Utility/Decorators';

	/**
	 * @author ChalkySticks LLC
	 * @package User/Menu
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class UserMenuNotifications extends ViewBase {
		// Not implemented
	}
</script>

<style lang="scss">
	.chalky.user-menu-notifications {
		header {
			margin: 0 -2rem 1rem -2rem;
			width: auto;
		}

		.actions {
			text-align: center;
		}
	}
</style>
