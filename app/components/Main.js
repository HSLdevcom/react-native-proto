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
// import {ScrollView, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
// import Immutable from 'immutable';
import CustomWebView from './CustomWebView';
// import NewsFeed from './NewsFeed';
// import SingleNews from './SingleNews';
// import {
//     hideSingleNews,
// } from '../actions/news';
import {getBeaconData} from '../actions/beacons';

export const REITTIOPAS_MOCK_URL = 'https://reittiopas.fi/?mock';
export const REITTIOPAS_URL = 'https://reittiopas.fi';

// const styles = StyleSheet.create({
//     container: {
//         marginBottom: 50,
//     },
//     scrollView: {
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
// });

/*
* Current UUID for OnyxBeacon
* 20CAE8A0-A9CF-11E3-A5E2-0800200C9A66
*/
const beaconId = '20CAE8A0-A9CF-11E3-A5E2-0800200C9A66';
const vehicleBeaconId = '20CAE8A0-A9CF-11E3-A5E2-0800200C9A66';

const beaconRegion = {
    identifier: 'OnyxBeacon',
    uuid: beaconId,
};

const vehicleBeaconRegion = {
    identifier: 'OnyxBeacon',
    uuid: vehicleBeaconId,
};


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
        this.props.getBeaconData();
        DeviceEventEmitter.addListener(
            'regionDidEnter',
            (data) => {
                console.log('MONITORING - regionDidEnter data: ', data);
            }
        );

        DeviceEventEmitter.addListener(
            'regionDidExit',
            (data) => {
                console.log('MONITORING - regionDidExit data: ', data);
            }
        );
        if (Platform.OS === 'ios') Beacons.startUpdatingLocation();
        // Beacons.stopMonitoringForRegion(beaconRegion);
        // Beacons.stopRangingBeaconsInRegion(beaconRegion);
        // Beacons.stopUpdatingLocation();
    }
    /*
    componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            this.props.getBeaconData();
        }
        this.setState({appState: nextAppState});
    }
    */


    /**
    componentWillMount() {
        const region = {
            identifier: 'OnyxBeacon',
            uuid: '20CAE8A0-A9CF-11E3-A5E2-0800200C9A66',
        };

        if (Platform.OS === 'ios') {
            Beacons.requestAlwaysAuthorization();
        }
        Beacons.startMonitoringForRegion(region);
        Beacons.startRangingBeaconsInRegion(region);
        Beacons.startUpdatingLocation();

        //Beacons.stopMonitoringForRegion(region);
        //Beacons.stopRangingBeaconsInRegion(region);
        //Beacons.stopUpdatingLocation();


        DeviceEventEmitter.addListener(
            'regionDidEnter',
            (data) => {
                console.log('monitoring - regionDidEnter data: ', data);
            }
        );

        DeviceEventEmitter.addListener(
            'regionDidExit',
            (data) => {
                console.log('monitoring - regionDidExit data: ', data);
            }
        );

DeviceEventEmitter.addListener(
    'beaconsDidRange',
    (data) => {
        const workingBeacons = data.beacons.filter(b => b.accuracy > 0);
        console.log(`BEACONS: ${workingBeacons
            .map(b => `\n ${b.major}-${b.minor} strength: ${b.rssi} accuracy: ${b.accuracy}\n`)}`);
        if (workingBeacons.length > 0) {
            console.log(`You're on line: ${resolveLine(lineEstimate(workingBeacons))}`);
            this.props.setBeaconLine(resolveLine(lineEstimate(workingBeacons)));
        }
    }
);

        //DeviceEventEmitter.removeListener('regionDidEnter');
        //DeviceEventEmitter.removeListener('regionDidExit');
        //DeviceEventEmitter.removeListener('beaconsDidRange');
    }
    **/

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


//export default Main;
