<template>
	<div class="alert-prompt-example">
		<h2>AlertPrompt Examples</h2>

		<div class="examples">
			<button class="example-button" v-on:click="showBasicAlert">Basic Alert</button>
			<button class="example-button" v-on:click="showConfirmDialog">Confirmation</button>
			<button class="example-button" v-on:click="showOptionsPrompt">Options Prompt</button>
			<button class="example-button" v-on:click="showCustomButtons">Custom Buttons</button>
		</div>

		<div class="result" v-if="result !== null">
			<h3>Last Result:</h3>
			<pre>{{ result }}</pre>
		</div>

		<!-- The AlertPrompt component -->
		<UtilityAlertPrompt ref="alertPrompt" v-on:result="handleResult" />
	</div>
</template>

<script lang="ts">
	import ViewBase from '../Core/Base';
	import UtilityAlertPrompt from '../Utility/AlertPrompt.vue';
	import { Component } from 'vue-property-decorator';

	/**
	 * Example component demonstrating how to use the AlertPrompt component
	 *
	 * @author ChalkySticks LLC
	 * @package Example
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component({
		components: {
			UtilityAlertPrompt,
		},
	})
	export default class AlertPromptExample extends ViewBase {
		/**
		 * The result of the last alert interaction
		 */
		private result: any = null;

		/**
		 * Show a basic alert with a simple OK button
		 */
		private async showBasicAlert(): Promise<void> {
			const alertPrompt = this.$refs.alertPrompt as UtilityAlertPrompt;

			await alertPrompt.alert('This is a basic alert message!', 'Basic Alert');
		}

		/**
		 * Show a confirmation dialog with Yes/No buttons
		 */
		private async showConfirmDialog(): Promise<void> {
			const alertPrompt = this.$refs.alertPrompt as UtilityAlertPrompt;

			await alertPrompt.confirm('Are you sure you want to proceed with this action?', 'Confirmation');
		}

		/**
		 * Show a prompt with multiple options
		 */
		private async showOptionsPrompt(): Promise<void> {
			const alertPrompt = this.$refs.alertPrompt as UtilityAlertPrompt;

			await alertPrompt.prompt('Please select a difficulty level:', 'Game Settings', [
				{
					text: 'Easy',
					type: 'tertiary',
					value: 'easy',
				},
				{
					text: 'Medium',
					type: 'secondary',
					value: 'medium',
				},
				{
					text: 'Hard',
					type: 'primary',
					value: 'hard',
				},
			]);
		}

		/**
		 * Show an alert with custom buttons and callbacks
		 */
		private async showCustomButtons(): Promise<void> {
			const alertPrompt = this.$refs.alertPrompt as UtilityAlertPrompt;
			await alertPrompt.show('Your session is about to expire. What would you like to do?', 'Session Expiring', [
				{
					callback: () => console.log('Logging out...'),
					text: 'Logout',
					type: 'tertiary',
					value: 'logout',
				},
				{
					callback: () => console.log('Extending session...'),
					text: 'Continue',
					type: 'primary',
					value: 'continue',
				},
			]);
		}

		/**
		 * Handle the result from the alert prompt
		 *
		 * @param value - The result value from the alert
		 */
		private handleResult(value: any): void {
			this.result = value;
			console.log('AlertPrompt result:', value);
		}
	}
</script>

<style lang="scss">
	.alert-prompt-example {
		padding: 20px;

		h2 {
			margin-bottom: 20px;
		}

		.examples {
			display: flex;
			flex-wrap: wrap;
			gap: 12px;
			margin-bottom: 20px;
		}

		.example-button {
			background-color: #3498db;
			border: none;
			border-radius: 4px;
			color: white;
			cursor: pointer;
			font-size: 14px;
			padding: 10px 16px;
			transition: background-color 0.2s;

			&:hover {
				background-color: #2980b9;
			}
		}

		.result {
			background-color: #f5f5f5;
			border-radius: 4px;
			margin-top: 20px;
			padding: 16px;

			h3 {
				margin-bottom: 10px;
			}

			pre {
				background-color: #eee;
				border-radius: 4px;
				padding: 10px;
			}
		}
	}
</style>
