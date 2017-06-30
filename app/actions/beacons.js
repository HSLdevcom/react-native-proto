import Beacons from 'react-native-beacons-manager';
import {
    DeviceEventEmitter,
    Platform,
    PermissionsAndroid,
} from 'react-native';
import {concat, findIndex, sortBy} from 'lodash';

import * as beaconConfig from '../../beaconconfig';
import stations from '../../stations.json';
import placement from '../../placement.json';
import prefixes from '../../municipalityprefixes.json';
import stops from '../../stops.json';

export const SET_BEACON_DATA = 'SET_BEACON_DATA';
export const SET_VEHICLE_BEACON_DATA = 'SET_VEHICLE_BEACON_DATA';
export const BEACON_ERROR = 'BEACON_ERROR';
export const VEHICLE_BEACON_ERROR = 'VEHICLE_BEACON_ERROR';
export const REQUEST_BEACON_DATA = 'REQUEST_BEACON_DATA';
export const REQUESTING_DATA = 'REQUESTING_DATA';

const TIMETABLE_URL = 'https://www.reittiopas.fi/pysakit/';

const PREVIOUS_VEHICLES_LIMIT = 8;
const PREVIOUS_STOPS_LIMIT = 8;

let beaconFound = false;
let vehicleBeaconsFound = false;

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


const beaconId = beaconConfig.beaconId;

const vehicleBeaconId = beaconConfig.vehicleBeaconId;

const liviBeaconId = beaconConfig.liviBeaconId;

const beaconRegion = beaconConfig.beaconRegion;
const vehicleBeaconRegion = beaconConfig.vehicleBeaconRegion;
const liviBeaconRegion = beaconConfig.liviBeaconRegion;

let tryingToFindBeacons = false;

let previousVehicles = []; //eslint-disable-line
let previousStops = []; //eslint-disable-line

const combinedStopBeaconRegions = [beaconRegion, liviBeaconRegion];
let scannedStopBeacons = [];

