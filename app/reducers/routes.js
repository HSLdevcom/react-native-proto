/*
*
* Routes reducer
* @see: https://github.com/aksonov/react-native-router-flux/blob/master/docs/REDUX_FLUX.md
*/

import {ActionConst} from 'react-native-router-flux';
import {fromJS} from 'immutable';

const initialState = fromJS({
    scene: {},
});

function routesReducer(state = initialState, action) {
    switch (action.type) {
    // focus action is dispatched when a new screen comes into focus
    case ActionConst.FOCUS:
        return state.set('scene', action.scene);
    default:
        return state;
    }
}

export default routesReducer;
