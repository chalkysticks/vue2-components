import Vue from 'vue';
import Vuex from 'vuex';
import authentication from './Module/Authentication';
import location from './Module/Location';

// Attach Vuex
// -----------------------------------------------------------------------------

Vue.use(Vuex);

// Setup Store
// -----------------------------------------------------------------------------

const store = new Vuex.Store<any>({
	modules: {
		authentication,
		location,
	},
	plugins: [],
});

export default store;
