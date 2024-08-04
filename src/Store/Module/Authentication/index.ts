import actions from './Actions';
import getters from './Getters';
import mutations from './Mutations';
import persist from './Persist';
import state from './State';

/**
 * Separate from global namespace. If we namespace it, you can access like:
 *
 * Getters:
 * 		store.getters['module/getterName'];
 *
 * State:
 * 		store.state.module.stateName;
 *
 * Actions:
 * 		store.dispatch('module/actionName');
 *
 */
const namespaced = true;

/**
 * Configure plugins
 */
const plugins = [persist];

// Setup Store
// -----------------------------------------------------------------------------

export default {
	/**
	 * Triggerable actions
	 * e.g. store.dispatch('increment');
	 */
	actions,

	/**
	 * Calculated values based off state
	 * e.g. store.getters.doubleCount;
	 */
	getters,

	/**
	 * Mutations are a way of modifying state indirectly
	 * e.g. store.commit('increment', 1);
	 */
	mutations,

	/**
	 * Separate getters and actions from global namespace
	 */
	namespaced,

	/**
	 * Vuex Plugin for persisting data across sessions
	 */
	plugins,

	/**
	 * Raw object of our current state
	 */
	state,
};
