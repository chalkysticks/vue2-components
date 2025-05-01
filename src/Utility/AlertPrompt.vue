<template>
	<section
		class="chalky utility-alert-prompt"
		v-bind:class="{
			'state-visible': visible,
		}"
	>
		<div class="dark-panel" v-on:click="Handle_OnClickBackdrop"></div>

		<div class="alert-container">
			<header class="alert-header" v-if="title">
				<h3>{{ title }}</h3>
			</header>

			<section class="alert-content">
				<slot>{{ message }}</slot>
			</section>

			<footer>
				<div class="alert-buttons">
					<button
						v-bind:class="['alert-button', 'size-small', 'button-' + (button.type || 'default')]"
						v-bind:key="index"
						v-for="(button, index) in buttons"
						v-on:click="Handle_OnClickButton(button)"
					>
						{{ button.text }}
					</button>
				</div>
			</footer>
		</div>
	</section>
</template>

<script lang="ts">
	import ChalkySticks from '@chalkysticks/sdk';
	import ViewBase from '../Core/Base';
	import gsap from 'gsap';
	import { Component, Prop } from 'vue-property-decorator';
	import { beforeDestroy, mounted } from '../Utility/Decorators';

	type AlertType = 'default' | 'primary' | 'secondary' | 'tertiary';

	type AlertOption = {
		callback?: () => void;
		name?: string;
		text: string;
		type?: AlertType;
		value?: any;
	};

	/**
	 * A flexible alert/prompt overlay modal component that makes it easy to display
	 * notifications, confirmations, or simple prompts to users.
	 *
	 * @example
	 *
	 * // Basic usage
	 * this.$refs.alertPrompt.show('Hello World', 'Information');
	 *
	 * // With custom buttons
	 * this.$refs.alertPrompt.show(
	 *   'Are you sure you want to delete this item?',
	 *   'Confirm Delete',
	 *   [
	 *     { text: 'Cancel', type: 'default' },
	 *     { text: 'Delete', type: 'danger', callback: () => this.deleteItem() }
	 *   ]
	 * );
	 *
	 * // In your template
	 * <UtilityAlertPrompt ref="alertPrompt" v-on:result="Handle_OnAlertResult" />
	 *
	 * @author ChalkySticks LLC
	 * @package Utility
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class UtilityAlertPrompt extends ViewBase {
		/**
		 * Whether clicking on the backdrop should close the alert
		 *
		 * @type boolean
		 */
		@Prop({ default: true })
		public closeOnBackdropClick!: boolean;

		/**
		 * The buttons to display in the alert
		 *
		 * @type AlertOption[]
		 */
		private buttons: AlertOption[] = [];

		/**
		 * The message to display in the alert
		 *
		 * @type string
		 */
		private message: string = '';

		/**
		 * The title to display in the alert header
		 *
		 * @type title
		 */
		private title: string = '';

		/**
		 * Whether the alert is currently visible
		 *
		 * @type boolean
		 */
		private visible: boolean = false;

		/**
		 * @return void
		 */
		@mounted
		public attachEvents(): void {
			document.addEventListener('keydown', this.Handle_OnKeyDown);
		}

		/**
		 * @return void
		 */
		@beforeDestroy
		public detachEvents(): void {
			document.removeEventListener('keydown', this.Handle_OnKeyDown);
		}

		/**
		 * Show the alert with the specified message, title, and buttons
		 *
		 * @param message - The message to display
		 * @param title - The title to display (optional)
		 * @param buttons - The buttons to display (optional)
		 * @return Promise that resolves with the button value when a button is clicked
		 */
		public show(
			message: string,
			title: string = '',
			buttons: AlertOption[] = [
				{
					name: '',
					text: 'OK',
					type: 'primary',
					value: true,
				},
			],
		): Promise<any> {
			this.buttons = buttons;
			this.message = message;
			this.title = title;
			this.visible = true;

			return new Promise((resolve) => {
				this.$once('result', (value: any) => resolve(value));
			});
		}

		/**
		 * Close the alert
		 *
		 * @param result - The result to emit
		 * @return void
		 */
		public close(value: any = null, name: string = ''): void {
			this.visible = false;
			this.$emit('result', value);

			ChalkySticks.Core.Event.Bus.dispatch(`alert`, {
				name,
				value,
			});

			if (name) {
				this.$emit(`result:${name}`, value);
				ChalkySticks.Core.Event.Bus.dispatch(`alert:${name}`, value);
			}
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * Handle button click
		 *
		 * @param button - The button that was clicked
		 * @return Promise<void>
		 */
		private async Handle_OnClickButton(button: any): Promise<void> {
			if (button.callback) {
				button.callback();
			}

			const name = button.name || '';
			const value = button.value !== undefined ? button.value : button.text;

			this.close(value, name);
		}

		/**
		 * Handle backdrop click
		 *
		 * @return Promise<void>
		 */
		private async Handle_OnClickBackdrop(): Promise<void> {
			if (this.closeOnBackdropClick) {
				this.close(null);
			}
		}

		/**
		 * @param KeyboardEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnKeyDown(e: KeyboardEvent): Promise<void> {
			e.preventDefault();

			switch (e.key) {
				case 'Escape':
					if (this.visible) {
						this.close(null);
					}
					break;

				case 'Enter':
					if (this.visible && this.buttons.length > 0) {
						const primaryButton = this.buttons.find((btn) => btn.type === 'primary');

						if (primaryButton) {
							await this.Handle_OnClickButton(primaryButton);
						}
					}
					break;

				default:
					break;
			}
		}

		// endregion: Event Handlers

		// region: Helper Methods
		// ---------------------------------------------------------------------------

		/**
		 * Show an alert with a single OK button
		 *
		 * @param message - The message to display
		 * @param title - The title to display (optional)
		 * @return Promise that resolves when the OK button is clicked
		 */
		public alert(message: string, title: string = ''): Promise<void> {
			return this.show(message, title, [
				{
					text: 'OK',
					type: 'primary',
					value: true,
				},
			]);
		}

		/**
		 * Show a confirmation with Yes/No buttons
		 *
		 * @param message - The message to display
		 * @param title - The title to display (optional)
		 * @return Promise that resolves with true for Yes, false for No
		 */
		public confirm(message: string, title: string = ''): Promise<boolean> {
			return this.show(message, title, [
				{
					text: 'No',
					type: 'secondary',
					value: false,
				},
				{
					text: 'Yes',
					type: 'primary',
					value: true,
				},
			]);
		}

		/**
		 * Show a prompt with custom buttons
		 *
		 * @param message - The message to display
		 * @param title - The title to display (optional)
		 * @param options - Array of option objects with text and value
		 * @return Promise that resolves with the selected option value
		 */
		public prompt(message: string, title: string = '', options: AlertOption[]): Promise<any> {
			return this.show(message, title, options);
		}

		// endregion: Helper Methods
	}
