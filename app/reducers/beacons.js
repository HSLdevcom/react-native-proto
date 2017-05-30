/*
*
* Beacons reducer
*
*/

import {fromJS} from 'immutable';
import {
    REMOVE_BEACON_LINE,
    SET_BEACON_LINE,
} from '../actions/beacons';

const initialState = fromJS({
    beaconLine: '',
});

function beaconsReducer(state = initialState, action) {
    switch (action.type) {
    case REMOVE_BEACON_LINE:
        return state.set('beaconLine', '');
    case SET_BEACON_LINE:
        return state.set('beaconLine', action.beaconLine);
    default:
        return state;
    }
}

export default beaconsReducer;
