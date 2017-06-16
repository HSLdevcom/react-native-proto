import Beacons from 'react-native-beacons-manager';
import {
    DeviceEventEmitter,
    Platform,
    PermissionsAndroid,
} from 'react-native';

export const SET_BEACON_DATA = 'SET_BEACON_DATA';
export const SET_VEHICLE_BEACON_DATA = 'SET_VEHICLE_BEACON_DATA';
export const BEACON_ERROR = 'BEACON_ERROR';
export const VEHICLE_BEACON_ERROR = 'VEHICLE_BEACON_ERROR';
export const REQUEST_BEACON_DATA = 'REQUEST_BEACON_DATA';
export const REQUESTING_DATA = 'REQUESTING_DATA';

const FOREGROUND_SCAN_PERIOD = 1000;
const BACKGROUND_SCAN_PERIOD = 1000;

if (Platform.OS === 'ios') {
    Beacons.requestAlwaysAuthorization();
} else {
    try {
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'HSL-sovellusproto',
                message: 'Permission needed to detect beacons',
            }
        );
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            {
                title: 'HSL-sovellusproto',
                message: 'Permission needed to detect beacons',
            }
        );
    } catch (err) {
        console.warn(err);
    }
}

/*
* Current UUID for OnyxBeacon
* 20CAE8A0-A9CF-11E3-A5E2-0800200C9A66
* Stops
* DFFF7ADA-A48A-4F77-AA9A-3A7943641E6C
*/
const beaconId = (Platform.OS === 'ios') ?
'DFFF7ADA-A48A-4F77-AA9A-3A7943641E6C' :
'dfff7ada-a48a-4f77-aa9a-3a7943641e6c';
const vehicleBeaconId = (Platform.OS === 'ios') ?
'20CAE8A0-A9CF-11E3-A5E2-0800200C9A66' :
'20cae8a0-a9cf-11e3-a5e2-0800200c9a66';

const beaconRegion = (Platform.OS === 'ios') ? {
    identifier: 'RuuviTag',
    uuid: beaconId,
} : beaconId;

const vehicleBeaconRegion = (Platform.OS === 'ios') ? {
    identifier: 'OnyxBeacon',
    uuid: vehicleBeaconId,
} : vehicleBeaconId;

let beaconFound = false;
let vehicleBeaconsFound = false;

let tryingToFindBeacons = false;

const PREVIOUS_LIMIT = 10;
let previousVehicles = []; //eslint-disable-line

export const setBeaconData = function setBeaconData(beaconData) {
    return {
        type: SET_BEACON_DATA,
        beaconData,
        gettingBeaconData: false,
    };
};

export const setBusBeaconData = function setBusBeaconData(confidence, beaconData) {
    return {
        type: SET_VEHICLE_BEACON_DATA,
        confidence,
        beaconData,
        gettingVehicleBeaconData: false,
    };
};

export const requestBeaconData = function requestBeaconData() {
    return {
        type: REQUEST_BEACON_DATA,
        gettingBeaconData: true,
        gettingVehicleBeaconData: true,
    };
};

export const beaconError = function beaconError(error) {
    return {
        type: BEACON_ERROR,
        beaconError: error,
        gettingBeaconData: false,
    };
};

export const vehicleBeaconError = function vehicleBeaconError(error) {
    return {
        type: VEHICLE_BEACON_ERROR,
        beaconError: error,
        gettingBeaconData: false,
    };
};

/**
* data.beacons - Array of all beacons inside a region
* in the following structure:
* .uuid
* .major - The major version of a beacon
* .minor - The minor version of a beacon
* .rssi - Signal strength: RSSI value (between -100 and 0)
* .proximity - Proximity value, can either be "unknown", "far", "near" or "immediate"
* .accuracy - The accuracy of a beacon
**/

