/*
*
* News reducer
*
*/

import {fromJS} from 'immutable';
import {
    FETCHING_NEWS,
    FETCHING_NEWS_DONE,
    FETCHING_NEWS_ERROR,
    HIDE_SINGLE_NEWS,
    SHOW_SINGLE_NEWS,
} from '../actions/news';

const initialState = fromJS({
    activeSingleNews: false,
    error: false,
    fetching: false,
    data: false,
});

function newsReducer(state = initialState, action) {
    switch (action.type) {
    case FETCHING_NEWS:
        return state.set('fetching', true)
        .set('error', false);
    case FETCHING_NEWS_DONE:
        return state.set('fetching', false)
        .set('error', false)
        .set('data', fromJS(action.data));
    case FETCHING_NEWS_ERROR:
        return state.set('fetching', false)
        .set('error', action.error);
    case HIDE_SINGLE_NEWS:
        return state.set('activeSingleNews', false);
    case SHOW_SINGLE_NEWS:
        return state.set('activeSingleNews', action.nid);
    default:
        return state;
    }
}

export default newsReducer;
