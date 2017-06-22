/*
* Beacons reducer
*/
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
    vehicleBeaconData: {
        confidence: 0,
        vehicles: [],
    },
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

        return state.set('vehicleBeaconData', {confidence: action.confidence, vehicles: action.beaconData}).set('gettingVehicleBeaconData', action.gettingVehicleBeaconData);

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
