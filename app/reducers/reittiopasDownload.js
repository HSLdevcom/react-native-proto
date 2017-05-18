/*
*
* Reittiopas reducer
*
*/

import {fromJS} from 'immutable';
import {
    FETCHING_REITTIOPAS,
    FETCHING_REITTIOPAS_DONE,
    FETCHING_REITTIOPAS_ERROR,
} from '../actions/reittiopasDownload';

const initialState = fromJS({
    error: false,
    fetching: false,
    timestamp: false,
});

function reittiopasReducer(state = initialState, action) {
    switch (action.type) {
    case FETCHING_REITTIOPAS:
        return state.set('fetching', true)
        .set('error', false);
    case FETCHING_REITTIOPAS_DONE:
        return state.set('fetching', false)
        .set('error', false)
        .set('timestamp', action.timestamp);
    case FETCHING_REITTIOPAS_ERROR:
        return state.set('fetching', false)
        .set('error', action.error);
    default:
        return state;
    }
}

export default reittiopasReducer;
