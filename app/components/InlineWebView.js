/**
 * InlineWebView
 * @flow
 */

import React, {Component} from 'react';
import {Dimensions, Platform, StyleSheet, View, WebView} from 'react-native';
import colors from '../colors';

const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    container: {
        alignItems: 'center',
        backgroundColor: colors.brandColor,
        borderBottomWidth: 1,
        borderColor: colors.brandColor,
        flex: 1,
        height: parseInt(screenHeight - 80, 10),
        justifyContent: 'center',
        marginBottom: 50,
    },
    text: {
        color: 'rgb(255, 255, 255)',
        height: 50,
    },
    webView: {
        marginTop: (Platform.OS === 'ios') ? 63 : 53,
        width: '100%',
    },
});

class InlineWebView extends Component { // eslint-disable-line react/prefer-stateless-function

    onMessage = (event) => {
        console.log('msg: ', event.nativeEvent.data);
    }

    onNavigationStateChange = (navState) => {
        console.log(navState);
    }

    render() {
        const inlineJS = `
            setTimeout(function(){
                document.querySelector('#container').innerText = 'Hello!';
            }, 1000);
        `;
        return (
            <View
                style={[styles.container]}
            >
                <WebView
                    ref={(c) => { this.webview = c; }}
                    style={styles.webView}
                    source={{uri: (Platform.OS === 'ios') ? 'web/index.html' : 'file:///android_asset/web/index.html'}}
                    scalesPageToFit
                    // onMessage={this.onMessage} // this seems to break iOS
                    onNavigationStateChange={this.onNavigationStateChange}
                    injectedJavaScript={inlineJS}
                />
            </View>
        );
    }
}

export default InlineWebView;