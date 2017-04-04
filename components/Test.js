/**
 * Test component
 * @flow
 */

import React from 'react';
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

function Test() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>This is Test.js</Text>
            <Text style={styles.text}>
                {`useragent: ${DeviceInfo.getUserAgent()}\n\n`}
                {`system name: ${DeviceInfo.getSystemName()}\n\n`}
                {`system version: ${DeviceInfo.getSystemVersion()}\n\n`}
                {`device name: ${DeviceInfo.getDeviceName()}`}
            </Text>
        </View>
    );
}

export default Test;
