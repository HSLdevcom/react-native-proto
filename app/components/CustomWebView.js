/**
 * CustomWebView
 * @flow
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import Immutable from 'immutable';
import {
    ActivityIndicator,
    AppState,
    Dimensions,
    Linking,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    WebView,
} from 'react-native';
import {removeCityBikeData} from '../actions/cityBike';
import {
    setSession,
} from '../actions/session';
import colors from '../colors';
import {REITTIOPAS_URL, REITTIOPAS_MOCK_URL} from './Main';
import {CITYBIKE_URL} from './CityBikes';
import {SURVEY_URL} from './WebSurvey';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    container: {
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
        left: parseInt((screenWidth / 2) - 40, 10), // centering spinner...
        position: 'absolute',
        width: 80,
        zIndex: 2,
    },
    text: {
        color: '#ffffff',
        height: 50,
    },
    webView: {},
});

// We can browse these in WebView (other urls are opened in phone browser)
export const whitelistUrls = ['hsl.fi', 'reittiopas.fi', 'jola.louhin'];

class CustomWebView extends Component {
    // Inner state is bad but at this point it's easier
    state = {
        backButtonEnabled: false,
        forwardButtonEnabled: false,
        loading: true,
        position: {},
        overrideUri: false,
        currentUrl: false,
    };

    componentDidMount() {
        // Start listening AppState change, see handleAppStateChange-function
        AppState.addEventListener('change', this.handleAppStateChange);
        const {uri} = this.props;
        // TODO: do we want to get the position on every mount or keep it in store with some logic?
        // TODO: remove process.env check when https://github.com/facebook/react-native/pull/13442 is in RN
        if (uri.startsWith('https://reittiopas') && process.env.NODE_ENV !== 'test') {
            /*
            * NOTICE: At the moment WebView inlineJS is used to get the current position
            * via navigator.geolocation.watchPosition
            */

            // Get current position and use it in reittiopas
            // this.getLocation();
        }
    }

    componentDidUpdate() {}

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    /*
    * WebView onMessage is very fragile to errors
    * SEE: https://github.com/HSLdevcom/react-native-proto/issues/23#issuecomment-300134505
    */
    onMessage = (event) => {
        console.log('message: ', event.nativeEvent.data);
    }
    /*
    * WebView load end
    */
    onLoadEnd = () => this.setState({loading: false});
    onError = e => console.log(e);

    onNavigationStateChange = (navState) => {
        const {session, showBackForwardButtons} = this.props;
        const {url} = navState;
        // console.log(navState);
        // TODO: pass an id to CustomWebView props and add the id and webview url to (redux) store
        // so we can open the last used page when component is rendered?
        if (
            url !== this.state.currentUrl &&
            url.includes('http')
        ) {
            this.setState({currentUrl: url});
        }
        // If next url isn't hsl.fi / reittiopas.fi spesific or http:// -> open it in phone browser
        if (
            (
                url.startsWith('http') &&
                !whitelistUrls.map(v => url.includes(v))
            ) ||
            url.startsWith('http://')
        ) {
            this.webview.stopLoading();
            // force update the view in case webview didn't stopLoading so iOS don't try to load any http://-url
            this.forceUpdate();
            Linking.openURL(url).catch(err => console.log(err));
        } else if (url.includes('https://www.hsl.fi/saml/drupal_login?returnTo') && !session.get('data').loggedIn) {
            /*
            * If user is in citybike-view and going to login -> open login-view
            */
            const returnUrl = url.split('returnTo=');
            if (returnUrl.length === 2) {
                Promise.resolve(this.props.setSession({redirect: returnUrl[1]}))
                .then(() => Actions.login())
                .catch(e => console.log(e));
            } else {
                Actions.login();
            }
        }
        if (showBackForwardButtons) {
            this.setState({
                backButtonEnabled: navState.canGoBack,
                forwardButtonEnabled: navState.canGoForward,
            });
        }
    }
    /*
    * Get location from navigator.geolocation and set it to state
    * This is not used now (see inlineJS)
    */
    getLocation = () => {
        const {uri} = this.props;
        navigator.geolocation.getCurrentPosition((position) => {
            if (position.coords) {
                this.setState({
                    position: {
                        lat: position.coords.latitude + 1,
                        long: position.coords.longitude + 0.5,
                    },
                });
            }
        }, (error) => {
            console.log('GeoLocation error: ', error);
            // Location request timed out
            if (error.code === 3 && uri === REITTIOPAS_MOCK_URL) {
                // TODO: figure out if this is better solution than showing
                // the default ?mock-position if we can't get user position
                // via navigator.geolocation
                this.setState({
                    overrideUri: REITTIOPAS_URL,
                });
            }
        }, {enableHighAccuracy: Platform.OS === 'ios', timeout: 20000, maximumAge: 0}
        // enableHighAccuracy seems to cause timeout in Android...
        );
    }

    /*
    * If app goes background reload webview to stop possible YouTube-video playback
    * in case we are in hsl.fi and OS is android
    * iOS pauses playback automatically
    */
    handleAppStateChange = (nextAppState) => {
        if (
            nextAppState === 'background' &&
            Platform.OS === 'android' &&
            this.state.currentUrl.includes('hsl.fi')
        ) {
            this.webview.reload();
        }
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
            session,
            showBackForwardButtons,
        } = this.props;
        const {
            backButtonEnabled,
            forwardButtonEnabled,
            loading,
            overrideUri,
        } = this.state;
        // In some cases we want to override props.uri
        let uri = overrideUri || this.props.uri;

        let containerHeight = parseInt(screenHeight - 80, 10);
        const containerBackgroundColor = uri === CITYBIKE_URL ?
            colors.cityBikes : // yellow
            colors.brandColor; // blue

        /*
        * TODO: this is not bulletproof "solution" at all...
        * WebView inside ScrollView sucks... https://github.com/HSLdevcom/react-native-proto/issues/7#issuecomment-293803825
        * This tries to set extra height to container View (why not to use ScrollView, see issue ^)
        */
        if (autoHeightEnabled) {
            containerHeight = (screenWidth > 400) ?
                (1000 + parseInt(screenHeight - 80, 10)) :
                (1200 + parseInt(screenHeight - 80, 10));
        }

        let webViewMarginTop = (Platform.OS === 'ios') ? 20 : 0;
        if (autoHeightEnabled) webViewMarginTop = 0;

        /*
        * inlineJS depends on current uri but if onMessage is enabled
        * we need to include this anyways
        */
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

        /*
        * Use inlineJS to set mock position
        * TODO: use navigator.geolocation (problem is Android that won't update the WebView)
        * TODO: check coords.accuracy and update location only if it's > X?
        */
        if (uri === REITTIOPAS_MOCK_URL) {
            inlineJS += `
                window.navigator.standalone = true;
                setTimeout(() => {
                    if (window.mock) {
                        if (navigator && navigator.geolocation) {
                            navigator.geolocation.watchPosition(function(position) {
                                if (
                                    parseInt(position.coords.latitude, 10) > 0 &&
                                    parseInt(position.coords.longitude, 10) > 0
                                ) {
                                    window.mock.geolocation.setCurrentPosition(position.coords.latitude, position.coords.longitude);
                                }
                            },
                            error => console.log(error),
                            {enableHighAccuracy: true, timeout: 60000, maximumAge: 60000});
                        }
                    }
                }, 300);
            `;
        } else if (uri === CITYBIKE_URL && session.get('data') && session.get('data').loggedIn) {
            // if (currentUrl === 'https://www.hsl.fi/citybike/directlogin') {
            //     uri = 'https://www.hsl.fi/citybike/directlogin?content-only';
            // }
            /*
            * Try to click the login-button in hsl.fi/citybike to enable "automatic login"
            * Android needs a bit different logic than iOS...
            * https://stackoverflow.com/a/37332447/4047536
            * There's also '?content-only' replace to currentUrl and all other hsl.fi urls
            * TODO: make this more bulletproof
            * TODO: avoid hacks like this...
            */
            inlineJS += Platform.OS === 'android' ? `
                var ready = function(fn) {
                    if (typeof fn !== 'function') return;
                    if (document.readyState === 'complete') {
                        fn();
                    }
                    document.addEventListener('interactive', fn, false);
                };
                ready(function() {
                    var loginContainer = document.getElementsByClassName('saml-login-link');
                    if (
                        loginContainer.length &&
                        loginContainer[0].children.length &&
                        loginContainer[0].children[0].href
                    ) {
                        loginContainer[0].children[0].click();
                    } else if (
                        window.location.href.split('content-only').length < 2 &&
                        window.location.href.split('login').length < 2
                    ) {
                        if (window.location.href === 'https://www.hsl.fi/citybike/dashboard#!/') {
                            window.location.replace('https://www.hsl.fi/citybike/dashboard/?content-only');
                        } else {
                            window.location.replace(window.location.href + '?content-only');
                        }
                    } else {
                        var links = document.getElementsByTagName('a');
                        Object.keys(links).forEach(function(e) {
                            if (
                                links[e].href &&
                                links[e].href.split('hsl.fi').length >= 2 &&
                                links[e].href.split('content-only').length < 2
                            ) {
                                links[e].href = links[e].href + '?content-only';
                            }
                        });
                    }
                });
            ` : `
                window.onload = () => {
                    var loginContainer = document.getElementsByClassName('saml-login-link');
                    if (
                        loginContainer.length &&
                        loginContainer[0].children.length &&
                        loginContainer[0].children[0].href &&
                        loginContainer[0].children[0].href.includes('login')
                    ) {
                        loginContainer[0].children[0].click();
                    } else if (!window.location.href.includes('content-only')) {
                        if (window.location.href.includes('#!/')) {
                            window.location.replace(window.location.href.split('#!/')[0] + '?content-only');
                        } else {
                            window.location.replace(window.location.href + '?content-only');
                        }
                    } else {
                        var links = document.getElementsByTagName('a');
                        Object.keys(links).forEach((e) => {
                            if (links[e].href.includes('hsl.fi') && !links[e].href.includes('content-only')) {
                                links[e].href = links[e].href + '?content-only';
                            }
                        });
                    }
                };
            `;
        } else if (uri === CITYBIKE_URL) {
            /*
            * If we are on CITYBIKE_URL and not loggedIn we can use '?content-only'
            * But here we have the same inlineJS hacks as above...
            */
            uri = `${CITYBIKE_URL}?content-only`;
            inlineJS += Platform.OS === 'android' ? `
                var ready = function(fn) {
                    if (typeof fn !== 'function') return;
                    if (document.readyState === 'complete') {
                        fn();
                    }
                    document.addEventListener('interactive', fn, false);
                };
                ready(function() {
                    if (
                        window.location.href.split('content-only').length < 2
                    ) {
                        window.location.replace(window.location.href + '?content-only');
                    } else {
                        var links = document.getElementsByTagName('a');
                        Object.keys(links).forEach(function(e) {
                            if (
                                links[e].href &&
                                links[e].href.split('hsl.fi').length >= 2 &&
                                links[e].href.split('drupal_login').length < 2 &&
                                links[e].href.split('content-only').length < 2
                            ) {
                                links[e].href = links[e].href + '?content-only';
                            }
                        });
                    }
                });
            ` : `
            window.onload = () => {
                if (!window.location.href.includes('content-only')) {
                    window.location.replace(window.location.href + '?content-only');
                } else {
                    var links = document.getElementsByTagName('a');
                    Object.keys(links).forEach((e) => {
                        if (
                            !links[e].href.includes('drupal_login') &&
                            links[e].href.includes('hsl.fi') &&
                            !links[e].href.includes('content-only')
                        ) {
                            links[e].href = links[e].href + '?content-only';
                        }
                    });
                }
            };
            `;
        }

        /*
        * Add back/forward buttons inside the WebView if showBackForwardButtons is set
        */
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

        /*
        * We need to use this until this PR is merged https://github.com/facebook/react-native/pull/12807
        * to enable input type file in Webview
        * TODO: AndroidWebView isn't working with RN 0.44...
        * There was AndroidWebView "react-native-webview-file-upload-android" to enable
        * file upload input in SURVEY_URL WebView but it's not working anymore...
        */
        const webView = (uri === SURVEY_URL && Platform.OS === 'android') ?
        (<WebView
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
        />) :
        (<WebView
            ref={(c) => { this.webview = c; }}
            domStorageEnabled
            javaScriptEnabled
            style={[styles.webView, {marginTop: webViewMarginTop}]}
            source={{uri}}
            onLoadEnd={this.onLoadEnd}
            onMessage={
                onMessageEnabled ?
                    this.onMessage :
                    null
            } // there's issuses with onMessage
            onNavigationStateChange={this.onNavigationStateChange}
            scrollEnabled={scrollEnabled}
            injectedJavaScript={inlineJS}
        />);
        return (
            <View
                style={[styles.container, {
                    backgroundColor: containerBackgroundColor,
                    height: containerHeight,
                }]}
            >
                <ActivityIndicator
                    animating={loading}
                    size="large"
                    style={[styles.centering, styles.spinner, loading ? null : styles.hidden]}
                />
                {backButton}
                {forwardButton}
                {webView}
            </View>
        );
    }
}

CustomWebView.propTypes = {
    autoHeightEnabled: PropTypes.bool,
    onMessageEnabled: PropTypes.bool,
    // removeCityBikeData: PropTypes.func.isRequired,
    scrollEnabled: PropTypes.bool,
    session: PropTypes.oneOfType([
        PropTypes.instanceOf(Object),
        PropTypes.instanceOf(Immutable.Map)],
    ).isRequired,
    setSession: PropTypes.func.isRequired,
    showBackForwardButtons: PropTypes.bool,
    uri: PropTypes.string.isRequired,
};

CustomWebView.defaultProps = {
    autoHeightEnabled: false,
    onMessageEnabled: false,
    scrollEnabled: true,
    showBackForwardButtons: false,
};

function mapStateToProps(state) {
    return {
        session: state.session,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        removeCityBikeData: () => dispatch(removeCityBikeData()),
        setSession: session => dispatch(setSession(session)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomWebView);
