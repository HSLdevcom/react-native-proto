/**
 * CustomWebView
 * @flow
 */

import React from 'react';
import {Platform, StyleSheet, View, WebView} from 'react-native';

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
        marginTop: (Platform.OS === 'ios') ? 65 : 55,
        width: '100%',
    },
});
const showSpinner = () => <Text>Loading...</Text>;
function CustomWebView({uri}) {
    return (
        <View style={styles.container}>
            <WebView
                style={styles.webView}
                source={{uri}}
                scalesPageToFit
                renderLoading={showSpinner}
            />
        </View>
    );
}

CustomWebView.propTypes = {
    uri: React.PropTypes.string.isRequired,
};

export default CustomWebView;
