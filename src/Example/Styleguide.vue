<template>
	<main class="styleguide theme-dark background-chalky-blue-4">
		<header>
			<nav>
				<a href="#general">General</a>
				<a href="#authentication">Authentication</a>
				<a href="#content">Content</a>
				<a href="#extras">Extras</a>
				<a href="#branding">Branding</a>
				<a href="#feed">Feed</a>
				<a href="#media">Media</a>
				<br />
				<a href="#tv">TV</a>
				<a href="#user">User</a>
				<a href="#utility">Utility</a>
				<a href="#venues">Venues</a>
				<a href="#comments">Comments</a>
				<a href="#reactions">Reactions</a>
				<a href="#wallet">Wallet</a>
			</nav>
		</header>

		<section class="level-0" v-if="tab == 'general'" v-bind:class="{ 'state-active': tab == 'general' }">
			<header>
				<h2>General</h2>
			</header>

			<section class="level-1">
				<header>
					<h3>Headings</h3>
				</header>
				<div>
					<h1>Heading One</h1>
					<h2>Heading Two</h2>
					<h3>Heading Three</h3>
					<h4>Heading Four</h4>
					<h5>Heading Five</h5>
					<h6>Heading Six</h6>
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Body</h3>
				</header>
				<div>
					<p>Lipsum dolor sit amet, consectetur adipiscing elit. Nullam nec dui nec nunc.</p>

					<p class="small">Lipsum dolor sit amet, consectetur adipiscing elit. Nullam nec dui nec nunc.</p>

					<small>Lipsum dolor sit amet, consectetur adipiscing elit. Nullam nec dui nec nunc.</small>
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Tags</h3>
				</header>
				<div>
					<ul class="tags">
						<li class="tag">Tag</li>
						<li class="tag">Tag</li>
						<li class="tag">Tag</li>
					</ul>
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Buttons</h3>
				</header>

				<section>
					<button class="control type-up">Up</button>
					<button class="control type-down">Down</button>
					<button class="control type-left">Left</button>
					<button class="control type-right">Right</button>
					<button class="control type-zoomin">Zoom In</button>
					<button class="control type-zoomout">Zoom Out</button>
					<button class="control type-location">Location</button>
					<button class="control type-plus">Plus</button>
					<button class="control type-list">List</button>
					<button class="control type-minus">Minus</button>
					<button class="control type-menu">Menu</button>
					<button class="control type-close">Close</button>
					<button class="control type-fullscreen">Fullscreen</button>
					<button class="control type-save">Save</button>
					<button class="control type-volumeoff">Volume Off</button>
					<button class="control type-volumeon">Volume On</button>
					<button class="control type-information">Information</button>
					<button class="control type-speech">Speech</button>
				</section>

				<section class="push-top">
					<button class="control theme-dark type-up">Up</button>
					<button class="control theme-dark type-down">Down</button>
					<button class="control theme-dark type-left">Left</button>
					<button class="control theme-dark type-right">Right</button>
					<button class="control theme-dark type-zoomin">Zoom In</button>
					<button class="control theme-dark type-zoomout">Zoom Out</button>
					<button class="control theme-dark type-location">Location</button>
					<button class="control theme-dark type-plus">Plus</button>
					<button class="control theme-dark type-list">List</button>
					<button class="control theme-dark type-minus">Minus</button>
					<button class="control theme-dark type-menu">Menu</button>
					<button class="control theme-dark type-close">Close</button>
					<button class="control theme-dark type-fullscreen">Fullscreen</button>
					<button class="control theme-dark type-save">Save</button>
					<button class="control theme-dark type-volumeoff">Volume Off</button>
					<button class="control theme-dark type-volumeon">Volume On</button>
					<button class="control theme-dark type-information">Information</button>
					<button class="control theme-dark type-speech">Speech</button>
				</section>
			</section>

			<section class="level-1">
				<header>
					<h3>Fields</h3>
				</header>

				<section>
					<label>
						<h6>Email Address</h6>
						<input type="text" placeholder="Enter password" />
					</label>
				</section>

				<section>
					<label>
						<input type="text" placeholder="Enter password" />
					</label>
				</section>

				<section>
					<label>
						<input type="text" placeholder="Enter password" required />
						<small class="type-error">This field is required</small>
					</label>
				</section>

				<section>
					<label>
						<input type="text" placeholder="Enter password" required />
						<a href="#" class="type-caps">Forgot Password</a>
					</label>
				</section>

				<section>
					<label>
						<h6>Select a Thing</h6>
						<select name="select">
							<option value="1">Option 1</option>
							<option value="2">Option 2</option>
							<option value="3">Option 3</option>
						</select>
					</label>
				</section>

				<section class="push-bottom">
					<h4>Button Styles</h4>

					<section class="button-group">
						<button>
							<span>Button</span>
						</button>

						<button class="button-secondary">
							<span>Secondary</span>
						</button>

						<button class="button-tertiary">
							<span>Tertiary</span>
						</button>

						<button disabled>
							<span>Disabled</span>
						</button>
					</section>
				</section>

				<section class="push-bottom">
					<h4>Social Button Styles</h4>

					<section class="button-group">
						<button class="button-facebook">
							<span>Facebook</span>
						</button>

						<button class="button-yelp">
							<span>Yelp</span>
						</button>

						<button class="button-google">
							<span>Google</span>
						</button>

						<button class="button-linkedin">
							<span>LinkedIn</span>
						</button>

						<button class="button-github">
							<span>Github</span>
						</button>
					</section>
				</section>

				<section class="push-bottom">
					<h4>Button Sizes</h4>

					<section class="button-group">
						<button class="size-xx-small">
							<span>XX Small</span>
						</button>

						<button class="size-x-small">
							<span>X Small</span>
						</button>

						<button class="size-small">
							<span>Small</span>
						</button>

						<button class="size-normal">
							<span>Normal</span>
						</button>

						<button class="size-medium">
							<span>Medium</span>
						</button>

						<button class="size-large">
							<span>Large</span>
						</button>
					</section>
				</section>

				<section>
					<button class="google">
						<img class="icon" src="~@chalkysticks/sass/build/asset/image/icon/google.svg" />
						<span>Sign in with Google</span>
					</button>
				</section>

				<section>
					<div
						class="fb-login-button"
						data-width=""
						data-size=""
						data-button-type=""
						data-layout=""
						data-auto-logout-link="false"
						data-use-continue-as="true"
					></div>
				</section>

				<section class="button-group text-center margin">
					<button>
						<span>Button</span>
					</button>

					<label>
						<a href="#" class="type-caps">Sign up</a>
					</label>
				</section>

				<section class="layout-horizontal">
					<label>
						<input type="radio" />
						<span>Radio #1</span>
					</label>

					<label>
						<input checked type="radio" />
						<span>Radio #2</span>
					</label>

					<label>
						<input checked disabled type="radio" />
						<span>Radio #2</span>
					</label>
				</section>

				<section class="layout-horizontal">
					<label>
						<input type="checkbox" />
						<span>Checkbox #1</span>
					</label>

					<label>
						<input checked type="checkbox" />
						<span>Checkbox #2</span>
					</label>

					<label>
						<input checked disabled type="checkbox" />
						<span>Checkbox #2</span>
					</label>
				</section>

				<section class="layout-horizontal">
					<label>
						<input class="switch" type="checkbox" />
						<span>Switch #1</span>
					</label>

					<label>
						<input class="switch" checked type="checkbox" />
						<span>Switch #2</span>
					</label>

					<label>
						<input class="switch" checked disabled type="checkbox" />
						<span>Switch #2</span>
					</label>
				</section>

				<section class="layout-horizontal theme-dark">
					<label>
						<input type="radio" />
						<span>Radio #1</span>
					</label>

					<label>
						<input checked type="radio" />
						<span>Radio #2</span>
					</label>

					<label>
						<input checked disabled type="radio" />
						<span>Radio #2</span>
					</label>
				</section>

				<section class="layout-horizontal theme-dark">
					<label>
						<input type="checkbox" />
						<span>Checkbox #1</span>
					</label>

					<label>
						<input checked type="checkbox" />
						<span>Checkbox #2</span>
					</label>

					<label>
						<input checked disabled type="checkbox" />
						<span>Checkbox #2</span>
					</label>
				</section>

				<section class="layout-horizontal theme-dark">
					<label>
						<input class="switch" type="checkbox" />
						<span>Switch #1</span>
					</label>

					<label>
						<input class="switch" checked type="checkbox" />
						<span>Switch #2</span>
					</label>

					<label>
						<input class="switch" checked disabled type="checkbox" />
						<span>Switch #2</span>
					</label>
				</section>
			</section>

			<section class="level-1">
				<header>
					<h3>Search Form</h3>
				</header>
				<div class="background-chalky-white padded">
					<ChalkyFormSearch placeholder="New York, NY" type="location" v-on:search:location="Handle_OnSearchLocation" />
				</div>
				<div class="background-chalky-white padded">
					<ChalkyFormSearch placeholder="Superfine" type="venue" v-on:search:venue="Handle_OnSearchVenue" />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Alert Prompt</h3>
				</header>
				<div class="background-chalky-white padded">
					<button v-on:click="Handle_OnClickDialogAlert">Alert</button>
					<button v-on:click="Handle_OnClickDialogConfirm">Confirm</button>
					<button v-on:click="Handle_OnClickDialogPrompt">Prompt</button>
					<button v-on:click="Handle_OnClickDialogCustom">Custom</button>
				</div>
			</section>
		</section>

		<section class="level-0" v-if="tab == 'content'" v-bind:class="{ 'state-active': tab == 'content' }">
			<header>
				<h2>Content</h2>
			</header>

			<section class="level-1">
				<header>
					<h3>Content List</h3>
				</header>

				<div>
					<ChalkyContentList v-bind:contentCollection="contentCollection" />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Content Item</h3>
				</header>

				<div>
					<ChalkyContentItem v-bind:contentModel="contentCollection.at(0)" />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Content Video Player</h3>
				</header>

				<div>
					<ChalkyContentVideoPlayer v-bind:contentModel="contentCollection.first()" />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Content Video Player, (3x2)</h3>
				</header>

				<div>
					<ChalkyContentVideoPlayer aspectRatio="3 / 2" v-bind:contentModel="contentCollection.first()" />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Content Video Player, (1x1)</h3>
				</header>

				<div>
					<ChalkyContentVideoPlayer aspectRatio="1 / 1" v-bind:contentModel="contentCollection.first()" />
				</div>
			</section>
		</section>

		<section class="level-0" v-if="tab == 'extras'" v-bind:class="{ 'state-active': tab == 'extras' }">
			<header>
				<h2>Extras</h2>
			</header>

			<section class="level-1">
				<header>
					<h3>Fact Banner</h3>
				</header>

				<div>
					<ChalkyFactBanner />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Fact Card</h3>
				</header>

				<div>
					<ChalkyFactCard />
				</div>
			</section>
		</section>

		<section class="level-0" v-if="tab == 'user'" v-bind:class="{ 'state-active': tab == 'user' }">
			<header>
				<h2>User</h2>
			</header>

			<section class="level-1">
				<header>
					<h3>Auth</h3>
				</header>

				<div>
					<ChalkyAuthenticationAuthPanel v-bind:allowForgotPassword="true" v-bind:allowSignup="true" v-bind:authModel="authModel" />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>User Menu</h3>
				</header>
				<div>
					<UserAvatar v-bind:key="store.getters['authentication/user'].uniqueKey" v-bind:userModel="store.getters['authentication/user']" />

					<ChalkyUserMenu v-bind:authModel="authModel" />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>User Card</h3>

					<p>1. No model</p>
					<p>2. With model</p>
				</header>

				<div class="push-bottom">
					<ChalkyUserCard />
				</div>

				<div class="push-bottom">
					These have rendering issues
					<!-- <ChalkyUserCard
						v-bind:key="store.getters['authentication/user'].uniqueKey"
						v-bind:userModel="store.getters['authentication/user']"
					/> -->
				</div>

				<div>
					These have rendering issues
					<!-- <ChalkyUserCard v-bind:key="userModel.uniqueKey" v-bind:userModel="userModel" /> -->
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>User List</h3>

					<p><small>@todo add location</small></p>
				</header>

				<div class="push-bottom">
					<ChalkyUserList class="variation-compact on-light" v-bind:userCollection="userCollection" />
				</div>

				<div class="push-bottom">
					<ChalkyUserList class="variation-small on-light" v-bind:userCollection="userCollection" />
				</div>

				<div class="push-bottom">
					<ChalkyUserList class="horizontal" v-bind:userCollection="userCollection" />
				</div>
			</section>
		</section>

		<section class="level-0" v-if="tab == 'feed'" v-bind:class="{ 'state-active': tab == 'feed' }">
			<header>
				<h2>Feed</h2>
			</header>

			<section class="level-1">
				<header>
					<h3>User Menu</h3>
				</header>
				<div>
					<UserAvatar v-bind:key="store.getters['authentication/user'].uniqueKey" v-bind:userModel="store.getters['authentication/user']" />

					<ChalkyUserMenu v-bind:authModel="authModel" />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Feed Card</h3>
				</header>
				<div>
					<ChalkyFeedCard />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Feed List</h3>
				</header>
				<div>
					<ChalkyFeedList />
				</div>
			</section>
		</section>

		<section class="level-0" v-if="tab == 'media'" v-bind:class="{ 'state-active': tab == 'media' }">
			<header>
				<h2>Media</h2>
			</header>

			<section class="level-1">
				<header>
					<h3>User Person</h3>
				</header>
				<div style="display: flex; gap: 1rem">
					<ChalkyMediaUser />
					<ChalkyMediaUser aspectRatio="square" />
					<ChalkyMediaUser aspectRatio="landscape" />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Venue Interior</h3>
				</header>
				<div>
					<ChalkyMediaVenue type="interior" />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Venue Exterior</h3>
				</header>
				<div class="d-flex" style="gap: 1rem">
					<ChalkyMediaVenue animationStyle="crossfade" type="exterior" v-bind:limit="5" />
					<ChalkyMediaVenue animationStyle="slide" type="exterior" v-bind:limit="5" v-on:select="Handle_OnSelectMediaVenue" />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Venue Tables</h3>
				</header>
				<div style="display: flex; gap: 1rem">
					<ChalkyMediaVenue type="table" />
					<ChalkyMediaVenue animationStyle="slide" type="table" v-if="venueCollection.length" v-bind:venueModel="venueCollection.at(0)" />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Stacked</h3>
				</header>
				<div style="display: flex; gap: 1rem">
					<ChalkyMediaCardSwipe>
						<ChalkyMediaVenue type="table" v-if="venueCollection.length" v-bind:venueModel="venueCollection.at(0)" />
						<ChalkyMediaVenue type="table" v-if="venueCollection.length" v-bind:venueModel="venueCollection.at(1)" />
						<ChalkyMediaVenue type="table" v-if="venueCollection.length" v-bind:venueModel="venueCollection.at(2)" />
						<ChalkyMediaVenue type="table" v-if="venueCollection.length" v-bind:venueModel="venueCollection.at(3)" />
						<ChalkyMediaVenue type="table" v-if="venueCollection.length" v-bind:venueModel="venueCollection.at(4)" />
					</ChalkyMediaCardSwipe>
				</div>
			</section>
		</section>

		<section class="level-0" v-if="tab == 'utility'" v-bind:class="{ 'state-active': tab == 'utility' }">
			<header>
				<h2>Utility</h2>
			</header>

			<section class="level-1">
				<header>
					<h3>Force Landscape</h3>
				</header>
				<div>
					<ChalkyUtilityForceLandscape />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Portrait Overlay</h3>
				</header>
				<div>
					<ChalkyUtilityPortraitOverlay />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Swipe Prompt</h3>
				</header>
				<div>
					<ChalkyUtilityScrollToBegin />
				</div>
			</section>
		</section>

		<section class="level-0" v-if="tab == 'branding'" v-bind:class="{ 'state-active': tab == 'branding' }">
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
					<ChalkyBrandingBadge size="xs" mode="deep" />
					<ChalkyBrandingBadge size="xs" mode="dark" />
					<ChalkyBrandingBadge size="xs" mode="light" />
				</div>
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
					<ChalkyBrandingStandard class="background-chalky-white p-3" mode="light" size="xs" />
					<ChalkyBrandingStandard class="background-chalky-blue p-3" mode="dark" size="xs" />
				</div>
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

		<section class="level-0" v-if="tab == 'authentication'" v-bind:class="{ 'state-active': tab == 'authentication' }">
			<header>
				<h2>Authentication</h2>
			</header>

			<section class="level-1">
				<header>
					<h3>Navigation</h3>
					<p>
						<strong>Logged In:</strong>
						&nbsp;
						<span>{{ $store.getters['authentication/authenticated'] }}</span>
					</p>
				</header>
				<div>
					<div>
						<h4>Icon (default: xs)</h4>
						<ChalkyAuthenticationNavigation v-bind:authModel="authModel" />
					</div>

					<div>
						<h4>Icon (size: lg)</h4>
						<ChalkyAuthenticationNavigation size="lg" v-bind:authModel="authModel" />
					</div>

					<div>
						<h4>Button</h4>
						<ChalkyAuthenticationNavigation v-bind:authModel="authModel" v-bind:useButton="true" />
					</div>
				</div>
			</section>

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
						v-bind:allowForgotPassword="true"
						v-bind:allowSignup="true"
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
						v-bind:allowForgotPassword="true"
						v-bind:allowSignup="true"
						v-bind:authModel="authModel"
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

		<section class="level-0" v-if="tab == 'tv'" v-bind:class="{ 'state-active': tab == 'tv' }">
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
					<h3>Attribution Banner</h3>
				</header>

				<div class="theme-light padded background-chalky-blue p-3">
					<ChalkyTvAttributionBanner v-bind:scheduleModel="scheduleCollection.at(0)" />
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
					<ChalkyTvLiveList v-bind:scheduleCollection="liveScheduleCollection" v-on:click="Handle_OnClickLiveListItem" />
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

				<hr />

				<div class="layout-horizontal">
					<div class="icon-channel-10ball"></div>
					<ChalkyTvNowPlaying class="show-tags" v-bind:gameType="ChalkySticks.Enum.GameType.TenBall" />
				</div>

				<div class="layout-horizontal">
					<div class="icon-channel-1pocket"></div>
					<ChalkyTvNowPlaying class="show-tags" v-bind:gameType="ChalkySticks.Enum.GameType.OnePocket" />
				</div>

				<div class="layout-horizontal">
					<div class="icon-channel-straight"></div>
					<ChalkyTvNowPlaying class="show-tags" v-bind:gameType="ChalkySticks.Enum.GameType.StraightPool" />
				</div>

				<hr />

				<div class="layout-horizontal">
					<div class="icon-channel-billiards"></div>
					<ChalkyTvNowPlaying class="show-image show-tags" v-bind:gameType="ChalkySticks.Enum.GameType.Billiards" />
				</div>

				<div class="layout-horizontal">
					<div class="icon-channel-trick"></div>
					<ChalkyTvNowPlaying class="show-image show-tags" v-bind:gameType="ChalkySticks.Enum.GameType.TrickShots" />
				</div>

				<div class="layout-horizontal">
					<div class="icon-channel-snooker"></div>
					<ChalkyTvNowPlaying class="show-image show-tags" v-bind:gameType="ChalkySticks.Enum.GameType.Snooker" />
				</div>

				<hr />

				<div class="layout-horizontal">
					<div class="icon-channel-all"></div>
					<ChalkyTvNowPlaying class="show-image show-tags stacked" v-bind:scheduleCollection="scheduleCollection" />
				</div>

				<div class="layout-horizontal">
					<div class="icon-channel-8ball"></div>
					<ChalkyTvNowPlaying class="show-image show-tags stacked" v-bind:gameType="ChalkySticks.Enum.GameType.EightBall" />
				</div>

				<div class="layout-horizontal">
					<div class="icon-channel-9ball"></div>
					<ChalkyTvNowPlaying class="show-image show-tags stacked" v-bind:gameType="ChalkySticks.Enum.GameType.NineBall" />
				</div>

				<hr />

				<div class="layout-horizontal">
					<div class="icon-channel-9ball"></div>
					<ChalkyTvNowPlaying class="show-image show-tags stacked" v-bind:gameType="ChalkySticks.Enum.GameType.NineBall">
						<template v-slot:before>
							<p>Before Slot</p>
						</template>

						<template v-slot:after>
							<p>After Slot</p>
						</template>
					</ChalkyTvNowPlaying>
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
					<h3>Schedule Item (with slot)</h3>
				</header>

				<div>
					<ChalkyTvScheduleItem title="Shane van Boening vs Earl Strickland" subtitle="2018 9-ball">
						<p>With Slot Content</p>
					</ChalkyTvScheduleItem>
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
					<ChalkyTvVideoTheater
						channel=""
						ref="videoTheater"
						v-bind:mute="muteVideo"
						v-bind:allowControl="false"
						v-bind:scheduleModel="liveScheduleModel"
					/>

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

					<section>
						<button v-on:click="muteVideo = true">Mute</button>
						<button v-on:click="muteVideo = false">Unmute</button>
					</section>
				</div>
			</section>
		</section>

		<section class="level-0" v-if="tab == 'reactions'" v-bind:class="{ 'state-active': tab == 'reactions' }">
			<header>
				<h2>Reactions</h2>
			</header>

			<section class="level-1">
				<header>
					<h3>Auth</h3>
				</header>

				<div>
					<ChalkyAuthenticationAuthPanel v-bind:allowForgotPassword="true" v-bind:allowSignup="true" v-bind:authModel="authModel" />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Reaction Button</h3>

					<p><small>@todo add location</small></p>
				</header>
				<div>
					<ChalkyReactionButton v-bind:model="venueModel" />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Reaction Favorite</h3>

					<p><small>@todo add location</small></p>
				</header>
				<div>
					<ChalkyReactionFavorite v-bind:model="venueModel" />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Reaction List</h3>

					<p><small>@todo add location</small></p>
				</header>
				<div>
					<ChalkyReactionList v-bind:model="venueModel" />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Reaction Summary</h3>

					<p><small>@todo add location</small></p>
				</header>
				<div>
					<ChalkyReactionSummary v-bind:model="venueModel" />
				</div>
			</section>
		</section>

		<section class="level-0" v-if="tab == 'comments'" v-bind:class="{ 'state-active': tab == 'comments' }">
			<header>
				<h2>Comments</h2>
			</header>

			<section class="level-1">
				<header>
					<h3>Auth</h3>
				</header>

				<div>
					<ChalkyAuthenticationAuthPanel v-bind:allowForgotPassword="true" v-bind:allowSignup="true" v-bind:authModel="authModel" />
				</div>

				<div>
					<ChalkyAuthenticationNavigation v-bind:authModel="authModel" />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Comment Form</h3>

					<p><small>@todo add location</small></p>
				</header>
				<div>
					<ChalkyCommentForm />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Comment List</h3>

					<p><small>@todo add location</small></p>
				</header>
				<div>
					<ChalkyCommentList direction="asc" maxHeight="80svh" v-bind:model="venueModel" />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Comment List</h3>

					<p><small>@todo add location</small></p>
				</header>
				<div>
					<ChalkyCommentList class="variation-compact" direction="asc" maxHeight="60svh" v-bind:model="venueModel" />
				</div>
			</section>
		</section>

		<section class="level-0" v-if="tab == 'venues'" v-bind:class="{ 'state-active': tab == 'venues' }">
			<header>
				<h2>Venues</h2>
			</header>

			<section class="level-1">
				<header>
					<h3>Venue List (Horizontal)</h3>

					<p><small>@todo add location</small></p>
				</header>
				<div>
					<ChalkyVenueList class="horizontal" v-bind:venueCollection="venueCollection">
						<template v-slot:before-list>
							<p>Before List</p>
						</template>
						<template v-slot:after-list>
							<p>After List</p>
						</template>
					</ChalkyVenueList>
				</div>
				<div>
					<ChalkyUtilityPagination v-bind:collection="venueCollection" />
				</div>
				<br />
				<div>
					<ChalkyUtilityPagination
						v-bind:showFirst="true"
						v-bind:showLast="true"
						v-bind:maxPagesToShow="3"
						v-bind:collection="venueCollection"
					/>
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

				<div class="push-bottom">
					<ChalkyVenueCard v-bind:showComments="true" v-bind:venueModel="venueModel" v-on:click:gallery="Handle_OnClickCardGallery">
						<template v-slot:checkin:action="{ venueModel }">
							<button class="size-x-small" v-bind:id="venueModel.id">Scan Table</button>
						</template>
					</ChalkyVenueCard>
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Venue Card (minimal)</h3>
				</header>

				<div>
					<ChalkyVenueCard class="minimal" v-bind:venueModel="venueModel" />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Venue Card</h3>
					<p>(no checkins, comments, or hours)</p>
				</header>

				<div>
					<ChalkyVenueCard
						v-bind:showCheckins="false"
						v-bind:showComments="false"
						v-bind:showHours="false"
						v-bind:venueModel="venueModel"
					/>
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Venue Map</h3>
				</header>
				<div>
					<ChalkyVenueMap
						class="hide-streetview"
						v-bind:centerLatitude="mapLatitude"
						v-bind:centerLongitude="mapLongitude"
						v-bind:centerOnMarker="true"
						v-bind:centerOffsetY="-100"
						v-bind:userLatitude="40.800335"
						v-bind:userLongitude="-73.968452"
						v-bind:venueCollection="venueCollection"
						v-bind:zoom="mapZoom"
						v-on:beacon:click="Handle_OnClickMapBeacon"
						v-on:marker:click="Handle_OnClickMapMarker"
						v-on:map:move="Handle_OnMoveMap"
					/>
				</div>

				<div class="padded">
					<ChalkyFormSearch
						queryParameter="search"
						type="location"
						v-on:click:badge="Handle_OnClickBadge"
						v-on:search:location="Handle_OnSearchLocation"
					/>
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Venue Gallery</h3>
				</header>

				<div class="push-bottom">
					<h6>Not interactive</h6>
					<ChalkyVenueGallery v-bind:interactive="false" v-bind:venueModel="venueCollection.at(0)" />
				</div>

				<div class="push-bottom">
					<h6>Not interactive / Automatic</h6>
					<ChalkyVenueGallery v-bind:interactive="false" v-bind:automatic="true" v-bind:venueModel="venueCollection.at(0)" />
				</div>

				<div class="push-bottom">
					<h6>Interactive</h6>
					<ChalkyVenueGallery v-bind:interactive="true" v-bind:venueModel="venueCollection.at(0)" />
				</div>

				<div class="push-bottom">
					<h6>Before / After</h6>
					<ChalkyVenueGallery v-bind:interactive="true" v-bind:venueModel="venueCollection.at(0)">
						<template v-slot:before-item="{ index }">
							<div class="controls">{{ index + 1 }}</div>
						</template>

						<template v-slot:after-item="{ venueModel }">
							<div class="caption" v-if="venueModel">{{ venueModel.getName() }}</div>
						</template>
					</ChalkyVenueGallery>
				</div>

				<div class="push-bottom">
					<ChalkyVenueGallery layout="grid" v-bind:venueModel="venueCollection.at(0)" />
				</div>

				<div class="push-bottom">
					<ChalkyVenueGallery layout="grid" v-bind:venueModel="venueCollection.at(0)">
						<template v-slot:before-item="{ index }">
							<div class="controls">{{ index + 1 }}</div>
						</template>

						<template v-slot:after-item="{ venueModel }">
							<div class="caption" v-if="venueModel">{{ venueModel.getName() }}</div>
						</template>
					</ChalkyVenueGallery>
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Venue List</h3>

					<p><small>@todo add location</small></p>
				</header>

				<div class="push-bottom">
					<ChalkyVenueList class="variation-compact on-light" v-bind:venueCollection="venueCollection" />
				</div>

				<div class="push-bottom">
					<ChalkyVenueList class="variation-small on-light" v-bind:venueCollection="venueCollection" />
				</div>

				<div class="push-bottom">
					<ChalkyVenueList class="variation-normal on-light" v-bind:venueCollection="venueCollection" />
				</div>
			</section>

			<section class="level-1">
				<header>
					<h3>Venue Comments</h3>
				</header>

				<div>
					<ChalkyCommentList direction="asc" maxHeight="80svh" v-bind:model="venueModel" />
				</div>
			</section>
		</section>

		<section class="level-0" v-if="tab == 'wallet'" v-bind:class="{ 'state-active': tab == 'wallet' }">
			<header>
				<h2>Wallet</h2>
			</header>
		</section>

		<UtilityAlertPrompt ref="alertPrompt" />
	</main>