if (Platform.OS === 'android') {
    Beacons.detectIBeacons();
    Beacons.setForegroundScanPeriod(FOREGROUND_SCAN_PERIOD);
    Beacons.setBackgroundScanPeriod(BACKGROUND_SCAN_PERIOD);
}
const getData = async function getData(dispatch) {
    try {
        await Beacons.startRangingBeaconsInRegion(beaconRegion);
        await Beacons.startRangingBeaconsInRegion(vehicleBeaconRegion);
    } catch (error) {
        Beacons.stopRangingBeaconsInRegion(beaconRegion);
        Beacons.stopRangingBeaconsInRegion(vehicleBeaconRegion);
        if (!beaconFound) dispatch(beaconError("Beacon didn't start ranging"));
        if (!vehicleBeaconsFound) dispatch(vehicleBeaconError("Beacon didn't start ranging"));
        tryingToFindBeacons = false;

        return;
    }

    /**
     * Handle all detected beacons
     */
    DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
        const workingBeacons = data.beacons.filter(b =>
        (b.rssi < 0 && (b.uuid === beaconId || b.uuid === vehicleBeaconId)));
        console.log(`BEACONS: ${data.beacons
            .map(b => `\n ${b.major}-${b.minor} || strength: ${b.rssi} accuracy: ${b.accuracy} uuid: ${b.uuid} proximity: ${b.proximity}\n`)}`);

        if (workingBeacons.length > 0) {
            let closestBeaconIndex = 0;
            let strongestBeaconRSSI = -101;

            let vehicleBeacons = [];

            workingBeacons.forEach((beacon, index) => {
                /**
                 * Handle stop beacons:
                 * Simple comparison of the strongest signal
                 */
                if (beacon.uuid === beaconId && beacon.rssi > strongestBeaconRSSI) {
                    closestBeaconIndex = index;
                    strongestBeaconRSSI = beacon.rssi;
                }
                /**
                 * Handle vehicle beacons:
                 * Combine the signals of beacons belonging to the same vehicle.
                 * Favorst multiple weaker beacons over a single stronger one.
                 */
                if (beacon.uuid === vehicleBeaconId) {
                    if (vehicleBeacons.filter(b => b.major === beacon.major).length > 0) {
                        vehicleBeacons
                        .filter(b => b.major === beacon.major)[0].rssi += (200 + beacon.rssi);
                    } else {
                        vehicleBeacons.push(beacon);
                    }
                }
            });

            const beaconData = workingBeacons[closestBeaconIndex];

            if (beaconData && beaconData.uuid === beaconId) {
                dispatch(setBeaconData(beaconData));
                beaconFound = true;
            }

            if (vehicleBeacons.length > 0) {
                /**
                 * The beacon data closest to the user
                 * is sorted to be always first in the array.
                 */
                if (vehicleBeacons.length > 1) {
                    vehicleBeacons = vehicleBeacons.sort((a, b) => {
                        if (a.rssi > b.rssi) return -1;
                        return 1;
                    });
                }
                /**
                 * Saving the beacons that were previously considered the strongest
                 * in a single scan. PREVIOUS_LIMIT limits the number of beacons saved.
                 *
                 * Confidence of the strongest beacon in this scan actually being closest
                 * is calculated by checking how many times the same vehicle
                 * occurs in previous scans.
                 */
                previousVehicles.push(vehicleBeacons[0]);
                if (previousVehicles.length > PREVIOUS_LIMIT) {
                    previousVehicles.shift();
                }
                const conf = previousVehicles.length > 0 ?
                previousVehicles.filter(m => m.major === vehicleBeacons[0].major)
                .length / previousVehicles.length :
                0;
                dispatch(setBusBeaconData(
                    conf,
                    vehicleBeacons,
                ));
                vehicleBeaconsFound = true;
            }
        } else {
            //No beacons found, empty the store
            dispatch(setBeaconData({}));
            dispatch(setBusBeaconData(0, []));
        }
    });
};

export const getBeaconData = function getBeaconData() {
    if (!tryingToFindBeacons) {
        tryingToFindBeacons = true;
        beaconFound = false;
        vehicleBeaconsFound = false;

        return (dispatch) => {
            dispatch(requestBeaconData());
            getData(dispatch);
        };
    }

    return {type: REQUESTING_DATA};
};

