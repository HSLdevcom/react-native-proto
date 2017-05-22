/**
 * CustomWebView
 * @flow
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import Cookie from 'react-native-cookie';
import Immutable from 'immutable';
import {ActivityIndicator, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View, WebView} from 'react-native';
import {
    removeCookie,
    setCookie,
} from '../actions/cookies';
import {
    setSession,
    removeSession,
} from '../actions/session';
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
const HSLSAMLSessionID = 'HSLSAMLSessionID';

class CustomWebView extends Component { // eslint-disable-line react/prefer-stateless-function
    // Inner state is bad but at this point it's easier
    state = {
        backButtonEnabled: false,
        forwardButtonEnabled: false,
        loading: true,
        position: {},
    };

    componentDidMount() {
        const {uri} = this.props;
        // TODO: do we want to get the position on every mount or keep it in state with some logic?
        // TODO: remove process.env check when https://github.com/facebook/react-native/pull/13442 is in RN
        if (uri.startsWith('https://reittiopas') && process.env.NODE_ENV !== 'test') {
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

    componentDidUpdate() {
        // const {uri} = this.props;
        // Cookie.get(uri)
        // .then((cookie) => {
        //     if (cookie) {
        //         this.handleCookies(cookie);
        //     }
        // });
    }

    onMessage = (event) => {
        console.log('message: ', event.nativeEvent.data);
    }
    onLoadEnd = () => {
        this.setState({loading: false});
    }
    onNavigationStateChange = (navState) => {
        const {uri} = this.props;
        // TODO: pass an id to CustomWebView props and add the id and webview url to (redux) store
        // so we can open the last used page when component is rendered
        console.log(navState);
        if (navState.url.startsWith('https://login.hsl.fi/simplesaml/module.php/core/idp/resumelogout.php')) {
            this.props.removeCookie();
            this.props.removeSession();
        } else if (
            navState.navigationType === 'formsubmit' &&
            (
                navState.url.startsWith('https://www.hsl.fi') ||
                navState.url.startsWith('https://login.hsl.fi')
            )) {
            Cookie.get(uri)
            .then((cookie) => {
                if (cookie) {
                    if (cookie.HSLSAMLSessionID) {
                        this.props.setCookie(cookie);
                        this.props.setSession({
                            loggedIn: true,
                            [HSLSAMLSessionID]: cookie.HSLSAMLSessionID,
                        });
                    }
                }
            });
        }
        this.setState({
            backButtonEnabled: navState.canGoBack,
            forwardButtonEnabled: navState.canGoForward,
        });
    }
    handleCookies = (currentCookie) => {
        console.log('currentCookie: ', currentCookie);
        const {cookies, uri} = this.props;
        if (
            (
                !cookies.get('cookie') &&
                currentCookie.HSLSAMLSessionID
            )
            ||
            (
                currentCookie.HSLSAMLSessionID &&
                cookies.get('cookie')[HSLSAMLSessionID] !== currentCookie.HSLSAMLSessionID
            )
        ) {
            console.log('setCookie to store');
            this.props.setCookie(currentCookie);
            this.props.setSession({
                loggedIn: true,
                [HSLSAMLSessionID]: currentCookie.HSLSAMLSessionID,
            });
        } else if (
            (
                cookies.get('cookie')[HSLSAMLSessionID] &&
                !currentCookie.HSLSAMLSessionID
            )
            ||
            (
                cookies.get('cookie')[HSLSAMLSessionID] &&
                cookies.get('cookie')[HSLSAMLSessionID] !== currentCookie.HSLSAMLSessionID
            )
        ) {
            console.log('set cookies to webview');
            // Object.keys(cookies.get('cookie')).forEach((item) => {
            //     console.log(item, cookies.get('cookie')[item]);
            //     Cookie.set(uri, item, cookies.get('cookie')[item])
            //     .then(() => console.log(`${item} cookie set success`))
            //     .catch(err => console.log(err));
            // });
        }
    }
    goBack = () => {
        this.webview.goBack();
    }

    goForward = () => {
        this.webview.goForward();
    }

    // getCookiePart = (key) => {}

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
        // console.log('cookies: ', cookies.get('cookie'));
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
            // window.postMessage(document.cookie);
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
        ` : `
        `;
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
    cookies: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    onMessageEnabled: React.PropTypes.bool,
    removeCookie: React.PropTypes.func.isRequired,
    removeSession: React.PropTypes.func.isRequired,
    scrollEnabled: React.PropTypes.bool,
    setCookie: React.PropTypes.func.isRequired,
    setSession: React.PropTypes.func.isRequired,
    showBackForwardButtons: React.PropTypes.bool,
    uri: React.PropTypes.string.isRequired,
};

CustomWebView.defaultProps = {
    autoHeightEnabled: false,
    onMessageEnabled: false,
    scrollEnabled: true,
    showBackForwardButtons: false,
};

function mapStateToProps(state) {
    return {
        cookies: state.cookies,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        removeCookie: () => dispatch(removeCookie()),
        removeSession: () => dispatch(removeSession()),
        setCookie: cookie => dispatch(setCookie(cookie)),
        setSession: session => dispatch(setSession(session)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomWebView);

// export default CustomWebView;
