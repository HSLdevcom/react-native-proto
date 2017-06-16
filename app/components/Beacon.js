/**
 * Beacon test component
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
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
    },
});

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
const resolveStop = (minor) => {
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
    default:
        return '';
    }
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
                    Other vehicles close by:
                </Text>
                <Text>
                    {otherVehicles ? otherVehicles[0] : ''}
                </Text>
                <Text style={styles.textStyle}>
                    {resolveStop(stopBeacon.minor) || 'Ei pysäkillä'}
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
