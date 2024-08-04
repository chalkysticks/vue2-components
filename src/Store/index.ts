import Vue from 'vue';
import Vuex from 'vuex';
import authentication from './Module/Authentication';

// Attach Vuex
// -----------------------------------------------------------------------------

Vue.use(Vuex);

// Setup Store
// -----------------------------------------------------------------------------

const store = new Vuex.Store<any>({
	modules: {
		authentication,
	},
	plugins: [],
});

export default store;
