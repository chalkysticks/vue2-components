<template>
	<section class="chalky scrolltobegin scroll-cta">
		<ChalkyBrandingBadge size="md" />

		<div class="grid">
			<div>
				<svg
					class="icon-swipe"
					height="100"
					viewBox="0 0 30 30"
					width="100"
					xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g fill="none" fill-rule="evenodd">
						<g fill="#fff" transform="translate(-315 -450)">
							<g transform="translate(317 450)">
								<path
									d="m9.65830621 13.2361379c-1.0029107.9155346-1.65830621 2.0608119-1.65830621 3.2838816v1.4891358c0 1.6557618 1.77071564 4.3768012 2.077038 4.8716168.5001715.8079487 1.3397711 2.0204121 2.026686 2.92413.1680257.2210579.4823209.2597667.7011781.0913739s.2593443-.479807.0913739-.7011781c-.5409904-.7129811-1.5415638-2.1627883-1.973314-2.8476291-.2978667-.4724753-1.922962-3.0283159-1.922962-4.3383135v-1.4891358c0-.8975663.49554599-1.7617673 1.3416938-2.5538258.1495282-.1399698.3997799-.3480051.6583062-.5435227l.0020334 3.077329c0 .2799988.2279661.5.4979666.5.2799997 0 .5020333-.173463.5020334-.5v-11.5c0-.55228475.4477152-1 1-1 .5522847 0 1 .44771525 1 1v8.5c0 .2761424.2238576.5.5.5s.5-.2238576.5-.5v-2.5c0-.5522847.4477152-1 1-1 .5522847 0 1 .4477153 1 1v2.5c0 .2761424.2238576.5.5.5s.5-.2238576.5-.5v-1.5c0-.5522847.4477152-1 1-1 .5522847 0 1 .4477153 1 1v2.5c0 .2761424.2238576.5.5.5s.5-.2238576.5-.5v-1.5c0-.5522847.4477152-1 1-1 .5522847 0 1 .4477153 1 1v3.5c-.0000002 3.2747192-2.0000002 6.3953247-2 9 0 .2761424.2238576.5.5.5s.5-.2238576.5-.5c-.0000002-2.2444458 1.9999998-5.7125854 2-9v-3.5c0-1.1045695-.8954305-2-2-2-.4116588 0-.7942691.1243714-1.1123052.3375886-.2733526-.7790169-1.015293-1.3375886-1.8876948-1.3375886-.4116588 0-.7942691.1243714-1.1123052.3375886-.2733526-.7790169-1.015293-1.3375886-1.8876948-1.3375886-.3642871 0-.7058266.09739429-1 .26756439v-4.26756439c0-1.1045695-.8954305-2-2-2s-2 .8954305-2 2v7.2102334c-.4945144.2980073-.9895705.7026028-1.34372719 1.0259045z"
									transform="matrix(.809 -.588 .588 .809 -5.467 12.174)"
								></path>
								<path
									d="m4.14644661 15.1464466c.19526215-.1952621.51184463-.1952621.70710678 0 .19526215.1952622.19526215.5118446 0 .7071068l-2 2c-.19526215.1952621-.51184463.1952621-.70710678 0l-2-2c-.19526215-.1952622-.19526215-.5118446 0-.7071068.19526215-.1952621.51184464-.1952621.70710678 0l1.14644661 1.1464466v-8.7928932c0-.27614237.22385763-.5.5-.5s.5.22385763.5.5v8.7957459z"
									transform="matrix(1 0 0 -1 0 25)"
								></path>
							</g>
						</g>
					</g>
				</svg>
			</div>
			<div>
				<h5>Swipe up to begin</h5>
				<p>Best viewed in full screen. iPhones require you to swipe up to begin.</p>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
	import Base from '../Core/Base';
	import { Component } from 'vue-property-decorator';

	/**
	 * @author ChalkySticks LLC
	 * @package Utility
	 * @project ChalkySticks SDK Vue2.0 Components
	 */
	@Component
	export default class UtilityScrollToBegin extends Base {
		// Not implemented
	}
</script>

<style lang="scss">
	@import '../Theme/App/Mixins.scss';

	.chalky.scrolltobegin {
		align-items: center;
		background-color: var(--chalky-blue-4);
		display: flex;
		height: 100vh;
		justify-content: center;
		position: relative;
		text-align: center;

		.grid {
			display: grid;
			gap: 1rem;
			grid-template-columns: repeat(2, 1fr);
			grid-template-rows: 1fr;
			margin: 0 auto;
			width: 70%;
		}

		.chalky.branding-badge {
			left: 50%;
			position: absolute;
			top: 2rem;
			transform: translate(-50%, 0);
		}

		.icon-swipe {
			animation: scroll-to-begin-finger 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 3;
			margin-top: -1rem;
		}

		p {
			margin: 0.5rem auto;
			max-width: 250px;
		}
	}

	// Media Queries
	// ---------------------------------------------------------------------------

	@include media-query('mobile-portrait') {
		.chalky.scrolltobegin {
			display: none;
		}
	}

	// State
	// ---------------------------------------------------------------------------

	.chalky.scrolltobegin.state-active {
		position: fixed;
	}

	// Animations
	// ---------------------------------------------------------------------------

	@keyframes scroll-to-begin-finger {
		0% {
			opacity: 0;
			transform: translateY(20px);
		}

		80% {
			opacity: 1;
			transform: translateY(0);
		}

		85% {
			opacity: 0;
			transform: translateY(0);
		}

		100% {
			opacity: 0;
			transform: translateY(20px);
		}
	}
</style>
