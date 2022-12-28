<template>
	<div class="chalky authentication-resetpassword">
		Sign In
		(opens dialog)
		Or avatars
	</div>
</template>

<script lang="ts">
	import ViewBase from '../Core/Base';
	import Environment from '../Core/Environment';
	import { CollectionSchedule, ModelSchedule } from '@chalkysticks/sdk';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * @class AuthenticationResetPassword
	 * @package Authentication
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({})
	export default class AuthenticationResetPassword extends ViewBase {

		/**
		 * Function names to bind to class, typically used for event handlers
		 *
		 * Example:
		 *     ['Handle_OnEvent', 'Handle_On...']
		 *
		 * @type string[]
		 */
		public bindings: string[] = [
		];

		/**
		 * On created
		 **/
		constructor(options = {}) {
			super(options);

		}

		/**
		 * Attach events
		 *
		 * @return void
		 */
		public attachEvents(): void {
			//
		}

		/**
		 * Detach events
		 *
		 * @return void
		 */
		public detachEvents(): void {
			//
		}

	}
</script>

<style lang="scss">
	.chalky.authentication-resetpassword {
	}
</style>