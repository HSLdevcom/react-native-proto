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

const beaconRegion = {
    identifier: 'OnyxBeacon',
    uuid: beaconId,
};

const vehicleBeaconRegion = {
    identifier: 'OnyxBeacon',
    uuid: vehicleBeaconId,
};

let counter = 0;

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
        if (Platform.OS === 'ios') {
            Beacons.startUpdatingLocation();
        }
        this.props.getBeaconData();
        DeviceEventEmitter.addListener(
            'regionDidEnter',
            (data) => {
                console.log('MONITORING - regionDidEnter data: ', data);
                this.props.getBeaconData();
                // if (Platform.OS === 'android') {
                //     Beacons.startRangingBeaconsInRegion(beaconId);
                //     Beacons.startRangingBeaconsInRegion(vehicleBeaconId);
                // } else {
                //     Beacons.startRangingBeaconsInRegion(beaconRegion);
                //     Beacons.startRangingBeaconsInRegion(vehicleBeaconRegion);
                // }
            }
        );
        DeviceEventEmitter.addListener(
            'regionDidExit',
            (data) => {
                console.log('MONITORING - regionDidExit data: ', data);
                counter += 1;
                // Beacons.stopRangingBeaconsInRegion(beaconId);
                // Beacons.stopRangingBeaconsInRegion(vehicleBeaconId);
            }
        );
    }

    // componentDidMount() {
    //     AppState.addEventListener('change', this.handleAppStateChange);
    // }

    componentWillUnmount() {
        // AppState.removeEventListener('change', this.handleAppStateChange);
    }

    // handleAppStateChange = (nextAppState) => {
    //     if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
    //         this.props.getBeaconData();
    //     }
    //     this.setState({appState: nextAppState});
    // }

    // if (props.news.get('activeSingleNews')) {
    //     const data = props.news.get('data');
    //     const singleNews = data.find(item =>
    // item.get('nid') === props.news.get('activeSingleNews'));
    //     return <SingleNews hide={props.hideSingleNews} singleNews={singleNews} />;
    // }
    // return (
    //     <ScrollView contentContainerStyle={styles.scrollView} style={styles.container}>
    //         <CustomWebView uri="https://reittiopas.fi/" />
    //         {/* <CustomWebView uri="http://192.168.1.124:8080/" /> */}
    //         <NewsFeed />
    //     </ScrollView>
    // );

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
