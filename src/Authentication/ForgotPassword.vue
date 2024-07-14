<template>
	<div class="chalky authentication-forgotpassword">Sign In (opens dialog) Or avatars</div>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import { Component } from 'vue-property-decorator';

	/**
	 * @class AuthenticationForgotPassword
	 * @package Authentication
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class AuthenticationForgotPassword extends ViewBase {
		/**
		 * Function names to bind to class, typically used for event handlers
		 *
		 * Example:
		 *     ['Handle_OnEvent', 'Handle_On...']
		 *
		 * @type string[]
		 */
		public bindings: string[] = [];
	}
</script>

<style lang="scss">
	.chalky.authentication-forgotpassword {
		// Not implemented
	}
</style>
