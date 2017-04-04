/**
 * Main component
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, View, WebView} from 'react-native';

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
        marginBottom: 50,
        marginTop: 60,
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
            </View>
        );
    }
}

export default Main;
