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
    // Inner state is bad but at this point it's easier
    state = {
        position: {},
    };
    componentDidMount() {
        // TODO: do we want to get the position on every mount or keep it in state with some logic?
        navigator.geolocation.getCurrentPosition((position) => {
            if (position.coords) {
                this.setState({
                    position: {
                        lat: position.coords.latitude,
                        long: position.coords.longitude,
                    },
                });
            }
        }, error => console.log(error), {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000,
        }
        );
    }
    onMessage = (event) => {
        console.log('msg: ', event.nativeEvent.data);
    }

    onNavigationStateChange = (navState) => {
        console.log(navState);
    }

    render() {
        const {position} = this.state;
        let inlineJS = `
            var originalPostMessage = window.postMessage;
            var patchedPostMessage = function(message, targetOrigin, transfer) {
            originalPostMessage(message, targetOrigin, transfer);
            };
            patchedPostMessage.toString = function() {
            return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
            };
            window.postMessage = patchedPostMessage;
        `;
        if (position.lat && position.long) {
            // If we have lat and long use mock
            inlineJS = `
                if (window.mock) {
                    window.mock.geolocation.setCurrentPosition(${position.lat}, ${position.long});
                }
            `;
        }
        return (
            <View
                style={[styles.container]}
            >
                <WebView
                    ref={(c) => { this.webview = c; }}
                    style={styles.webView}
                    source={{uri: (Platform.OS === 'ios') ? 'http://127.0.0.1:8080?mock' : 'http://127.0.0.1:8080?mock'}}
                    // file:///android_asset/web/index.html
                    scalesPageToFit
                    // onMessage={this.onMessage} // this seems to break things
                    onNavigationStateChange={this.onNavigationStateChange}
                    injectedJavaScript={inlineJS}
                />
            </View>
        );
    }
}

export default InlineWebView;
