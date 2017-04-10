/**
 * Test component
 * @flow
 */

import React from 'react';
import {Animated, StyleSheet, Text} from 'react-native';
// https://github.com/rebeccahughes/react-native-device-info
import DeviceInfo from 'react-native-device-info';

const animatedValue = new Animated.Value(0);
const opacityValue = new Animated.Value(0);
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
    Animated.timing(animatedValue, {toValue: 1, duration: 500}).start();
    Animated.timing(opacityValue, {toValue: 1, duration: 1000}).start();
    const marginTop = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-1000, 0],
    });
    return (
        <Animated.View style={[styles.container, {marginTop, opacity: opacityValue}]}>
            <Text style={styles.text}>This is Test.js</Text>
            <Text style={styles.text}>
                {`useragent: ${DeviceInfo.getUserAgent()}\n\n`}
                {`system name: ${DeviceInfo.getSystemName()}\n\n`}
                {`system version: ${DeviceInfo.getSystemVersion()}\n\n`}
                {`device name: ${DeviceInfo.getDeviceName()}`}
            </Text>
        </Animated.View>
    );
}

export default Test;
