import ChalkySticks from '@chalkysticks/sdk';
import State from './State';

/**
 * Mutations are a synchronous way of modifying state. They are generally
 * called through Actions. It's best to think of them as setters.
 *
 * @see https://vuex.vuejs.org/guide/mutations.html
 *
 * @class Mutations
 * @package Store/Module/Authentication
 * @project ChalkySticks SDK Vue2.0 Components
 */
const mutations = {
	/**
	 * @param State state
	 * @return void
	 */
	logout(state: typeof State): void {
		state.token = '';
		state.user = undefined;
	},

	/**
	 * @param State state
	 * @param string token
	 * @return void
	 */
	setToken(state: typeof State, token: string): void {
		state.token = token;
	},

	/**
	 * @param State state
	 * @param ChalkySticks.Model.User user
	 * @return void
	 */
	setUser(state: typeof State, userAttributes: any): void {
		state.user = userAttributes;
	},
};

export default mutations;
