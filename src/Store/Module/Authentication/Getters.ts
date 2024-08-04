import ChalkySticks from '@chalkysticks/sdk';
import State from './State';

/**
 * Getters are used to calculate values based off state. They are generally
 * used for filtering or formatting data.
 *
 * @class Getters
 * @package Store/Module/Authentication
 * @project ChalkySticks SDK Vue2.0 Components
 */
const getters = {
	/**
	 * Determine if we have passed the age gate
	 *
	 * @param State state
	 * @return boolean
	 */
	authenticated(state: typeof State): boolean {
		return !!state.token && !!state.user;
	},

	/**
	 * Instantiated user model
	 *
	 * @return ChalkySticks.Model.User
	 */
	user(state: typeof State): any {
		return new ChalkySticks.Model.User(state.user);
	},
};

export default getters;
