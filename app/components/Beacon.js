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
        marginBottom: 50,
    },
    subtextStyle: {
        fontSize: 30,
        color: colors.brandColor,
        marginTop: 5,
        marginBottom: 5,
    },
});

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
        .map(b => b.line) :
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
                    {displayBeacon && displayBeacon.line ? displayBeacon.line : 'Ei linjalla'}
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
                    {stopBeacon.stop || 'Ei pysäkillä'}
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
