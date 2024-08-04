import ChalkySticks from '@chalkysticks/sdk';

/**
 * @type interface
 */
export interface IStoreState {
	token: string;
	user: ChalkySticks.Model.User | undefined;
}

/**
 * @class State
 * @package Store/Module/Authentication
 * @project ChalkySticks SDK Vue2.0 Components
 */
const state: IStoreState = {
	token: '',
	user: undefined,
};

export default state;