export const setBeaconData = function setBeaconData(confidence, beaconData) {
    return {
        type: SET_BEACON_DATA,
        confidence,
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

/**
* A placeholder function for resolving line name based on vehiclebeacon "major" identifier.
* Should be replaced with DB query in the future.
*/
const resolveLine = (major) => {
    switch (major) {
    case 234:
        return '102T';
    case 235:
        return '103';
    case 1:
        return '9';
    default:
        return '';
    }
};

/**
* A function for resolving bus stop based on stopbeacon "uuid", "minor" and "major" attributes
*/
const resolveStop = (uuid, major, minor) => {
    if (uuid === beaconId) {
        const matchingStop = prefixes.filter(s => s.code === major);
        if (matchingStop.length > 0) {
            return `${matchingStop[0].prefix}${minor}`;
        }
        return null;
    }
    if (uuid === liviBeaconId) {
        let returnString = '';
        const matchingStation = stations.filter(s => s.stationUICCode === major);
        if (matchingStation.length > 0) {
            returnString += `${matchingStation[0].stationName} - `;
        }
        const platform = minor >>> 11; //eslint-disable-line
        if (platform > 0 && platform < 32) returnString += `Liikennepaikan ${platform}. laituri - `;
        let departingTrains = null; //eslint-disable-line
        const placementBits = minor & 63 //eslint-disable-line
        const matchingPlacement = placement.filter(p => p.id === placementBits);
        if (matchingPlacement.length > 0) {
            returnString += matchingPlacement[0].description;
        }
        return returnString.length > 0 ? returnString : null;
    }
    return null;
};

const resolveTimetableLink = (stop) => {
    const matchingCode = stops.filter(s => s.code === stop);
    if (matchingCode.length > 0) {
        return `${TIMETABLE_URL}${matchingCode[0].gtfsId}`;
    }
    return null;
};

const findRegionIndex = (data) => {
    if (Platform.OS === 'ios') {
        return findIndex(combinedStopBeaconRegions, o => o.uuid === data.region.uuid);
    }
    return findIndex(combinedStopBeaconRegions, o => o.uuid === data.uuid);
};

if (Platform.OS === 'android') {
    Beacons.detectIBeacons();
    // Beacons.setForegroundScanPeriod(FOREGROUND_SCAN_PERIOD);
    // Beacons.setBackgroundScanPeriod(BACKGROUND_SCAN_PERIOD);
}

/**
* Stop ranging in certain region or in all regions
* @param {bool} onlyVehicleBeacons
* @param {bool} onlyStopBeacons
*/
export const stopRanging = (onlyVehicleBeacons = false, onlyStopBeacons = false) => {
    if (Platform.OS === 'ios') {
        if (onlyVehicleBeacons) {
            console.log('stopOnlyVehicleBeacons');
            Beacons.stopRangingBeaconsInRegion(vehicleBeaconRegion);
        } else if (onlyStopBeacons) {
            console.log('stopOnlyStopBeacons');
            Beacons.stopRangingBeaconsInRegion(beaconRegion);
            Beacons.stopRangingBeaconsInRegion(liviBeaconRegion);
        } else {
            console.log('stopAllRanging');
            Beacons.stopRangingBeaconsInRegion(vehicleBeaconRegion);
            Beacons.stopRangingBeaconsInRegion(beaconRegion);
            Beacons.stopRangingBeaconsInRegion(liviBeaconRegion);
        }
    } else if (onlyVehicleBeacons) {
        console.log('stopOnlyVehicleBeacons');
        Beacons.stopRangingBeaconsInRegion(
            vehicleBeaconRegion.identifier,
            vehicleBeaconRegion.uuid
        );
    } else if (onlyStopBeacons) {
        console.log('stopOnlyStopBeacons');
        Beacons.stopRangingBeaconsInRegion(beaconRegion.identifier, beaconRegion.uuid);
        Beacons.stopRangingBeaconsInRegion(liviBeaconRegion.identifier, liviBeaconRegion.uuid);
    } else {
        console.log('stopAllRanging');
        Beacons.stopRangingBeaconsInRegion(
            vehicleBeaconRegion.identifier,
            vehicleBeaconRegion.uuid
        );
        Beacons.stopRangingBeaconsInRegion(
            beaconRegion.identifier,
            beaconRegion.uuid
        );
        Beacons.stopRangingBeaconsInRegion(
            liviBeaconRegion.identifier,
            liviBeaconRegion.uuid
        );
    }
    tryingToFindBeacons = false;
};
// array of beacos data
let workingVehicleBeacons;
// array of beacos data
let workingBeacons;
let vehicleBeaconsLastFoundTimestamp = false;
let firstScanTimestamp = false;

export const getWorkingBeacons = () => workingBeacons;
export const getWorkingVehicleBeacons = () => workingVehicleBeacons;

/**
* Start ranging and add beaconsDidRange event listener
* @param {function} dispatch
* @param {bool} onlyBeaconRegion
* @param {bool} onlyLiviBeaconRegion
* @param {bool} onlyVehicleBeaconRegion
*/
const getData = async function getData(
    dispatch,
    onlyBeaconRegion = false,
    onlyLiviBeaconRegion = false,
    onlyVehicleBeaconRegion = false,
) {
    try {
        firstScanTimestamp = Date.now();
        vehicleBeaconsLastFoundTimestamp = false;
        if (onlyBeaconRegion || onlyLiviBeaconRegion) {
            console.log('start combined stopBeaconRegions');
            if (Platform.OS === 'ios') {
                await combinedStopBeaconRegions.forEach((region) => {
                    Beacons.startRangingBeaconsInRegion(region);
                }, this);
            } else {
                await combinedStopBeaconRegions.forEach((region) => {
                    Beacons.startRangingBeaconsInRegion(region.identifier, region.uuid);
                }, this);
            }
        } else if (onlyVehicleBeaconRegion) {
            console.log('start onlyVehicleBeaconRegion');
            if (Platform.OS === 'ios') {
                await Beacons.startRangingBeaconsInRegion(vehicleBeaconRegion);
            } else {
                await Beacons.startRangingBeaconsInRegion(
                    vehicleBeaconRegion.identifier,
                    vehicleBeaconRegion.uuid
                );
            }
        } else {
            console.log('start ranging all regions');
            if (Platform.OS === 'ios') {
                await Beacons.startRangingBeaconsInRegion(vehicleBeaconRegion);
                await combinedStopBeaconRegions.forEach((region) => {
                    Beacons.startRangingBeaconsInRegion(region);
                }, this);
            } else {
                await Beacons.startRangingBeaconsInRegion(
                    vehicleBeaconRegion.identifier,
                    vehicleBeaconRegion.uuid
                );
                await combinedStopBeaconRegions.forEach((region) => {
                    Beacons.startRangingBeaconsInRegion(region.identifier, region.uuid);
                }, this);
            }
        }
    } catch (error) {
        stopRanging();
        if (!beaconFound) dispatch(beaconError("Beacon didn't start ranging"));
        if (!vehicleBeaconsFound) dispatch(vehicleBeaconError("Beacon didn't start ranging"));
        return;
    }

    /**
     * Handle all detected beacons
     * Fires once for every region being listened (during one second)
     */
    DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
         /**
         * Handle stop beacons:
         * Simple comparison of the strongest signal
         */
        if ((Platform.OS === 'ios' && (data.region.uuid === beaconRegion.uuid || data.region.uuid === liviBeaconRegion.uuid))
        || (Platform.OS === 'android' && (data.uuid === beaconRegion.uuid || data.uuid === liviBeaconRegion.uuid))) {
            workingBeacons = data.beacons.filter(b =>
            (b.rssi < 0 && (b.uuid === beaconId || b.uuid === liviBeaconId)));
            // console.log(`STOPBEACONS: ${workingBeacons
            //     .map(b => `\n
            //     ${b.major}-${b.minor} :
            //      uuid: ${b.uuid}
            //      strength: ${b.rssi}
            //      proximity: ${b.proximity}
            //      distance: ${b.distance}
            //      accuracy: ${b.accuracy} \n`)}`);
            if (workingBeacons.length > 0) {
                let closestBeaconIndex = 0;
                let strongestBeaconRSSI = -101;

                workingBeacons.forEach((beacon, index) => {
                    if ((beacon.rssi > strongestBeaconRSSI)
                    && (beacon.uuid === beaconId || beacon.uuid === liviBeaconId)) {
                        closestBeaconIndex = index;
                        strongestBeaconRSSI = beacon.rssi;
                    }
                });

                const beaconData = workingBeacons[closestBeaconIndex];
                if (beaconData
                && (beaconData.uuid === beaconId || beaconData.uuid === liviBeaconId)) {
                    beaconData.stop = resolveStop(
                        beaconData.uuid,
                        beaconData.major,
                        beaconData.minor
                    );
                    // Inserting the timetable link to HSL stop beacons
                    if (beaconData.uuid === beaconId && beaconData.stop) {
                        beaconData.link = resolveTimetableLink(beaconData.stop);
                    }
                    scannedStopBeacons = concat(scannedStopBeacons, beaconData);
                }
            }
            if (findRegionIndex(data)
                >= combinedStopBeaconRegions.length - 1) {
                const found = scannedStopBeacons.length > 0 ?
                    sortBy(scannedStopBeacons, b => -b.rssi) :
                    [];
                /**
                 * Saving the beacons that were previously considered the strongest
                 * in a single scan. PREVIOUS_STOPS_LIMIT limits the number of beacons saved.
                 *
                 * Confidence of the strongest beacon in this scan actually being closest
                 * is calculated by checking how many times the same stop
                 * occurs in previous scans.
                 */
                if (found.length > 0) previousStops.push(found[0]);

                if (previousStops.length > PREVIOUS_STOPS_LIMIT) {
                    previousStops.shift();
                }
                if (found.length > 0) {
                    const conf = previousStops.length > 0 ?
                    previousStops.filter(m => m.major === found[0].major)
                    .length / previousStops.length :
                    0;
                    dispatch(setBeaconData(conf, found));
                } else {
                    previousStops.shift();
                    dispatch(setBeaconData(0, found));
                }
                scannedStopBeacons = [];
            }
            // console.log(previousStops.map(stop => stop.stop));
        }


        /**
         * Handle vehicle beacons:
         * Combine the signals of beacons belonging to the same vehicle.
         * Favorst multiple weaker beacons over a single stronger one.
         */
        if ((Platform.OS === 'ios' && data.region.uuid === vehicleBeaconRegion.uuid)
        || (Platform.OS === 'android' && data.uuid === vehicleBeaconRegion.uuid)) {
            workingVehicleBeacons = data.beacons.filter(b =>
            (b.rssi < 0 && (b.uuid === vehicleBeaconId)));
            // console.log(`VEHICLEBEACONS: ${workingVehicleBeacons
            //     .map(b => `\n ${b.major}-${b.minor} :
            //     uuid: ${b.uuid}
            //     strength: ${b.rssi}
            //     proximity: ${b.proximity}
            //     distance: ${b.distance}
            //     accuracy: ${b.accuracy} \n`)}`);
            if (workingVehicleBeacons.length > 0) {
                let vehicleBeacons = [];

                workingVehicleBeacons.forEach((beacon) => {
                    if (beacon.uuid === vehicleBeaconId) {
                        if (vehicleBeacons.filter(b => b.major === beacon.major).length > 0) {
                            vehicleBeacons
                        .filter(b => b.major === beacon.major)[0].rssi += (200 + beacon.rssi);
                        } else {
                            vehicleBeacons.push(beacon);
                        }
                    }
                });

                if (vehicleBeacons.length > 0) {
                    vehicleBeaconsLastFoundTimestamp = Date.now();
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
                    vehicleBeacons.forEach(function (vehicleBeaconData)  { //eslint-disable-line
                        vehicleBeaconData.line = resolveLine(vehicleBeaconData.major); //eslint-disable-line
                    });
                    /**
                     * Saving the beacons that were previously considered the strongest
                     * in a single scan. PREVIOUS_VEHICLES_LIMIT limits the number of beacons saved.
                     *
                     * Confidence of the strongest beacon in this scan actually being closest
                     * is calculated by checking how many times the same vehicle
                     * occurs in previous scans.
                     */
                    previousVehicles.push(vehicleBeacons[0]);
                    if (previousVehicles.length > PREVIOUS_VEHICLES_LIMIT) {
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
                previousVehicles.shift();
                if (!previousVehicles || previousVehicles.length === 0) {
                    // If we haven't seen vehicle beacons in 20 sec, stop ranging
                    const timestamp = Date.now();
                    console.log('timestamp - vehicleBeaconsLastFoundTimestamp: ', timestamp - vehicleBeaconsLastFoundTimestamp);
                    console.log('timestamp - firstScanTimestamp: ', timestamp - firstScanTimestamp);
                    if (
                        (
                            parseInt(vehicleBeaconsLastFoundTimestamp, 10) > 0 &&
                            timestamp - vehicleBeaconsLastFoundTimestamp > 20000
                        ) ||
                        (
                            !vehicleBeaconsLastFoundTimestamp &&
                            parseInt(firstScanTimestamp, 10) > 0 &&
                            timestamp - firstScanTimestamp > 20000
                        )
                    ) {
                        console.log('over 20 sec since we saw last vehicle beacon, just in case stopRanging in vehicleBeaconRegion');
                        stopRanging(true);
                    }
                    //No beacons found, empty the store
                    dispatch(setBusBeaconData(0, []));
                }
            }
            // console.log(previousVehicles.map(v => v.major));
        }
        // console.log('--------------');
    });
};

/**
* Get beacon data
* @param {bool} onlyBeaconRegion
* @param {bool} onlyLiviBeaconRegion
* @param {bool} onlyVehicleBeaconRegion
*/
export const getBeaconData = (
    onlyBeaconRegion = false,
    onlyLiviBeaconRegion = false,
    onlyVehicleBeaconRegion = false,
) => {
    if (!tryingToFindBeacons) {
        tryingToFindBeacons = true;
        beaconFound = false;
        vehicleBeaconsFound = false;

        return (dispatch) => {
            dispatch(requestBeaconData());
            getData(dispatch, onlyBeaconRegion, onlyLiviBeaconRegion, onlyVehicleBeaconRegion);
        };
    }

    return {type: REQUESTING_DATA};
};
