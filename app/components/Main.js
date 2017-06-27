/**
 * Main component
 * @flow
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    AppState,
    DeviceEventEmitter,
    Platform,
} from 'react-native';
import Beacons from 'react-native-beacons-manager';
import {connect} from 'react-redux';
import CustomWebView from './CustomWebView';
import {getBeaconData, getWorkingBeacons, getWorkingVehicleBeacons, stopRanging} from '../actions/beacons';

const beaconConfig = require('../../beaconconfig');

export const REITTIOPAS_MOCK_URL = 'https://reittiopas.fi/?mock';
export const REITTIOPAS_URL = 'https://reittiopas.fi';

const beaconId = (Platform.OS === 'ios') ?
beaconConfig.beaconId.ios :
beaconConfig.beaconId.android;

const vehicleBeaconId = (Platform.OS === 'ios') ?
beaconConfig.vehicleBeaconId.ios :
beaconConfig.vehicleBeaconId.android;

const liviBeaconId = (Platform.OS === 'ios') ?
beaconConfig.liviBeaconId.ios :
beaconConfig.liviBeaconId.android;

const beaconRegion = beaconConfig.beaconRegion.ios;
const vehicleBeaconRegion = beaconConfig.vehicleBeaconRegion.ios;
const liviBeaconRegion = beaconConfig.liviBeaconRegion.ios;

class Main extends Component { // eslint-disable-line react/prefer-stateless-function

    state = {
        appState: AppState.currentState,
    }
    // TODO: check if app can use bluetooth: checkTransmissionSupported(): promise
    // componentWillMount = () => {
    //     if (Platform.OS === 'android') {
    //         Beacons.detectIBeacons();
    //     }
    //     Beacons.startMonitoringForRegion(beaconRegion);
    //     Beacons.startMonitoringForRegion(vehicleBeaconRegion);
    //     Beacons.startMonitoringForRegion(liviBeaconRegion);
    //     if (Platform.OS === 'ios') {
    //         Beacons.startUpdatingLocation();
    //     }
    //     this.props.getBeaconData();
    //     DeviceEventEmitter.addListener(
    //         'regionDidEnter',
    //         (data) => {
    //             console.log('MONITORING - regionDidEnter data: ', data);
    //             console.log('this.props.getBeaconData()');
    //             this.props.getBeaconData();
    //         }
    //     );
    //     DeviceEventEmitter.addListener(
    //         'regionDidExit',
    //         (data) => {
    //             console.log('MONITORING - regionDidExit data: ', data);
    //             const beacons = getWorkingBeacons();
    //             console.log('getWorkingBeacons: ', beacons);
    //             if (getWorkingVehicleBeacons().length === 0 && !beacons.length) {
    //                 stopRanging();
    //             }
    //         }
    //     );
    // }


    // TODO: add options view and define there if user wants to use this with "?mock"?
    render() {
        return (
            <CustomWebView uri={REITTIOPAS_MOCK_URL} />
        );
    }
}

Main.propTypes = {
    getBeaconData: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {};
}
function mapDispatchToProps(dispatch) {
    return {
        getBeaconData: () => dispatch(getBeaconData()),
    };
}

export default connect(
     mapStateToProps,
     mapDispatchToProps
 )(Main);
