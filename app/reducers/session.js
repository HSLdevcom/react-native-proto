/*
*
* Session reducer
*
*/

import {fromJS} from 'immutable';
import {
    REMOVE_SESSION,
    SET_SESSION,
} from '../actions/session';

const initialState = fromJS({
    data: false,
});

function sessionsReducer(state = initialState, action) {
    switch (action.type) {
    case REMOVE_SESSION:
        return state.set('data', false);
    case SET_SESSION:
        return state.set('data', action.session);
    default:
        return state;
    }
}

export default sessionsReducer;
