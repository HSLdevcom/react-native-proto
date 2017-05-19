/**
 * CustomWebView
 * @flow
 */

import React, {Component} from 'react';
import {ActivityIndicator, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View, WebView} from 'react-native';
import colors from '../colors';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
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
        justifyContent: 'center',
        marginBottom: 50,
    },
    button: {
        alignItems: 'center',
        borderColor: 'transparent',
        borderRadius: 3,
        bottom: 50,
        justifyContent: 'center',
        marginRight: 3,
        position: 'absolute',
        padding: 3,
        width: 40,
        zIndex: 2,
    },
    disabledButton: {
        left: -10000,
    },
    hidden: {
        height: 0,
        zIndex: 0,
    },
    navButton: {
        backgroundColor: colors.brandColor,
    },
    leftButton: {
        left: 0,
    },
    rightButton: {
        right: 0,
    },
    spinner: {
        height: 80,
        position: 'absolute',
        zIndex: 2,
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

class CustomWebView extends Component { // eslint-disable-line react/prefer-stateless-function
    // Inner state is bad but at this point it's easier
    state = {
        backButtonEnabled: false,
        forwardButtonEnabled: false,
        loading: true,
        position: {},
    };

    componentDidMount() {
        // TODO: do we want to get the position on every mount or keep it in state with some logic?
        if (this.props.uri.startsWith('https://reittiopas')) {
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
    }

    onMessage = (event) => {
        console.log('message: ', event.nativeEvent.data);
    }
    onLoadEnd = () => {
        this.setState({loading: false});
    }
    onNavigationStateChange = (navState) => {
        // TODO: pass an id to CustomWebView props and add the id and webview url to (redux) store
        // so we can open the last used page when component is rendered
        this.setState({
            backButtonEnabled: navState.canGoBack,
            forwardButtonEnabled: navState.canGoForward,
        });
    }
    goBack = () => {
        this.webview.goBack();
    }

    goForward = () => {
        this.webview.goForward();
    }

    render() {
        const {
            autoHeightEnabled,
            onMessageEnabled,
            scrollEnabled,
            showBackForwardButtons,
            uri,
        } = this.props;
        const {backButtonEnabled, forwardButtonEnabled, loading, position} = this.state;
        let containerHeight = parseInt(screenHeight - 80, 10);

        // TODO: this is not bulletproof "solution" at all...
        // WebView inside ScrollView sucks...
        if (autoHeightEnabled) {
            containerHeight = (screenWidth > 400) ?
                (1000 + parseInt(screenHeight - 80, 10)) :
                (1200 + parseInt(screenHeight - 80, 10));
        }
        let webViewMarginTop = (Platform.OS === 'ios') ? 63 : 53;
        if (autoHeightEnabled) webViewMarginTop = 0;
        let inlineJS = onMessageEnabled ? `
            // Workaround to https://github.com/facebook/react-native/issues/10865
            var originalPostMessage = window.postMessage;
            var patchedPostMessage = function(message, targetOrigin, transfer) {
                originalPostMessage(message, targetOrigin, transfer);
            };
            patchedPostMessage.toString = function() {
                return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
            };
            window.postMessage = patchedPostMessage;
            // One way to try to send page height back to the app (not working with Android...)
            // https://github.com/scazzy/react-native-webview-autoheight/blob/master/index.js
            // (function(){
            //     let height = 0;
            //     if(document.documentElement.clientHeight>document.body.clientHeight) {
            //         height = document.documentElement.clientHeight;
            //     } else {
            //         height = document.body.clientHeight;
            //     }
            //     postMessage('height;' + height);
            // })();
        ` : '';
        if (position.lat && position.long) {
            // If we have lat and long use mock
            inlineJS = `
                if (window.mock) {
                    window.mock.geolocation.setCurrentPosition(${position.lat}, ${position.long});
                }
            `;
        }
        const backButton = showBackForwardButtons ?
            (
                <TouchableOpacity
                    onPress={this.goBack}
                    style={backButtonEnabled ?
                        [styles.navButton, styles.button, styles.leftButton] :
                        [styles.button, styles.leftButton, styles.disabledButton]}
                >
                    <Text style={styles.text} >{'<'}</Text>
                </TouchableOpacity>
            ) :
            null;
        const forwardButton = showBackForwardButtons ?
            (
                <TouchableOpacity
                    onPress={this.goForward}
                    style={forwardButtonEnabled ?
                        [styles.navButton, styles.button, styles.rightButton] :
                        [styles.button, styles.rightButton, styles.disabledButton]}
                >
                    <Text style={styles.text} >{'>'}</Text>
                </TouchableOpacity>
            ) :
            null;
        return (
            <View
                style={[styles.container, {height: containerHeight}]}
            >
                <ActivityIndicator
                    animating={loading}
                    size="large"
                    style={[styles.centering, styles.spinner, loading ? null : styles.hidden]}
                />
                {backButton}
                {forwardButton}
                <WebView
                    ref={(c) => { this.webview = c; }}
                    domStorageEnabled
                    javaScriptEnabled
                    style={[styles.webView, {marginTop: webViewMarginTop}]}
                    source={{uri}}
                    scalesPageToFit
                    onLoadEnd={this.onLoadEnd}
                    onMessage={
                        onMessageEnabled ?
                            this.onMessage :
                            null
                    } // there's issuses with onMessage
                    onNavigationStateChange={this.onNavigationStateChange}
                    scrollEnabled={scrollEnabled}
                    injectedJavaScript={inlineJS}
                />
            </View>
        );
    }
}

CustomWebView.propTypes = {
    autoHeightEnabled: React.PropTypes.bool,
    onMessageEnabled: React.PropTypes.bool,
    scrollEnabled: React.PropTypes.bool,
    showBackForwardButtons: React.PropTypes.bool,
    uri: React.PropTypes.string.isRequired,
};

CustomWebView.defaultProps = {
    autoHeightEnabled: false,
    onMessageEnabled: false,
    scrollEnabled: true,
    showBackForwardButtons: false,
};

export default CustomWebView;
