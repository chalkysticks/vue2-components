<template>
	<div class="chalky authentication-signupcta" v-if="allowSignup">
		<p class="signup-cta-wrapper">
			<span>Don't have an account?</span>

			<a href="/sign-up" title="Sign up" v-on:click="Handle_OnClickSignup">
				<span>Sign up</span>
			</a>
		</p>
	</div>
</template>

<script lang="ts">
	import ViewBase from '../Core/Base';
	import { Component, Prop } from 'vue-property-decorator';

	/**
	 * @class AuthenticationSignupCTA
	 * @package Authentication
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class AuthenticationSignupCTA extends ViewBase {
		/**
		 * Whether or not to allow signup
		 *
		 * @type boolean
		 */
		@Prop({ default: true })
		public allowSignup!: boolean;

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickSignup(e: PointerEvent): Promise<void> {
			e.preventDefault();

			this.$emit('signup-click');
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.chalky.authentication-signupcta {
		margin: 0 auto;
		max-width: 500px;
		text-align: center;

		.signup-cta-wrapper {
			color: var(--chalky-grey-2);
			margin-bottom: 0;
			padding: 1rem 0;

			a {
				color: var(--chalky-white);
				margin: 0 0.5em;
				text-decoration: none;
				transition: color 0.15s ease-in-out;
			}
		}
	}
</style>
