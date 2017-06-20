/**
 * Beacon test component
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Platform} from 'react-native';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import {getBeaconData} from '../actions/beacons';
import colors from '../colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    textStyle: {
        fontSize: 70,
        color: colors.brandColor,
        marginTop: 20,
        marginBottom: 50,
    },
    subtextStyle: {
        fontSize: 30,
        color: colors.brandColor,
        marginTop: 5,
        marginBottom: 5,
    },
});

/*
* OnyxBeacon default
* 20CAE8A0-A9CF-11E3-A5E2-0800200C9A66
* 20cae8a0-a9cf-11e3-a5e2-0800200c9a66
*
* Stops
* DFFF7ADA-A48A-4F77-AA9A-3A7943641E6C
* 'dfff7ada-a48a-4f77-aa9a-3a7943641e6c'
*
* Livi
* 7D7AFDB9-14A3-EECC-A67D-DBD798A33C25
* 7d7afdb9-14a3-eecc-a67d-dbd798a33c25
*
* Incorrect stopId (same as Onyx)
* 20CAE8A0-A9CF-11E3-A5E2-0800200C9A66
* 20cae8a0-a9cf-11e3-a5e2-0800200c9a66
*
* New vehicle UUID
* BB198F26-4A2F-4B7F-BD7C-9FC09D6D5B2B
* bb198f26-4a2f-4b7f-bd7c-9fc09d6d5b2b
*/
const beaconId = (Platform.OS === 'ios') ?
'20CAE8A0-A9CF-11E3-A5E2-0800200C9A66' :
'20cae8a0-a9cf-11e3-a5e2-0800200c9a66';

const vehicleBeaconId = (Platform.OS === 'ios') ?
'BB198F26-4A2F-4B7F-BD7C-9FC09D6D5B2B' :
'bb198f26-4a2f-4b7f-bd7c-9fc09d6d5b2b';

const liviBeaconId = (Platform.OS === 'ios') ?
'7D7AFDB9-14A3-EECC-A67D-DBD798A33C25' :
'7d7afdb9-14a3-eecc-a67d-dbd798a33c25';

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
* A placeholder function for resolving bus stop based on stopbeacon "minor" identifier.
* Should be replaced with DB query in the future.
*/
const resolveStop = (uuid, major, minor) => {
    if (uuid === beaconId) {
        if (major === 49) {
            switch (minor) {
            case 1033:
                return 'E1033';
            case 1024:
                return 'E1024';
            case 1025:
                return 'E1025';
            case 1026:
                return 'E1026';
            case 1027:
                return 'E1027';
            case 1:
                return 'livi test';
            default:
                return '';
            }
        }
    }
    if (uuid === liviBeaconId) {
        let returnString = '';
        switch (major) {
        case 1:
            returnString += 'Helsinki ';
            break;
        case 68:
            returnString += 'Leppävaara ';
            break;
        default:
            break;
        }
        const platform = minor >>> 11; //eslint-disable-line
        if (platform > 0 && platform < 32) returnString += `Liikennepaikan ${platform}. laituri `;
        switch (minor & 63) { //eslint-disable-line
        case 41:
            returnString += 'Alikulkutunneli';
            break;
        case 42:
            returnString += 'Alikulkutunneli';
            break;
        }
        return returnString;
    }
    return 'Lookup error';
};

let displayBeacon = null;

class Beacon extends Component { // eslint-disable-line react/prefer-stateless-function

    componentWillMount() {
        this.props.getBeaconData();
    }

    render() {
        const stopBeacon = this.props.beacons.get('beaconData');
        const vehicleBeacon = (this.props.beacons.get('vehicleBeaconData').vehicles
        && this.props.beacons.get('vehicleBeaconData').vehicles.length > 0) ?
        this.props.beacons.get('vehicleBeaconData').vehicles[0] :
        null;
        const otherVehicles = (this.props.beacons.get('vehicleBeaconData').vehicles
        && this.props.beacons.get('vehicleBeaconData').vehicles.length > 1
        && displayBeacon) ?
        this.props.beacons.get('vehicleBeaconData').vehicles.filter(b => b.major !== displayBeacon.major)
        .map(b => resolveLine(b.major)) :
        null;
        if (this.props.beacons.get('vehicleBeaconData').confidence > 0.5) {
            displayBeacon = vehicleBeacon;
        }
        if (this.props.beacons.get('vehicleBeaconData').confidence === 0) {
            displayBeacon = null;
        }


        return (
            <View style={styles.container}>
                <Text style={styles.textStyle}>
                    {displayBeacon ? resolveLine(displayBeacon.major) : 'Ei linjalla'}
                </Text>
                <Text>
                    Muut ajoneuvot lähelläsi:
                </Text>
                <Text>
                    {otherVehicles ? otherVehicles[0] : 'Ei muita'}
                </Text>
                <Text style={styles.subtextStyle}>
                    Pysäkki:
                </Text>
                <Text style={styles.subtextStyle}>
                    {resolveStop(stopBeacon.uuid, stopBeacon.major, stopBeacon.minor) || 'Ei pysäkillä'}
                </Text>
            </View>
        );
    }
}

Beacon.propTypes = {
    getBeaconData: React.PropTypes.func.isRequired,
    beacons: React.PropTypes.oneOfType([
        React.PropTypes.instanceOf(Object),
        React.PropTypes.instanceOf(Immutable.Map)],
    ).isRequired,
};

function mapStateToProps(state) {
    return {
        beacons: state.beacons,
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
)(Beacon);
