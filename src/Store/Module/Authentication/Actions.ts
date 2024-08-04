import { ActionContext } from 'vuex';
import { IStoreState } from './State';

/**
 * @type ActionContext<S, R>
 */
type Context = ActionContext<IStoreState, IStoreState>;

/**
 * Actions are generally meant to be the entrypoint for modifying state.
 *
 * They are asynchronous calls that can perform other tasks and then
 * trigger a mutation (synchronous).
 *
 * @see https://vuex.vuejs.org/guide/actions.html
 *
 * @class Actions
 * @package Store/Module/Authentication
 * @project ChalkySticks SDK Vue2.0 Components
 */
const actions = {
	/**
	 * @param Context context
	 * @return void
	 */
	login(context: Context, payload: IAuthResponse): void {
		context.commit('setToken', payload.token);
		context.commit('setUser', payload.user);
	},

	/**
	 * @param Context context
	 * @return void
	 */
	logout(context: Context): void {
		context.commit('logout');
	},
};

export default actions;
