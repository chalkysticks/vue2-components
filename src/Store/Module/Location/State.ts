/**
 * @type interface
 */
export interface IStoreState {
	position: GeolocationPosition | undefined;
}

/**
 * @class State
 * @package Store/Module/Location
 * @project ChalkySticks SDK Vue2.0 Components
 */
const state: IStoreState = {
	position: undefined,
};

export default state;
