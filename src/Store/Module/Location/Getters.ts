import State from './State';

/**
 * Getters are used to calculate values based off state. They are generally
 * used for filtering or formatting data.
 *
 * @class Getters
 * @package Store/Module/Location
 * @project ChalkySticks SDK Vue2.0 Components
 */
const getters = {
	/**
	 * @param State state
	 * @return number
	 */
	accuracy(state: typeof State): number {
		return state.position?.coords.accuracy || 0;
	},

	/**
	 * @param State state
	 * @return boolean
	 */
	hasPosition(state: typeof State): boolean {
		return !!getters.latitude(state) && !!getters.longitude(state);
	},

	/**
	 * @param State state
	 * @return number
	 */
	latitude(state: typeof State): number {
		return state.position?.coords.latitude || 0;
	},

	/**
	 * @param State state
	 * @return number
	 */
	longitude(state: typeof State): number {
		return state.position?.coords.longitude || 0;
	},
};

export default getters;
