/*
*
* Beacons reducer
*
*/
/**
import {fromJS} from 'immutable';
import {
    REMOVE_BEACON_LINE,
    SET_BEACON_LINE,
} from '../actions/beacons';

const initialState = fromJS({
    beaconLine: 'ZZZ',
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
**/
import {fromJS} from 'immutable';
import {
    BEACON_ERROR,
    VEHICLE_BEACON_ERROR,
    SET_BEACON_DATA,
    SET_VEHICLE_BEACON_DATA,
    REQUEST_BEACON_DATA,
} from '../actions/beacons';

export const initialState = fromJS({
    beaconData: {},
    vehicleBeaconData: [],
    beaconError: null,
    vehicleBeaconError: null,
    gettingBeaconData: false,
    gettingVehicleBeaconData: false,
});

const beacons = (state = initialState, action) => {
    switch (action.type) {
    case SET_BEACON_DATA:

        return state.set('beaconData', action.beaconData).set('gettingBeaconData', action.gettingBeaconData);

    case SET_VEHICLE_BEACON_DATA:

        return state.set('vehicleBeaconData', action.beaconData).set('gettingVehicleBeaconData', action.gettingVehicleBeaconData);

    case REQUEST_BEACON_DATA:

        return state.set('gettingBeaconData', action.gettingBeaconData).set('gettingVehicleBeaconData', action.gettingVehicleBeaconData);

    case BEACON_ERROR:

        return state.set('beaconError', action.beaconError).set('gettingBeaconData', action.gettingBeaconData);

    case VEHICLE_BEACON_ERROR:

        return state.set('vehicleBeaconError', action.beaconError).set('gettingVehicleBeaconData', action.gettingBeaconData);

    default:
        return state;
    }
};

export default beacons;
