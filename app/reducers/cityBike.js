/*
*
* City bike reducer
*
*/

import {fromJS} from 'immutable';
import {
    REMOVE_CITY_BIKE_DATA,
    SET_CITY_BIKE_USER_DATA,
    SET_CITY_BIKE_RENTALS_DATA,
} from '../actions/cityBike';

const initialState = fromJS({
    user: false,
    rentals: false,
});

function cityBikeReducer(state = initialState, action) {
    switch (action.type) {
    case REMOVE_CITY_BIKE_DATA:
        return state.set('rentals', false).set('user', false);
    case SET_CITY_BIKE_RENTALS_DATA:
        return state.set('rentals', action.rentals);
    case SET_CITY_BIKE_USER_DATA:
        return state.set('user', action.user);
    default:
        return state;
    }
}

export default cityBikeReducer;
