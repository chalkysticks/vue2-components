<template>
	<div class="app" style="background: var(--chalky-blue); color: #fff">
		<section class="level-0">
			<header>
				<h2>Branding</h2>
			</header>

			<section class="level-1">
				<header>
					<h3>Badges</h3>

					<dl>
						<dt>Size</dt>
						<dd>sm, md, lg</dd>

						<dt>Mode</dt>
						<dd>dark, light</dd>
					</dl>
				</header>
				<div>
					<ChalkyBrandingBadge size="sm" mode="dark" />
					<ChalkyBrandingBadge size="sm" mode="light" />
				</div>
				<div>
					<ChalkyBrandingBadge size="md" mode="dark" />
					<ChalkyBrandingBadge size="md" mode="light" />
				</div>
				<div>
					<ChalkyBrandingBadge size="lg" mode="dark" />
					<ChalkyBrandingBadge size="lg" mode="light" />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Standard Branding</h3>

					<dl>
						<dt>Class</dt>
						<dd>
							background-chalky-white,
							<br />
							background-chalky-blue
						</dd>

						<dt>Mode</dt>
						<dd>dark, light</dd>
					</dl>
				</header>
				<div class="d-flex">
					<ChalkyBrandingStandard class="background-chalky-white p-3" mode="light" />
					<ChalkyBrandingStandard class="background-chalky-blue p-3" mode="dark" />
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
							Submit won't work here because
							<br />
							of the modal for some reason.
						</small>
					</p>
				</header>
				<div>
					<ChalkyAuthenticationBasicLogin
						v-bind:authModel="authModel"
						v-on:success="Handle_OnLoginSuccess"
						v-on:error="Handle_OnLoginError"
					/>
				</div>
			</section>
			<section class="level-1">
				<header>
					<h3>Social Login</h3>
				</header>
				<div>
					<ChalkyAuthenticationSocialLogin />
				</div>
			</section>
			<section class="level-1">
				<header>
					<h3>Login Header</h3>
				</header>
				<div>
					<ChalkyAuthenticationNavigation
						v-bind:authModel="authModel"
						v-on:success="Handle_OnLoginSuccess"
						v-on:error="Handle_OnLoginError"
					/>
				</div>
			</section>
			<section class="level-1">
				<header>
					<h3>Auth Panel</h3>
				</header>
				<div>
					<ChalkyAuthenticationAuthPanel
						v-bind:authModel="authModel"
						v-on:success="Handle_OnLoginSuccess"
						v-on:error="Handle_OnLoginError"
					/>
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
					<p style="width: 250px">
						I would like to hook this up to a Players API endpoint that pulls in specific player info.
						<br />
						Also create a new schedule view like Hulu / YTTV.
					</p>
				</header>
				<div>
					<ChalkyTvVideoTheater ref="videoTheater" channel="billiards" />

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
					<ChalkyVenueList />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Venue Card</h3>
				</header>
				<div>
					<ChalkyVenueCard />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Venue Map</h3>
				</header>
				<div>
					<ChalkyVenueMap
						v-bind:venueCollection="venueCollection"
						v-bind:latitude="mapLatitude"
						v-bind:longitude="mapLongitude"
						v-bind:zoom="mapZoom"
						v-on:marker:click="Handle_OnClickMapMarker"
						v-on:map:move="Handle_OnMoveMap"
					/>
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
	import ChalkySticks from '@chalkysticks/sdk';
	import ChalkyVideoTheater from '@/TV/TvVideoTheater.vue';
	import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
	import { VideoTheaterChannel } from '@/TV/VideoTheater.vue';

	@Component({
		components: {
			AuthenticationAuthPanel,
		},
	})
	export default class Example extends Vue {
		/**
		 * @type ChalkyVideoTheater
		 */
		@Ref('videoTheater')
		readonly videoTheater!: typeof ChalkyVideoTheater;

		/**
		 * @type ChalkySticks/Model/Authentication
		 */
		@Prop({
			default: () =>
				new ChalkySticks.Model.Authentication(undefined, {
					baseUrl: ChalkySticks.Core.Constants.API_URL_V1,
				}),
		})
		public authModel!: ChalkySticks.Model.Authentication;

		/**
		 * @type ChalkySticks/Collection/Venue
		 */
		@Prop({
			default: () =>
				new ChalkySticks.Collection.Venue({
					baseUrl: ChalkySticks.Core.Constants.API_URL_V1,
				}),
		})
		public venueCollection!: ChalkySticks.Collection.Venue;

		/**
		 * @type number
		 */
		protected mapLatitude: number = 40.7884;

		/**
		 * @type number
		 */
		protected mapLongitude: number = -73.977198;

		/**
		 * @type number
		 */
		protected mapZoom: number = 13;

		/**
		 * @return void
		 */
		public mounted(): void {
			console.log('Collection', this.venueCollection);

			// this.venueCollection.fetch();
		}

		// region: Event Handlers
		// ---------------------------------------------------------------------------

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnLoginError(): Promise<void> {
			console.log('Login error');
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnLoginSuccess(): Promise<void> {
			console.log('Login success');
		}

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

		/**
		 * @param Event e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickMapMarker(venueModel: ChalkySticks.Model.Venue): Promise<void> {
			console.log('Clicked marker', venueModel);

			this.mapZoom = 10;
			this.mapLongitude = 0;
		}

		/**
		 * @param IMapPosition position
		 * @return Promise<void>
		 */
		protected async Handle_OnMoveMap(position: IMapPosition): Promise<void> {
			console.log('Map moved', position);
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.app {
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
			color: #d1d1d1;
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
