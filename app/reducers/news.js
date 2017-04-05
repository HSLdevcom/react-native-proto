/*
 *
 * News reducer
 *
 */

import {fromJS} from 'immutable';
import {FETCHING_NEWS} from '../actions/news';

const initialState = fromJS({
    fetching: false,
    data: false,
});

function newsReducer(state = initialState, action) {
    switch (action.type) {
    case FETCHING_NEWS:
        return state.set('fetching', true);
    default:
        return state;
    }
}

export default newsReducer;
