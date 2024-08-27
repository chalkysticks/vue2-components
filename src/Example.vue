<template>
	<div class="app theme-dark">
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
					<ChalkyBrandingBadge size="sm" mode="deep" />
					<ChalkyBrandingBadge size="sm" mode="dark" />
					<ChalkyBrandingBadge size="sm" mode="light" />
				</div>
				<div>
					<ChalkyBrandingBadge size="md" mode="deep" />
					<ChalkyBrandingBadge size="md" mode="dark" />
					<ChalkyBrandingBadge size="md" mode="light" />
				</div>
				<div>
					<ChalkyBrandingBadge size="lg" mode="deep" />
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
				<div class="d-flex">
					<ChalkyBrandingStandard class="background-chalky-white p-3" mode="light" v-bind:useIcon="false" />
					<ChalkyBrandingStandard class="background-chalky-blue p-3" mode="dark" v-bind:useIcon="false" />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Splash</h3>
				</header>
				<div style="position: relative">
					<ChalkyBrandingSplash v-bind:fullscreen="false" />
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
						<strong>Logged In:</strong>
						&nbsp;
						<span>{{ $store.getters['authentication/authenticated'] }}</span>
					</p>
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

				<hr />

				<div>
					<ChalkyAuthenticationAuthPanel
						v-bind:authModel="authModel"
						v-bind:includeSocial="true"
						v-on:success="Handle_OnLoginSuccess"
						v-on:error="Handle_OnLoginError"
					/>
				</div>

				<hr />

				<div>
					<ChalkyAuthenticationAuthPanel
						v-bind:authModel="authModel"
						v-bind:includeBasic="false"
						v-bind:includeSocial="true"
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

			<hr />

			<section class="level-1">
				<header>
					<h3>Lower Third</h3>
				</header>

				<div class="theme-light padded">
					<ChalkyTvLowerThird class="animate-in" title="Shane van Boening vs Earl Strickland" subtitle="2018 9-ball" />
				</div>

				<hr />

				<div class="padded">
					<ChalkyTvLowerThird class="animate-in" v-bind:scheduleModel="scheduleCollection.at(0)" />
				</div>
			</section>

			<hr />

			<section class="level-1">
				<header>
					<h3>Video Preview</h3>
				</header>

				<div class="theme-light padded">
					<ChalkyTvVideoPreview v-bind:scheduleModel="scheduleCollection.at(0)" />
				</div>

				<div class="theme-light padded">
					<ChalkyTvVideoPreview v-bind:scheduleModel="liveScheduleCollection.at(0)" />
				</div>
			</section>

			<hr />

			<section class="level-1">
				<header>
					<h3>Live List</h3>
				</header>

				<div class="theme-light padded">
					<ChalkyTvLiveList v-bind:scheduleCollection="liveScheduleCollection" />
				</div>
			</section>

			<hr />

			<section class="level-1">
				<header>
					<h3>Now Playing</h3>
				</header>

				<div class="layout-horizontal">
					<div class="icon-channel-all"></div>
					<ChalkyTvNowPlaying v-bind:scheduleCollection="scheduleCollection" />
				</div>

				<div class="layout-horizontal">
					<div class="icon-channel-8ball"></div>
					<ChalkyTvNowPlaying v-bind:gameType="ChalkySticks.Enum.GameType.EightBall" />
				</div>

				<div class="layout-horizontal">
					<div class="icon-channel-9ball"></div>
					<ChalkyTvNowPlaying v-bind:gameType="ChalkySticks.Enum.GameType.NineBall" />
				</div>

				<div class="layout-horizontal">
					<div class="icon-channel-10ball"></div>
					<ChalkyTvNowPlaying v-bind:gameType="ChalkySticks.Enum.GameType.TenBall" />
				</div>

				<div class="layout-horizontal">
					<div class="icon-channel-1pocket"></div>
					<ChalkyTvNowPlaying v-bind:gameType="ChalkySticks.Enum.GameType.OnePocket" />
				</div>

				<div class="layout-horizontal">
					<div class="icon-channel-straight"></div>
					<ChalkyTvNowPlaying v-bind:gameType="ChalkySticks.Enum.GameType.StraightPool" />
				</div>

				<div class="layout-horizontal">
					<div class="icon-channel-billiards"></div>
					<ChalkyTvNowPlaying v-bind:gameType="ChalkySticks.Enum.GameType.Billiards" />
				</div>

				<div class="layout-horizontal">
					<div class="icon-channel-trick"></div>
					<ChalkyTvNowPlaying v-bind:gameType="ChalkySticks.Enum.GameType.TrickShots" />
				</div>

				<div class="layout-horizontal">
					<div class="icon-channel-snooker"></div>
					<ChalkyTvNowPlaying v-bind:gameType="ChalkySticks.Enum.GameType.Snooker" />
				</div>
			</section>

			<hr />

			<section class="level-1">
				<header>
					<h3>Schedule Item</h3>
				</header>

				<div>
					<ChalkyTvScheduleItem title="Shane van Boening vs Earl Strickland" subtitle="2018 9-ball" />
				</div>
			</section>

			<hr />

			<section class="level-1">
				<header>
					<h3>Schedule List</h3>
				</header>

				<div class="layout-horizontal" style="align-items: flex-start; max-height: 500px; overflow: auto">
					<ChalkyTvTimeline />
					<ChalkyTvScheduleList v-bind:scheduleCollection="scheduleCollection" />
				</div>
			</section>

			<hr />

			<section class="level-1">
				<header>
					<h3>Schedule</h3>
				</header>

				<div>
					<ChalkyTvSchedule
						style="max-height: 500px"
						v-bind:activeChannel="activeChannel"
						v-on:select:channel="Handle_OnSelectChannel"
						v-on:select:schedule="Handle_OnSelectSchedule"
					/>
				</div>
			</section>

			<hr />

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
					<ChalkyTvVideoTheater channel="" ref="videoTheater" v-bind:allowControl="true" v-bind:scheduleModel="liveScheduleModel" />

					<form v-on:submit="Handle_OnSubmitVideoForm">
						<select v-on:change="Handle_OnChangeTvChannel" v-model="activeChannel">
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

						<button value="setLive">Set Live</button>
						<button value="removeLive">Remove Live</button>
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
					<ChalkyVenueList v-bind:venueCollection="venueCollection" />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Venue Card</h3>

					<p>1. No model</p>
					<p>2. With model</p>
				</header>
				<div class="push-bottom">
					<ChalkyVenueCard />
				</div>
				<div>
					<ChalkyVenueCard v-bind:venueModel="venueCollection.at(0)" />
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
						v-on:beacon:click="Handle_OnClickMapBeacon"
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
		 * @type ChalkySticks
		 */
		public get ChalkySticks(): typeof ChalkySticks {
			return ChalkySticks;
		}

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
		 * @type ChalkySticks/TV/Collection/Live
		 */
		@Prop({
			default: () =>
				new ChalkySticks.TV.Collection.Live({
					baseUrl: ChalkySticks.Core.Constants.API_URL_DEV_V1,
				}),
		})
		public liveScheduleCollection!: ChalkySticks.TV.Collection.Live;

		/**
		 * @type ChalkySticks/Model/Schedule
		 */
		@Prop({
			default: () =>
				new ChalkySticks.Model.Schedule({
					baseUrl: ChalkySticks.Core.Constants.API_URL_V1,
				}),
		})
		public liveScheduleModel!: ChalkySticks.Model.Schedule;

		/**
		 * @type ChalkySticks/Collection/Schedule
		 */
		@Prop({
			default: () =>
				new ChalkySticks.Collection.Schedule({
					baseUrl: ChalkySticks.Core.Constants.API_URL_V1,
				}),
		})
		public scheduleCollection!: ChalkySticks.Collection.Schedule;

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
		 * @type ChalkySticks.Enum.GameType
		 */
		protected activeChannel: ChalkySticks.Enum.GameType = ChalkySticks.Enum.GameType.All;

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
			console.log('Schedule Collection', this.scheduleCollection);
			console.log('Venue Collection', this.venueCollection);

			// this.venueCollection.fetch();
			this.liveScheduleCollection.fetch();
			this.scheduleCollection.fetch();
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
		protected async Handle_OnClickMapBeacon(beaconModel: ChalkySticks.Model.Beacon): Promise<void> {
			console.log('Beacon Model', beaconModel);
		}

		/**
		 * @param Event e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickMapMarker(venueModel: ChalkySticks.Model.Venue): Promise<void> {
			console.log('Clicked marker', venueModel);

			// this.mapLongitude = 1;
			this.mapZoom = 10;
		}

		/**
		 * @param IMapPosition position
		 * @return Promise<void>
		 */
		protected async Handle_OnMoveMap(position: IMapPosition): Promise<void> {
			console.log('Map moved', position);
		}

		/**
		 * @param string channel
		 * @return Promise<void>
		 */
		protected async Handle_OnSelectChannel(channel: string): Promise<void> {
			console.log('Selected Channel', channel);
		}

		/**
		 * @param ChalkySticks.Model.Schedule scheduleModel
		 * @param ChalkySticks.Enum.GameType channel
		 * @return Promise<void>
		 */
		protected async Handle_OnSelectSchedule(scheduleModel: ChalkySticks.Model.Schedule, channel: ChalkySticks.Enum.GameType): Promise<void> {
			console.log('Selected Schedule', scheduleModel, channel);
		}

		/**
		 * @param SubmitEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnSubmitVideoForm(e: SubmitEvent): Promise<void> {
			e.preventDefault();

			// @ts-ignore
			const value: string = e.submitter?.value;

			if (value === 'setLive') {
				this.liveScheduleModel = this.liveScheduleCollection.at(0);
			} else if (value === 'removeLive') {
				this.liveScheduleModel = null;
			}
		}

		// endregion: Event Handlers
	}
</script>

<style lang="scss">
	.app {
		-moz-osx-font-smoothing: grayscale;
		-webkit-font-smoothing: antialiased;
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

		.level-0 > header > h2 {
			color: #d1d1d1;
			font-size: 1.75rem;
			font-weight: 700;
			letter-spacing: -0.05rem;
			text-transform: uppercase;
		}

		.level-1 > header > h3 {
			font-size: 1.5rem;
			font-weight: 500;
			letter-spacing: -0.05rem;
		}
	}

	.app {
		.chalky.venue-list {
			height: 450px;
		}
	}
</style>
