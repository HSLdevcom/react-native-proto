/**
 * Beacon test component
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import {getBeaconData} from '../actions/beacons';

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

class Beacon extends Component { // eslint-disable-line react/prefer-stateless-function

    componentWillMount() {
        this.props.getBeaconData();
    }

    render() {
        const bData = this.props.beacons.get('beaconData');
        return (
            <View style={styles.container}>
                <Text style={styles.textStyle}>
                    {resolveLine(bData.major) || 'Ei linjalla'}
                </Text>
            </View>
        );
    }
}

Beacon.propTypes = {
    getBeaconData: React.PropTypes.func.isRequired,
    beacons: React.PropTypes.instanceOf(Immutable.Map).isRequired,
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
