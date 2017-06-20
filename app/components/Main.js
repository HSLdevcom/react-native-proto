/**
 * Main component
 * @flow
 */

import React, {Component} from 'react';
import {
    AppState,
    DeviceEventEmitter,
    Platform,
} from 'react-native';
import Beacons from 'react-native-beacons-manager';
import {connect} from 'react-redux';
import CustomWebView from './CustomWebView';
import {getBeaconData} from '../actions/beacons';

export const REITTIOPAS_MOCK_URL = 'https://reittiopas.fi/?mock';
export const REITTIOPAS_URL = 'https://reittiopas.fi';


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
const testBeaconId = (Platform.OS === 'ios') ?
'7D7AFDB9-14A3-EECC-A67D-DBD798A33C25' :
'7d7afdb9-14a3-eecc-a67d-dbd798a33c25';

const beaconRegion = {
    identifier: 'OnyxBeacon',
    uuid: beaconId,
};

const vehicleBeaconRegion = {
    identifier: 'OnyxBeacon',
    uuid: vehicleBeaconId,
};
const testBeaconRegion = (Platform.OS === 'ios') ? {
    identifier: 'Livi',
    uuid: testBeaconId,
} : testBeaconId;

class Main extends Component { // eslint-disable-line react/prefer-stateless-function

    state = {
        appState: AppState.currentState,
    }

    componentWillMount = () => {
        if (Platform.OS === 'android') {
            Beacons.detectIBeacons();
        }
        Beacons.startMonitoringForRegion(beaconRegion);
        Beacons.startMonitoringForRegion(vehicleBeaconRegion);
        Beacons.startMonitoringForRegion(testBeaconRegion);
        if (Platform.OS === 'ios') {
            Beacons.startUpdatingLocation();
        }
        this.props.getBeaconData();
        DeviceEventEmitter.addListener(
            'regionDidEnter',
            (data) => {
                console.log('MONITORING - regionDidEnter data: ', data);
                this.props.getBeaconData();
            }
        );
        DeviceEventEmitter.addListener(
            'regionDidExit',
            (data) => {
                console.log('MONITORING - regionDidExit data: ', data);
            }
        );
    }

    // TODO: add options view and define there if user wants to use this with "?mock"?
    render() {
        return (
            <CustomWebView uri={REITTIOPAS_MOCK_URL} />
        );
    }
}

Main.propTypes = {
    getBeaconData: React.PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {

    };
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
