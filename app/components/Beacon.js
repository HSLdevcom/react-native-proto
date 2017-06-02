/**
 * Beacon test component
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, DeviceEventEmitter} from 'react-native';
import {connect} from 'react-redux';
import Beacons from 'react-native-beacons-manager';
import Immutable from 'immutable';

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


class Beacon extends Component { // eslint-disable-line react/prefer-stateless-function

    render() {
        const bData = this.props.beacons.get('beaconData');
        return (
            <View style={styles.container}>
                <Text>
                    Olet linjalla:
                </Text>
                <Text style={styles.textStyle}>
                    {bData.major || 'Ei linjalla'}
                </Text>
            </View>
        );
    }
}

Beacon.propTypes = {
    beacons: React.PropTypes.instanceOf(Immutable.Map).isRequired,
};

function mapStateToProps(state) {
    return {
        beacons: state.beacons,
    };
}

const mapDispatchToProps = () => ({
});


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Beacon);
