<template>
	<div class="chalky authentication-resetpassword">Sign In (opens dialog) Or avatars</div>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * @class AuthenticationResetPassword
	 * @package Authentication
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class AuthenticationResetPassword extends ViewBase {
		/**
		 * Function names to bind to class, typically used for event handlers
		 *
		 * Example:
		 *     ['Handle_OnEvent', 'Handle_On...']
		 *
		 * @type string[]
		 */
		public bindings: string[] = [];

		/**
		 * Constructor
		 */
		constructor(options = {}) {
			super(options);
		}
	}
</script>

<style lang="scss">
	.chalky.authentication-resetpassword {
		// Not implemented
	}
</style>
