/**
 * Test component
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Navigation from './Navigation';

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
        return (
            <View style={styles.container}>
                <Text style={styles.text}>This is Test.js</Text>
                <Navigation />
            </View>
        );
    }
}

export default Test;
