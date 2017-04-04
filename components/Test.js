/**
 * Test component
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
// https://github.com/rebeccahughes/react-native-device-info
import DeviceInfo from 'react-native-device-info';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(0, 122, 201)',
    },
    text: {
        color: 'rgb(255, 255, 255)',
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});

class Test extends Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        console.log(`useragent: ${DeviceInfo.getUserAgent()}, model: ${DeviceInfo.getModel()}`);
        return (
            <View style={styles.container}>
                <Text style={styles.text}>This is Test.js</Text>
                <Text style={styles.text}>{`useragent: ${DeviceInfo.getUserAgent()}\n\nsystem name: ${DeviceInfo.getSystemName()}`}</Text>
            </View>
        );
    }
}

export default Test;
