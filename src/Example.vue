<template>
	<div id="app" style="background: var(--chalky-blue); color: #fff;">
		<section class="level-0">
			<header>
				<h2>Branding</h2>
			</header>

			<section class="level-1">
				<header>
					<h3>Badges</h3>
				</header>
				<div>
					<BrandingBadge size="sm" mode="dark" />
					<BrandingBadge size="sm" mode="light" />
				</div>
				<div>
					<BrandingBadge size="md" mode="dark" />
					<BrandingBadge size="md" mode="light" />
				</div>
				<div>
					<BrandingBadge size="lg" mode="dark" />
					<BrandingBadge size="lg" mode="light" />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Standard Branding</h3>
				</header>
				<div class="d-flex">
					<BrandingStandard class="background-chalky-white p-3" mode="dark" />
					<BrandingStandard class="background-chalky-blue p-3" mode="light" />
				</div>
			</section>
		</section>

		<section class="level-0">
			<header>
				<h2>Authentication</h2>
			</header>
			<section class="level-1">
				<header>
					<h3>Standard Login</h3>
					<p>
						<small>
							Submit won't work here because <br />of the modal for some reason.
						</small>
					</p>
				</header>
				<div>
					<AuthenticationBasicLogin :authModel="authModel" />
				</div>
			</section>
			<section class="level-1">
				<header>
					<h3>Social Login</h3>
				</header>
				<div>
					<AuthenticationSocialLogin />
				</div>
			</section>
			<section class="level-1">
				<header>
					<h3>Login Header</h3>
				</header>
				<div>
					<AuthenticationNavigation :authModel="authModel" />
				</div>
			</section>
			<section class="level-1">
				<header>
					<h3>Auth Panel</h3>
				</header>
				<div>
					<AuthenticationAuthPanel :authModel="authModel" />
				</div>
			</section>
		</section>

		<section class="level-0">
			<header>
				<h2>Television</h2>
			</header>

			<section class="level-1">
				<header>
					<h3>VideoTheater</h3>

					<p>
						<strong>@todo</strong>
					</p>
					<p style="width: 250px;">
						I would like to hook this up to a Players API endpoint
						that pulls in specific player info. Also create a new
						schedule view like Hulu / YTTV.
					</p>
				</header>
				<div>
					<TvVideoTheater ref="videoTheater" channel="billiards" />

					<form>
						<select v-on:change="Handle_OnChangeTvChannel">
							<option value="">Chalky</option>
							<option value="1-pocket">1-pocket</option>
							<option value="8-ball">8-ball</option>
							<option value="9-ball">9-ball</option>
							<option value="10-ball">10-ball</option>
							<option value="billiards">billiards</option>
							<option value="snooker">snooker</option>
							<option value="straight">straight</option>
							<option value="trickshot">trickshot</option>
						</select>
					</form>
				</div>
			</section>
		</section>

		<section class="level-0">
			<header>
				<h2>Venues</h2>
			</header>

			<section class="level-1">
				<header>
					<h3>Venue List</h3>

					<p><small>@todo add location</small></p>
				</header>
				<div>
					<VenueList />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Venue Card</h3>
				</header>
				<div>
					<VenueCard />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Venue Map</h3>
				</header>
				<div>
					<VenueMap />
				</div>
			</section>
		</section>

		<section class="level-0">
			<header>
				<h2>Wallet</h2>
			</header>
		</section>
	</div>
</template>

<script lang="ts">
	import AuthenticationAuthPanel from '@/Authentication/AuthPanel.vue';
	import TvVideoTheater from '@/TV/TvVideoTheater.vue';
	import { VideoTheaterChannel } from '@/TV/VideoTheater.vue';
	import { Constants, ModelAuthentication } from '@chalkysticks/sdk';
	import { Component, Prop, Ref, Vue } from 'vue-property-decorator';

	@Component({
		components: {
			AuthenticationAuthPanel,
		},
	})
	export default class Example extends Vue {
		/**
		 * @type TVVideoTheater
		 */
		@Ref('videoTheater')
		readonly videoTheater!: typeof TvVideoTheater;

		/**
		 * @type ChalkySticks/Model/Authentication
		 */
		@Prop({
			default: () => new ModelAuthentication(undefined, {
				baseUrl: Constants.API_URL_V1,
			})
		})
		public authModel!: ModelAuthentication;

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @param Event e
		 * @return Promise<void>
		 */
		protected async Handle_OnChangeTvChannel(e: Event): Promise<void> {
			e.preventDefault();

			const target: HTMLSelectElement = e.currentTarget as HTMLSelectElement;
			const gameType: string = target.value;

			this.videoTheater.setByGame(gameType);
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	#app {
		-moz-osx-font-smoothing: grayscale;
		-webkit-font-smoothing: antialiased;
		color: #2c3e50;
		font-family: Avenir, Helvetica, Arial, sans-serif;
		margin: 0 auto;
		padding: 2rem;
		text-align: left;

		.level-0 {
			margin: 2rem 0;
			padding: 2rem 0;
		}

		.level-1 {
			margin: 2rem 0;
			padding-left: 300px;

			> header {
				float: left;
				margin-left: -300px;
			}
		}

		h2 {
			color: #D1D1D1;
			font-size: 1.75rem;
			font-weight: 700;
			letter-spacing: -0.05rem;
			text-transform: uppercase;
		}

		h3 {
			font-size: 1.5rem;
			font-weight: 500;
			letter-spacing: -0.05rem;
		}
	}
</style>
