/**
 * Main component
 * @flow
 */

import React, {Component} from 'react';
import {
    DeviceEventEmitter,
    Platform} from 'react-native';
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

/**
* A placeholder function for resolving line name based on beacon "major" identifier.
* Should be replaced with DB query in the future.
*/
const resolveLine = (major) => {
    switch (major) {
    case 234:
        return '102T';
    case 235:
        return '103';
    default:
        return '';
    }
};

/**
* Estimating the bus the user is on.
* Currently just taking the strongest signal. Could utilize queues.
*/
const lineEstimate = arr => arr.sort((a, b) => a.rssi - b.rssi)[0].major;

class Main extends Component { // eslint-disable-line react/prefer-stateless-function

    componentWillMount = () => {
        this.props.getBeaconData();
        const enter = DeviceEventEmitter.addListener(
            'regionDidEnter',
            (data) => {
                console.log('monitoring - regionDidEnter data: ', data);
                getBeaconData();
            }
        );

        const exit = DeviceEventEmitter.addListener(
            'regionDidExit',
            (data) => {
                console.log('monitoring - regionDidExit data: ', data);
                getBeaconData();
            }
        );
    }
    /**
    componentWillMount() {
        const region = {
            identifier: 'OnyxBeacon',
            uuid: '20CAE8A0-A9CF-11E3-A5E2-0800200C9A66',
        };

        if (Platform.os === 'ios') {
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