</template>

<script lang="ts">
	import AuthenticationAuthPanel from '@/Authentication/AuthPanel.vue';
	import ChalkySticks from '@chalkysticks/sdk';
	import ChalkyVideoTheater from '@/TV/TvVideoTheater.vue';
	import UserAvatar from '../User/Avatar.vue';
	import UtilityAlertPrompt from '../Utility/AlertPrompt.vue';
	import { Component, Prop, Ref, Watch, Vue } from 'vue-property-decorator';
	import { VideoTheaterChannel } from '@/TV/VideoTheater.vue';

	@Component({
		components: {
			AuthenticationAuthPanel,
			UserAvatar,
			UtilityAlertPrompt,
		},
	})
	export default class Styleguide extends Vue {
		/**
		 * @type ChalkySticks
		 */
		public get ChalkySticks(): typeof ChalkySticks {
			return ChalkySticks;
		}

		/**
		 * @return Store
		 */
		public get store(): any {
			return ChalkySticks.Core.Provider.Store.get();
		}

		/**
		 * @type ChalkyVideoTheater
		 */
		@Ref('videoTheater')
		readonly videoTheater!: typeof ChalkyVideoTheater;

		/**
		 * @todo Update the factory
		 *
		 * @type ChalkySticks/Model/Authentication
		 */
		@Prop({
			default: () =>
				ChalkySticks.Factory.Authentication.model({
					baseUrl: ChalkySticks.Core.Constants.API_URL_V3,
				}),
		})
		public authModel!: ChalkySticks.Model.Authentication;

		/**
		 * @type ChalkySticks/Collection/Content
		 */
		@Prop({
			default: () =>
				ChalkySticks.Factory.Content.collection({
					limit: 12,
				}),
		})
		public contentCollection!: ChalkySticks.Collection.Content;

		/**
		 * @type ChalkySticks/TV/Collection/Live
		 */
		@Prop({
			default: () => ChalkySticks.Factory.Live.collection(),
		})
		public liveScheduleCollection!: ChalkySticks.TV.Collection.Live;

		/**
		 * @type ChalkySticks/Model/Schedule
		 */
		@Prop({
			default: () => ChalkySticks.Factory.Schedule.model(),
		})
		public liveScheduleModel!: ChalkySticks.Model.Schedule;

		/**
		 * @type ChalkySticks/Collection/Schedule
		 */
		@Prop({
			default: () => ChalkySticks.Factory.Schedule.collection(),
		})
		public scheduleCollection!: ChalkySticks.Collection.Schedule;

		/**
		 * @type ChalkySticks/Collection/User
		 */
		@Prop({
			default: () =>
				ChalkySticks.Factory.User.collection({
					limit: 12,
				}),
		})
		public userCollection!: ChalkySticks.Collection.User;

		/**
		 * @type ChalkySticks/Collection/User
		 */
		@Prop({
			default: () =>
				ChalkySticks.Factory.User.model({
					id: 1,
				}),
		})
		public userModel!: ChalkySticks.Model.User;

		/**
		 * @type ChalkySticks/Collection/Venue
		 */
		@Prop({
			default: () =>
				ChalkySticks.Factory.Venue.collection({
					limit: 12,
				}),
		})
		public venueCollection!: ChalkySticks.Collection.Venue;

		/**
		 * @type ChalkySticks/Model/Venue
		 */
		@Prop({
			default: () =>
				ChalkySticks.Factory.Venue.model({
					limit: 12,
				}),
		})
		public venueModel!: ChalkySticks.Model.Venue;

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
		 * @type boolean
		 */
		protected muteVideo: boolean = true;

		/**
		 * @type string
		 */
		protected tab: string = location.hash.substr(1) || 'branding';

		/**
		 * @return void
		 */
		public created(): void {
			// @ts-ignore
			window.chalky = {
				app: {
					limit: 32,
					localUrl: 'http://localhost:8000/v3', // Config.App.SERVER_URL,
				},
			};

			console.log('ChalkySticks', ChalkySticks);
		}

		/**
		 * @return void
		 */
		public mounted(): void {
			// Bindings
			this.Handle_OnClickNav = this.Handle_OnClickNav.bind(this);
			this.Handle_OnHashChange = this.Handle_OnHashChange.bind(this);

			ChalkySticks.Core.Input.Pointer.start();

			// console.log('Schedule Collection', this.scheduleCollection);
			console.log('Venue Collection', this.venueCollection);

			// Fetch geolocation
			setTimeout(async () => {
				const position = await ChalkySticks.Utility.Geolocation.getLocation();

				console.log('Position', position);
			}, 1000);

			ChalkySticks.Utility.Geolocation.watchLocation((e: any) => {
				this.venueCollection.setQueryParam('latitude', e.position.coords.latitude);
				this.venueCollection.setQueryParam('longitude', e.position.coords.longitude);
				this.venueCollection.fetch();
			});

			this.venueModel.setQueryParam('include', 'comments,reactions');
			this.venueModel.id = '635';

			// Unlock more pagination
			this.venueCollection.setQueryParam('kenefick', 'true');
			this.venueCollection.setQueryParam('distance', '1000');

			this.contentCollection.fetch();
			this.liveScheduleCollection.fetch();
			this.scheduleCollection.fetch();
			this.userCollection.fetch();
			this.userModel.fetch().then(() => {
				console.log('User Model', this.userModel);

				// console.log('    ', this.userModel.getEndpoint());
				// console.log('    ', this.userModel.b.getUrl());
				// console.log('    Media', this.userModel.media);
				// console.log('        ', this.userModel.media.getEndpoint());
				// console.log('        ', this.userModel.media.b.getUrl());
				// console.log('        Media Model', this.userModel.media.at(0));
				// console.log('            ', this.userModel.media.at(0).getEndpoint());
				// console.log('            ', this.userModel.media.at(0).b.getUrl());
			});
			this.venueCollection.fetch();
			this.venueModel.fetch().then(() => {
				console.log('Venue Model', this.venueModel);
			});

			console.log('sup');

			// Listeners
			window.addEventListener('hashchange', this.Handle_OnHashChange);

			// Setup
			this.tokenLogin();
		}

		/**
		 * @return void
		 */
		public tokenLogin(): void {
			let token;

			const authModel = new ChalkySticks.Model.Authentication();
			authModel.baseUrl = 'http://localhost:8000/v3';

			if ((token = ChalkySticks.Model.Authentication.getAuthToken())) {
				// Using promises
				authModel
					.loginWithToken(token)
					.then((userModel) => {
						console.log('User:', userModel.getName(), userModel);
					})
					.catch((e) => {
						console.log('Could not login:', e.code, e.message);
					});
			}
		}

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

		/**
		 * @param PointerEvent e
		 * @return Promise<void>
		 */
		protected async Handle_OnClickNav(e: PointerEvent): Promise<void> {
			e.preventDefault();

			const element = e.currentTarget as HTMLAnchorElement;
			location.href = element.href;
		}

		/**
		 * @param Event e
		 * @return Promise<void>
		 */
		protected async Handle_OnHashChange(e: Event): Promise<void> {
			this.tab = location.hash.substr(1);
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnClickBadge(): Promise<void> {
			console.log('click badge');
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnClickCardGallery(): Promise<void> {
			console.log('click card gallery');
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnClickDialogAlert(): Promise<void> {
			const alertPrompt = this.$refs.alertPrompt as UtilityAlertPrompt;
			await alertPrompt.alert('This is a basic alert message!', 'Basic Alert');
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnClickDialogConfirm(): Promise<void> {
			const alertPrompt = this.$refs.alertPrompt as UtilityAlertPrompt;
			alertPrompt.confirm('Are you sure you want to proceed with this action?', 'Confirmation');

			alertPrompt.$once('result', (result) => {
				console.log('$once', result);
			});

			ChalkySticks.Core.Event.Bus.once('alert', (result) => {
				console.log('ChalkySticks.Core.Event.once', result);
			});
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnClickDialogPrompt(): Promise<void> {
			const alertPrompt = this.$refs.alertPrompt as UtilityAlertPrompt;
			const result = await alertPrompt.prompt('Please select a difficulty level:', 'Game Settings', [
				{
					name: 'difficulty',
					text: 'Easy',
					type: 'tertiary',
					value: 'easy',
				},
				{
					name: 'difficulty',
					text: 'Medium',
					type: 'secondary',
					value: 'medium',
				},
				{
					name: 'difficulty',
					text: 'Hard',
					type: 'primary',
					value: 'hard',
				},
			]);

			console.log('Prompt result:', result);
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnClickDialogCustom(): Promise<void> {
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
		 * @param ChalkySticks.Model.Schedule scheduleModel
		 * @return Promise<void>
		 */
		protected async Handle_OnClickLiveListItem(scheduleModel: ChalkySticks.Model.Schedule): Promise<void> {
			console.log('Model', scheduleModel);

			this.liveScheduleModel = scheduleModel;
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
			// this.mapZoom = 10;

			console.log('We could set the mapZoom here if we wanted');
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnLoginError(): Promise<void> {
			console.log('Login error');
		}

		/**
		 * @return Promise<void>
		 */
		protected async Handle_OnLoginSuccess($user): Promise<void> {
			console.log('Login success', arguments, $user);
		}

		/**
		 * @param IMapPosition position
		 * @return Promise<void>
		 */
		protected async Handle_OnMoveMap(position: IMapPosition): Promise<void> {
			// console.log('Map moved', position);
		}

		/**
		 * @param string query
		 * @return Promise<void>
		 */
		protected async Handle_OnSearchStart(query: string): Promise<void> {
			// this.followUser = false;

			console.log('Search start');
		}

		/**
		 * @param ChalkySticks.Model.Geocode geocodeModel
		 * @return Promise<void>
		 */
		protected async Handle_OnSearchLocation(geocodeModel: ChalkySticks.Model.Geocode): Promise<void> {
			const { latitude, longitude } = geocodeModel.getLocation();

			this.mapLatitude = latitude;
			this.mapLongitude = longitude;

			this.venueCollection.setQueryParam('latitude', latitude.toString());
			this.venueCollection.setQueryParam('longitude', longitude.toString());
			this.venueCollection.fetch();

			console.log('Geocode location', geocodeModel);

			console.log('Location', geocodeModel.getLocation());
		}

		/**
		 * @param ChalkySticks.Collection.Venue venueCollection
		 * @return Promise<void>
		 */
		protected async Handle_OnSearchVenue(venueCollection: ChalkySticks.Collection.Venue): Promise<void> {
			console.log('Venue collection', venueCollection);
		}

		/**
		 * @param string channel
		 * @return Promise<void>
		 */
		protected async Handle_OnSelectChannel(channel: string): Promise<void> {
			console.log('Selected Channel', channel);
		}

		/**
		 * @param ChalkySticks.Model.Media mediaModel
		 * @param number index
		 * @return Promise<void>
		 */
		protected async Handle_OnSelectMediaVenue(mediaModel: ChalkySticks.Model.Media, index: number): Promise<void> {
			console.log('Selected Media', mediaModel, index);
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
			const value = e.submitter?.value;

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
	.styleguide {
		margin: 0 auto;
		min-height: 100vh;
		overflow-x: hidden;
		padding: 2rem;
		text-align: left;

		header > nav {
			align-items: center;
			display: flex;
			gap: 1rem;
			justify-content: space-around;
			margin: 0 auto;
			max-width: 800px;
		}

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

	// Media Queries
	// ---------------------------------------------------------------------------

	@media (max-width: 800px) {
		.styleguide {
			padding: 1rem;

			.level-1 {
				padding-left: 0;

				> header {
					float: none;
					margin-left: 0;
				}
			}
		}
	}

	// State
	// ---------------------------------------------------------------------------

	.styleguide .level-0:not(.state-active) {
		display: none;
	}
</style>
