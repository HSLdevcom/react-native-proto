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

const ATTEMPT_LIMIT = 8;

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
*/
const beaconId = (Platform.OS === 'ios') ?
'20CAE8A0-A9CF-11E3-A5E2-0800200C9A66' :
'20cae8a0-a9cf-11e3-a5e2-0800200c9a66';
const vehicleBeaconId = (Platform.OS === 'ios') ?
'20CAE8A0-A9CF-11E3-A5E2-0800200C9A66' :
'20cae8a0-a9cf-11e3-a5e2-0800200c9a66';

const beaconRegion = (Platform.OS === 'ios') ? {
    identifier: 'OnyxBeacon',
    uuid: beaconId,
} : beaconId;

const vehicleBeaconRegion = (Platform.OS === 'ios') ? {
    identifier: 'OnyxBeacon',
    uuid: beaconId,
} : beaconId;

let beaconFound = false;
let vehicleBeaconsFound = false;

let tryingToFindBeacons = false;
let attempts = 0;

export const setBeaconData = function setBeaconData(beaconData) {
    return {
        type: SET_BEACON_DATA,
        beaconData,
        gettingBeaconData: false,
    };
};

export const setBusBeaconData = function setBusBeaconData(beaconData) {
    return {
        type: SET_VEHICLE_BEACON_DATA,
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
    // Beacons.setForegroundScanPeriod(FOREGROUND_SCAN_PERIOD);
    // Beacons.setBackgroundScanPeriod(BACKGROUND_SCAN_PERIOD);
}
const getData = async function getData(dispatch) {
    //Beacons.startMonitoringForRegion(beaconRegion);
    //Beacons.startMonitoringForRegion(vehicleBeaconRegion);

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

    DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
        /**
        if (attempts === ATTEMPT_LIMIT) {
            Beacons.stopRangingBeaconsInRegion(beaconRegion);
            Beacons.stopRangingBeaconsInRegion(vehicleBeaconRegion);
            if (!beaconFound) {
                dispatch(beaconError(
                `Beacon not found within the attempt limit (${ATTEMPT_LIMIT})`
            ));
            }
            if (!vehicleBeaconsFound) {
                dispatch(vehicleBeaconError(
                `Beacon not found within the attempt limit (${ATTEMPT_LIMIT})`
            ));
            }
            tryingToFindBeacons = false;
            return;
        }
        **/
        const workingBeacons = data.beacons.filter(b => b.rssi < 0);
        console.log(`BEACONS: ${data.beacons
            .map(b => `\n ${b.major}-${b.minor} || strength: ${b.rssi} accuracy: ${b.accuracy} uuid: ${b.uuid} proximity: ${b.proximity}\n`)}`);

        if (data.beacons.length > 0) {
            let closestBeaconIndex = 0;
            let strongestBeaconRSSI = -101;

            const vehicleBeacons = [];

            workingBeacons.forEach((beacon, index) => {
                if (beacon.uuid === beaconId && beacon.rssi > strongestBeaconRSSI) {
                    closestBeaconIndex = index;
                    strongestBeaconRSSI = beacon.rssi;
                }
                if (beacon.uuid === vehicleBeaconId) {
                    if (vehicleBeacons.filter(b => b.major === beacon.major).length > 0) {
                        vehicleBeacons
                        .filter(b => b.major === beacon.major)[0].rssi += (100 + beacon.rssi);
                    } else {
                        vehicleBeacons.push(beacon);
                    }
                }
            });

            vehicleBeacons.forEach(v => console.log(`vehiclebeacons : ${v.major} RSSI total ${v.rssi}`));

            const beaconData = workingBeacons[closestBeaconIndex];

            if (beaconData && beaconData.uuid === beaconId) {
                dispatch(setBeaconData(beaconData));
                //Beacons.stopRangingBeaconsInRegion(beaconRegion);
                beaconFound = true;
            }

            if (vehicleBeacons.length > 0) {
                dispatch(setBusBeaconData(vehicleBeacons));
                //Beacons.stopRangingBeaconsInRegion(vehicleBeaconRegion);
                vehicleBeaconsFound = true;
            }
        } else {
            //No beacons found, empty the store
            dispatch(setBeaconData({}));
            dispatch(setBusBeaconData([]));
        }
        //attempts += 1;
        //if (beaconFound && vehicleBeaconsFound) tryingToFindBeacons = false;
    });
};

export const getBeaconData = function getBeaconData() {
    if (!tryingToFindBeacons) {
        tryingToFindBeacons = true;

        attempts = 0;
        beaconFound = false;
        vehicleBeaconsFound = false;

        return (dispatch) => {
            dispatch(requestBeaconData());
            getData(dispatch);
        };
    }

    return {type: REQUESTING_DATA};
};

/*
const enter = DeviceEventEmitter.addListener(
    'regionDidEnter',
    (data) => {
        console.log('monitoring - regionDidEnter data: ', data);
        getData();
    }
);

const exit = DeviceEventEmitter.addListener(
    'regionDidExit',
    (data) => {
        console.log('monitoring - regionDidExit data: ', data);
        getData();
    }
);
*/
