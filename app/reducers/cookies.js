/*
*
* Cookies reducer
*
*/

import {fromJS} from 'immutable';
import {
    REMOVE_COOKIE,
    SET_COOKIE,
} from '../actions/cookies';

const initialState = fromJS({
    cookie: false,
});

function cookiesReducer(state = initialState, action) {
    switch (action.type) {
    case REMOVE_COOKIE:
        return state.set('cookie', false);
    case SET_COOKIE:
        return state.set('cookie', action.cookie);
    default:
        return state;
    }
}

export default cookiesReducer;
