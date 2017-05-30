/**
 * Beacon test component
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, DeviceEventEmitter} from 'react-native';
import Beacons from 'react-native-beacons-manager';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    textStyle: {
        fontSize: 30,
    },
});

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

const region = {
    identifier: 'OnyxBeacons',
    uuid: '20CAE8A0-A9CF-11E3-A5E2-0800200C9A66',
};

class Beacon extends Component { // eslint-disable-line react/prefer-stateless-function

    constructor(props) {
        super(props);
        this.state = {currentLine: ''};
    }

    componentWillMount() {
        Beacons.requestWhenInUseAuthorization();
        Beacons.startRangingBeaconsInRegion(region);
    }

    componentDidMount() {
        // Listening for beacons by using ranging
        DeviceEventEmitter.addListener(
            'beaconsDidRange',
            (data) => {
                const workingBeacons = data.beacons.filter(b => b.accuracy > 0);
                console.log(`BEACONS: ${workingBeacons
                    .map(b => `\n ${b.major}-${b.minor} strength: ${b.rssi} accuracy: ${b.accuracy}\n`)}`);
                if (workingBeacons.length > 0) {
                    this.setState({currentLine: resolveLine(lineEstimate(workingBeacons))});
                } else {
                    this.setState({currentLine: 'Not on a line'});
                }
                console.log(this.state.currentLine);
            }
        );
    }

    componentWillUnMount() {
        // Stop ranging
        Beacons.stopRangingBeaconsInRegion(region);
        this.DeviceEventEmitter.removeListener('beaconsDidRange');
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>
                    Olet linjalla:
                </Text>
                <Text style={styles.textStyle}>
                    {this.state.currentLine || 'Ei linjalla'}
                </Text>
            </View>
        );
    }
}

export default Beacon;
