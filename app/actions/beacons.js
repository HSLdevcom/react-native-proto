import Beacons from 'react-native-beacons-manager';
import {
    DeviceEventEmitter,
    Platform,
    PermissionsAndroid,
} from 'react-native';
import moment from 'moment';

import * as beaconConfig from '../../beaconconfig';

import stations from '../../stations.json';
import placement from '../../placement.json';
import prefixes from '../../municipalityprefixes.json';
import stops from '../../stops.json';

const _ = require('lodash');

export const SET_BEACON_DATA = 'SET_BEACON_DATA';
export const SET_VEHICLE_BEACON_DATA = 'SET_VEHICLE_BEACON_DATA';
export const BEACON_ERROR = 'BEACON_ERROR';
export const VEHICLE_BEACON_ERROR = 'VEHICLE_BEACON_ERROR';
export const REQUEST_BEACON_DATA = 'REQUEST_BEACON_DATA';
export const REQUESTING_DATA = 'REQUESTING_DATA';

const TIMETABLE_URL = 'https://www.reittiopas.fi/pysakit/';

const FOREGROUND_SCAN_PERIOD = 1000;
const BACKGROUND_SCAN_PERIOD = 1000;

const PREVIOUS_VEHICLES_LIMIT = 8;
const PREVIOUS_STOPS_LIMIT = 8;

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


const beaconId = (Platform.OS === 'ios') ?
beaconConfig.beaconId.ios :
beaconConfig.beaconId.android;

const vehicleBeaconId = (Platform.OS === 'ios') ?
beaconConfig.vehicleBeaconId.ios :
beaconConfig.vehicleBeaconId.android;

const liviBeaconId = (Platform.OS === 'ios') ?
beaconConfig.liviBeaconId.ios :
beaconConfig.liviBeaconId.android;

const beaconRegion = (Platform.OS === 'ios') ?
beaconConfig.beaconRegion.ios :
beaconConfig.beaconRegion.android;

const vehicleBeaconRegion = (Platform.OS === 'ios') ?
beaconConfig.vehicleBeaconRegion.ios :
beaconConfig.vehicleBeaconRegion.android;

const liviBeaconRegion = (Platform.OS === 'ios') ?
beaconConfig.liviBeaconRegion.ios :
beaconConfig.liviBeaconRegion.android;

let beaconFound = false;
let vehicleBeaconsFound = false;

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
        // try {
        //     fetch(
        //     'https://rata.digitraffic.fi/api/v1/live-trains?station=' +
        // matchingStation[0].stationShortCode +
        // '&minutes_before_departure=180' +
        // '&minutes_after_departure=0' +
        // '&minutes_before_arrival=0' +
        // '&minutes_after_arrival=0'
        // )
        //     .then(response => response.json()).then((responseJson) => {
        //         responseJson.forEach((x) => {
        //             _.remove(
            // x.timeTableRows, y => y.stationShortCode !== matchingStation[0].stationShortCode
        //                 || y.type !== 'DEPARTURE' || y.commercialTrack !== platform.toString()
    // );
        //         });
        //         _.remove(responseJson, train => train.timeTableRows.length < 1
                        // || train.trainCategory !== 'Commuter');
        //         const sorted = _.sortBy(responseJson, t => t.timeTableRows[0].scheduledTime);
        //         // console.log('====================================');
        //         // console.log(sorted);
        //         // console.log('====================================');
        //         departingTrains = _.take(sorted, 5);
        //     });
        // } catch (error) {
        //     console.log(error);
        // }
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

if (Platform.OS === 'android') {
    Beacons.detectIBeacons();
    // Beacons.setForegroundScanPeriod(FOREGROUND_SCAN_PERIOD);
    // Beacons.setBackgroundScanPeriod(BACKGROUND_SCAN_PERIOD);
}
const getData = async function getData(dispatch) {
    try {
        await Beacons.startRangingBeaconsInRegion(vehicleBeaconRegion);
        console.log(combinedStopBeaconRegions);
        await combinedStopBeaconRegions.forEach((region) => {
            Beacons.startRangingBeaconsInRegion(region);
        }, this);
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
     * Fires once for every region being listened (during one second)
     */
    DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
         /**
         * Handle stop beacons:
         * Simple comparison of the strongest signal
         */
        console.log(`REGION: ${data.region.uuid}`);
        if ((Platform.OS === 'ios' && (data.region.uuid === beaconRegion.uuid || data.region.uuid === liviBeaconRegion.uuid))
        || (Platform.OS === 'android' && (data.identifier === beaconRegion || data.identifier === liviBeaconRegion))) {
            const workingBeacons = data.beacons.filter(b =>
            (b.rssi < 0 && (b.uuid === beaconId || b.uuid === liviBeaconId)));
            console.log(`STOPBEACONS: ${data.beacons
                .map(b => `\n
                ${b.major}-${b.minor} :
                 uuid: ${b.uuid}
                 strength: ${b.rssi}
                 proximity: ${b.proximity}
                 distance: ${b.distance}
                 accuracy: ${b.accuracy} \n`)}`);
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
                    scannedStopBeacons = _.concat(scannedStopBeacons, beaconData);
                }
            }
            if (_.findIndex(combinedStopBeaconRegions, o => o.uuid === data.region.uuid)
                >= combinedStopBeaconRegions.length - 1) {
                const found = scannedStopBeacons.length > 0 ?
                    _.sortBy(scannedStopBeacons, b => -b.rssi) :
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
            console.log(previousStops.map(stop => stop.stop));
        }


        /**
         * Handle vehicle beacons:
         * Combine the signals of beacons belonging to the same vehicle.
         * Favorst multiple weaker beacons over a single stronger one.
         */
        if ((Platform.OS === 'ios' && data.region.uuid === vehicleBeaconRegion.uuid)
        || (Platform.OS === 'android' && data.identifier === vehicleBeaconRegion)) {
            const workingBeacons = data.beacons.filter(b =>
            (b.rssi < 0 && (b.uuid === vehicleBeaconId)));
            console.log(`VEHICLEBEACONS: ${data.beacons
                .map(b => `\n ${b.major}-${b.minor} :
                uuid: ${b.uuid}
                strength: ${b.rssi}
                proximity: ${b.proximity}
                distance: ${b.distance}
                accuracy: ${b.accuracy} \n`)}`);
            if (workingBeacons.length > 0) {
                let vehicleBeacons = [];

                workingBeacons.forEach((beacon) => {
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
                //No beacons found, empty the store
                previousVehicles.shift();
                dispatch(setBusBeaconData(0, []));
            }
            // console.log(previousVehicles.map(v => v.major));
        }
        // console.log('--------------');
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

