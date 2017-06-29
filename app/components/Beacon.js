/**
 * Beacon test component
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Linking, Button} from 'react-native';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import {getBeaconData} from '../actions/beacons';
import colors from '../colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: 'white',
    },
    subcontainer: {
        paddingLeft: 30,
        paddingTop: 30,
        paddingBottom: 30,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: 'white',
    },
    textStyle: {
        fontSize: 50,
        color: colors.brandColor,
        marginTop: 5,
        marginBottom: 5,
    },
    subtextStyle: {
        fontSize: 25,
        color: colors.brandColor,
        marginTop: 5,
        marginBottom: 5,
    },
});

let displayedVehicleBeacon = null;
let displayedStopBeacon = null;

class Beacon extends Component { // eslint-disable-line react/prefer-stateless-function

    componentWillMount() {
        this.props.getBeaconData();
    }

    openLink = (url) => {
        if (url) Linking.openURL(url).catch(err => console.error('An error occurred', err));
        else console.log("Can't open url");
    }

    render() {
        const stopBeacon = (this.props.beacons.get('beaconData').stops
        && this.props.beacons.get('beaconData').stops.length > 0) ?
        this.props.beacons.get('beaconData').stops[0] :
        null;

        const otherStops = (this.props.beacons.get('beaconData').stops
        && this.props.beacons.get('beaconData').stops.length > 1
        && displayedStopBeacon) ?
        this.props.beacons.get('beaconData').stops.filter(b => b.major !== displayedStopBeacon.major)
        .map(b => b.stop) :
        null;

        if (this.props.beacons.get('beaconData').confidence > 0.5) {
            displayedStopBeacon = stopBeacon;
        }
        if (this.props.beacons.get('beaconData').confidence === 0) {
            displayedStopBeacon = null;
        }

        const vehicleBeacon = (this.props.beacons.get('vehicleBeaconData').vehicles
        && this.props.beacons.get('vehicleBeaconData').vehicles.length > 0) ?
        this.props.beacons.get('vehicleBeaconData').vehicles[0] :
        null;

        const otherVehicles = (this.props.beacons.get('vehicleBeaconData').vehicles
        && this.props.beacons.get('vehicleBeaconData').vehicles.length > 1
        && displayedVehicleBeacon) ?
        this.props.beacons.get('vehicleBeaconData').vehicles.filter(b => b.major !== displayedVehicleBeacon.major)
        .map(b => b.line) :
        null;

        if (this.props.beacons.get('vehicleBeaconData').confidence > 0.5) {
            displayedVehicleBeacon = vehicleBeacon;
        }
        if (this.props.beacons.get('vehicleBeaconData').confidence === 0) {
            displayedVehicleBeacon = null;
        }

        return (
            <View style={styles.container}>
                <View style={styles.subcontainer}>
                    <Text style={styles.textStyle}>
                        {displayedVehicleBeacon && displayedVehicleBeacon.line ? displayedVehicleBeacon.line : 'Ei linjalla'}
                    </Text>
                    <Text>
                        Muut ajoneuvot lähelläsi:
                    </Text>
                    <Text>
                        {otherVehicles ? otherVehicles[0] : 'Ei muita'}
                    </Text>
                </View>
                <View style={styles.subcontainer}>
                    <Text style={styles.subtextStyle}>
                        Pysäkki:
                    </Text>
                    <Text style={styles.subtextStyle}>
                        {displayedStopBeacon && displayedStopBeacon.stop ? displayedStopBeacon.stop : 'Ei pysäkillä'}
                    </Text>
                    <Button
                        onPress={() => this.openLink(displayedStopBeacon.link)}
                        title={displayedStopBeacon && displayedStopBeacon.link ? 'Avaa aikataulu' : 'Aikataulua ei saatavilla'}
                        color="#841584"
                        accessibilityLabel="Avaa pysäkin aikataulu"
                        disabled={!(displayedStopBeacon && displayedStopBeacon.link)}
                    />
                </View>
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
