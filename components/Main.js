/**
 * Main component
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, View, WebView} from 'react-native';
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
        height: 50,
    },
    webView: {
        marginTop: 20,
        width: '100%',
    },
});

class Main extends Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        return (
            <View style={styles.container}>
                <WebView
                    style={styles.webView}
                    source={{uri: 'https://www.reittiopas.fi/'}}
                    scalesPageToFit
                />
                <Navigation />
            </View>
        );
    }
}

export default Main;