</script>

<style lang="scss">
	.utility-alert-prompt {
		align-items: center;
		display: flex;
		height: 100svh;
		justify-content: center;
		left: 0;
		position: fixed;
		top: 0;
		width: 100svw;
		z-index: var(--z-modal-bottom);

		.dark-panel {
			background-color: rgba(0, 0, 0, 0.75);
			height: 100%;
			left: 0;
			position: absolute;
			top: 0;
			width: 100%;
			z-index: var(--z-modal-mid);
		}

		.alert-container {
			background: var(--chalky-blue-4);
			border-radius: var(--border-radius-inner);
			color: var(--chalky-white);
			display: flex;
			flex-direction: column;
			margin: 0 auto;
			min-width: 300px;
			min-height: 200px;
			max-height: 90svh;
			max-width: 85svw;
			outline: 1px solid var(--chalky-grey-4);
			overflow: hidden;
			position: relative;
			width: calc(var(--chalky-authpanel-graphic-width) + var(--chalky-authpanel-content-width));
			z-index: var(--z-modal-top);

			header {
				align-items: center;
				background-color: var(--chalky-blue-2);
				border-top-right-radius: var(--border-radius-inner);
				border-top-left-radius: var(--border-radius-inner);
				content: ' ';
				display: flex;
				justify-content: center;
				overflow: hidden;
				padding: 0.75rem 1rem;
				position: relative;
				width: var(--chalky-authpanel-graphic-width);
			}

			.alert-content {
				flex: 1;
				padding: 1rem 2rem;
				overflow-y: auto;
				text-align: center;
			}

			footer {
			}
		}

		.alert-buttons {
			display: flex;
			gap: 0.5rem;
			justify-content: flex-end;
			padding: 1rem;
		}
	}

	// State
	// ---------------------------------------------------------------------------

	.utility-alert-prompt:not(.state-visible) {
		pointer-events: none;
		z-index: -1;
	}
</style>
