/**
 * CustomWebView
 * @flow
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import Cookie from 'react-native-cookie';
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
import {
    removeCookie,
    setCookie,
} from '../actions/cookies';
import {
    setSession,
    removeSession,
} from '../actions/session';
import colors from '../colors';
import {REITTIOPAS_URL, REITTIOPAS_MOCK_URL} from './Main';
import {CITYBIKE_URL} from './CityBikes';
import {HSL_LOGIN_URL, HSL_LOGOUT_URL} from './Login';

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
        overrideUri: false,
        currentUrl: false,
    };

    componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);
        const {uri} = this.props;
        // TODO: do we want to get the position on every mount or keep it in store with some logic?
        // TODO: remove process.env check when https://github.com/facebook/react-native/pull/13442 is in RN
        if (uri.startsWith('https://reittiopas') && process.env.NODE_ENV !== 'test') {
            // At the moment WebView inlineJS is used to get the current position
            // via navigator.geolocation.watchPosition
            // Get current position and use it in reittiopas
            // this.getLocation();
        } else if (uri === HSL_LOGIN_URL) {
            // If we come to login-view let's just check are we logged in or not
            this.maybeLoginOrLogout();
        }
    }

    componentDidUpdate() {}

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    onMessage = (event) => {
        console.log('message: ', event.nativeEvent.data);
    }
    onLoadEnd = () => {
        this.setState({loading: false});
    }
    onNavigationStateChange = (navState) => {
        const {url} = navState;
        // console.log(navState);
        // TODO: pass an id to CustomWebView props and add the id and webview url to (redux) store
        // so we can open the last used page when component is rendered
        this.setState({currentUrl: url});
        // If next url isn't hsl.fi / reittiopas.fi spesific or http:// -> open it in phone browser
        if (
            (url.startsWith('http') && !url.includes('hsl.fi') && !url.includes('reittiopas.fi')) ||
            url.startsWith('http://')
        ) {
            this.webview.stopLoading();
            // force update the view in case webview didn't stopLoading so iOS don't try to load any http://-url
            this.forceUpdate();
            Linking.openURL(url).catch(err => console.log(err));
        } else if (
            /* Handle logout flow
            * 1) Check if we are on a page whose url includes SingleLogoutService / "saml/logout"
            * 2) Get page cookies
            * 3) Check if cookies includes SSESS...-cookie
            * 4) If there's no SSESS-cookie, removeCookie and resetSession
            * TODO: there really should be better solution for this
            */
            url.startsWith('https://login.hsl.fi/simplesaml/saml2/idp/SingleLogoutService.php') ||
            url.startsWith('https://www.hsl.fi/saml/logout') ||
            url === 'https://login.hsl.fi/user/slo'
        ) {
            if (url.startsWith('https://www.hsl.fi/saml/logout')) {
                this.maybeLoginOrLogout(false, true);
            } else {
                this.maybeLoginOrLogout();
            }
        } else if (
            /* Handle login flow
            * 1) Check if we are on a page whose url includes (login.)hsl.fi
            * and navigationType is formsubmit / title 'POST data'
            * 2) Get page cookies
            * 3) Check if cookies includes SSESS...- and HSLSAMLSessionID-cookie
            * 4) If cookies exists, setCookie and setSession
            * TODO: there really should be better solution for this
            */
            (
                // iOS version
                navState.navigationType === 'formsubmit' &&
                (
                    url.startsWith('https://www.hsl.fi') ||
                    url.startsWith('https://login.hsl.fi')
                )
            ) ||
            // Android version
            (
                Platform.OS === 'android' &&
                (
                    (
                        navState.navigationType !== 'click' &&
                        url.startsWith('https://login.hsl.fi/user')
                    )
                    ||
                    (
                        navState.title === 'POST data' &&
                        url.startsWith('https://www.hsl.fi')
                    )
                )
            )
        ) {
            this.maybeLoginOrLogout(true);
        }
        this.setState({
            backButtonEnabled: navState.canGoBack,
            forwardButtonEnabled: navState.canGoForward,
        });
    }

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

    handleAppStateChange = (nextAppState) => {
        /* If app goes background reload webview to stop possible YouTube-video playback
        * in case we are in hsl.fi and OS is android
        * iOS pauses playback automatically
        */
        if (
            nextAppState === 'background' &&
            Platform.OS === 'android' &&
            this.state.currentUrl.includes('hsl.fi')
        ) {
            this.webview.reload();
        }
    }

    maybeLoginOrLogout = (probablyLogin = false, forceLogout = false) => {
        const {cookies, session, uri} = this.props;
        Cookie.get(uri)
        .then((cookie) => {
            if (cookie) {
                return this.checkSessionCookie(cookie);
            }
            return {sessionCookieSet: false};
        })
        .then((result) => {
            if (
                (!probablyLogin && !result.sessionCookieSet && cookies.get('cookie')) ||
                (!probablyLogin && forceLogout)
            ) {
                Promise.resolve(this.props.removeCookie())
                .then(() => this.props.resetSession())
                .then(() => {
                    if (uri === HSL_LOGOUT_URL) {
                        // Open menu after logout
                        Actions.menuTab();
                    }
                })
                .catch(err => console.log(err));
            } else if (
                // TODO: if you don't do SSO-login directly via login.hsl.fi (Kirjaudu sisään-view)
                // there isn't 'HSLSAMLSessionID'-cookie... and this logic doesn't work
                // use case can be for example hsl.fi/citybike -> login -> redirect
                // BUT that doesn't happen every time...
                probablyLogin &&
                result.sessionCookieSet &&
                !session.get('data') &&
                 // result.cookie.HSLSAMLSessionID && // do not check HSLSAMLSessionID at this time
                (
                    !cookies.get('cookie') ||
                    !cookies.get('cookie')[HSLSAMLSessionID]
                )
            ) {
                Promise.resolve(this.props.setCookie(result.cookie))
                .then(() => this.props.setSession({
                    loggedIn: true,
                    [HSLSAMLSessionID]: result.cookie.HSLSAMLSessionID || 'loggedInViaCitybikes',
                }))
                .then(() => {
                    if (uri === HSL_LOGIN_URL) {
                        // Open menu after logout
                        Actions.menuTab();
                    }
                })
                .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
    }
    checkSessionCookie = (cookie) => {
        let sessionCookieSet = false;
        Object.keys(cookie).forEach((key) => {
            // Well this isn't bulletproof but there seems to be a cookie like
            // SSESS... when user is logged in
            if (key.startsWith('SSESS')) {
                sessionCookieSet = true;
            }
        });
        return {cookie, sessionCookieSet};
    }

    handleCookies = (currentCookie) => {
        console.log('currentCookie: ', currentCookie);
        // const {cookies, uri} = this.props;
        // if (
        //     (
        //         cookies.get('cookie')[HSLSAMLSessionID] &&
        //         !currentCookie.HSLSAMLSessionID
        //     )
        //     ||
        //     (
        //         cookies.get('cookie')[HSLSAMLSessionID] &&
        //         cookies.get('cookie')[HSLSAMLSessionID] !== currentCookie.HSLSAMLSessionID
        //     )
        // ) {
        //     console.log('set cookies to webview');
        //     Object.keys(cookies.get('cookie')).forEach((item) => {
        //         console.log(item, cookies.get('cookie')[item]);
        //         Cookie.set(uri, item, cookies.get('cookie')[item])
        //         .then(() => console.log(`${item} cookie set success`))
        //         .catch(err => console.log(err));
        //     });
        // }
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
        const uri = overrideUri || this.props.uri;
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
        ` : '';

        if (uri === REITTIOPAS_MOCK_URL) {
            // Use inlineJS to set mock position
            inlineJS += `
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
            /*
            * Try to click the login-button in hsl.fi/citybike to enable "automatic login"
            * Android needs a bit different logic than iOS...
            * https://stackoverflow.com/a/37332447/4047536
            */
            inlineJS += Platform.OS === 'android' ? `
                var ready = function(fn) {
                    if (typeof fn !== 'function') return;
                    if (document.readyState === 'complete') {
                        return fn();
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
                    }
                };
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
    resetSession: React.PropTypes.func.isRequired,
    cookies: React.PropTypes.oneOfType([
        React.PropTypes.instanceOf(Object),
        React.PropTypes.instanceOf(Immutable.Map)],
    ).isRequired,
    onMessageEnabled: React.PropTypes.bool,
    removeCookie: React.PropTypes.func.isRequired,
    scrollEnabled: React.PropTypes.bool,
    session: React.PropTypes.oneOfType([
        React.PropTypes.instanceOf(Object),
        React.PropTypes.instanceOf(Immutable.Map)],
    ).isRequired,
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
        session: state.session,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        removeCookie: () => dispatch(removeCookie()),
        resetSession: () => dispatch(removeSession()),
        setCookie: cookie => dispatch(setCookie(cookie)),
        setSession: session => dispatch(setSession(session)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomWebView);
