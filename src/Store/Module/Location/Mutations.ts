import State from './State';

/**
 * Mutations are a synchronous way of modifying state. They are generally
 * called through Actions. It's best to think of them as setters.
 *
 * @see https://vuex.vuejs.org/guide/mutations.html
 *
 * @class Mutations
 * @package Store/Module/Location
 * @project ChalkySticks SDK Vue2.0 Components
 */
const mutations = {
	/**
	 * @param State state
	 * @param GeolocationPosition payload
	 * @return void
	 */
	setLocation(state: typeof State, payload: GeolocationPosition): void {
		state.position = payload;
	},
};

export default mutations;
