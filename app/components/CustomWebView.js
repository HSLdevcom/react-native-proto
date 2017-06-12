/**
 * CustomWebView
 * @flow
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Cookie from 'react-native-cookie';
import Immutable from 'immutable';
// import AndroidWebView from 'react-native-webview-file-upload-android';
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
import {removeCityBikeData} from '../actions/cityBike';
import {
    setSession,
    removeSession,
} from '../actions/session';
import colors from '../colors';
import {/*REITTIOPAS_URL,*/REITTIOPAS_MOCK_URL} from './Main';
import {CITYBIKE_URL} from './CityBikes';
import {HSL_LOGIN_URL} from './Login';
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
    webView: {
        marginTop: (Platform.OS === 'ios') ? 63 : 53,
    },
});

const HSLSAMLSessionID = 'HSLSAMLSessionID';
const whitelistUrls = ['hsl.fi', 'reittiopas.fi', 'jola.louhin'];

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
        // Get current position and use it in reittiopas
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
            }, (error) => {
                console.log('GeoLocation error: ', error);
                // Location request timed out
                if (error.code === 3 && uri === REITTIOPAS_MOCK_URL) {
                    // TODO: figure out if this is better solution than showing
                    // the default ?mock-position if we can't get user position
                    // via navigator.geolocation
                    // this.setState({
                    //     overrideUri: REITTIOPAS_URL,
                    // });
                }
            }, {
                enableHighAccuracy: Platform.OS === 'ios', // true seems to cause timeout in Android...
                timeout: 10000,
                maximumAge: 1000,
            }
            );
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
    onLoadEnd = () => this.setState({loading: false});
    onError = e => console.log(e);

    onNavigationStateChange = (navState) => {
        const {url} = navState;
        // TODO: pass an id to CustomWebView props and add the id and webview url to (redux) store
        // so we can open the last used page when component is rendered
        // console.log(navState);
        this.setState({currentUrl: url});
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
        } else if (
            /* Handle logout flow
            * 1) Check if we are on a page whose url includes SingleLogoutService / "saml/logout"
            * 2) Get page cookies
            * 3) Check if cookies includes SSESS...-cookie
            * 4) If there's no SSESS-cookie, removeCookie and resetSession
            * TODO: there really should be better solution for this
            */
            url.startsWith('https://login.hsl.fi/simplesaml/saml2/idp/SingleLogoutService.php') ||
            url.startsWith('https://www.hsl.fi/saml/logout')
        ) {
            this.maybeLoginOrLogout();
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
            (
                // Android version
                url.startsWith('https://login.hsl.fi/user') ||
                (
                    navState.title === 'POST data' &&
                    url.startsWith('https://www.hsl.fi')
                )
            )
        ) {
            this.maybeLoginOrLogout();
        }
        this.setState({
            backButtonEnabled: navState.canGoBack,
            forwardButtonEnabled: navState.canGoForward,
        });
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

    maybeLoginOrLogout = () => {
        const {cookies, uri} = this.props;
        Cookie.get(uri)
        .then((cookie) => {
            if (cookie) {
                return this.checkSessionCookie(cookie);
            }
            return {sessionCookieSet: false};
        })
        .then((result) => {
            if (!result.sessionCookieSet && cookies.get('cookie')) {
                this.props.removeCookie();
                this.props.resetSession();
                this.props.removeCityBikeData();
            } else if (
                // TODO: if you don't do SSO-login directly via login.hsl.fi (Kirjaudu sisään-view)
                // there isn't 'HSLSAMLSessionID'-cookie... and this logic doesn't work
                // use case can be for example hsl.fi/citybike -> login -> redirect
                // BUT that doesn't happen every time...
                result.sessionCookieSet &&
                // result.cookie.HSLSAMLSessionID && // do not check HSLSAMLSessionID at this time
                (
                    !cookies.get('cookie') ||
                    !cookies.get('cookie')[HSLSAMLSessionID]
                )
            ) {
                this.props.setCookie(result.cookie);
                this.props.setSession({
                    loggedIn: true,
                    [HSLSAMLSessionID]: result.cookie.HSLSAMLSessionID || 'loggedInViaCitybikes',
                });
            }
        })
        .catch(err => console.error(err));
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
            position,
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
        ` : `
        `;
        if (position.lat && position.long) {
            // If we have lat and long use mock
            inlineJS += `
                setTimeout(function () {
                    if (window.mock) {
                        window.mock.geolocation.setCurrentPosition(${position.lat}, ${position.long});
                    }
                }, 200);
            `;
        } else if (uri === CITYBIKE_URL && session.get('data') && session.get('data').loggedIn) {
            inlineJS += `
                // Try to click the login-button in hsl.fi/citybike to enable "automatic login"
                window.onload = function() {
                    const loginContainer = document.getElementsByClassName('saml-login-link');
                    if (
                        loginContainer.length &&
                        loginContainer[0].children.length &&
                        loginContainer[0].children[0].href &&
                        loginContainer[0].children[0].href.includes('login')
                    ) {
                        document.getElementsByClassName('saml-login-link')[0].children[0].click();
                    }
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

        // we need to use this until this PR is merged https://github.com/facebook/react-native/pull/12807
        // to enable input type file in Webview
        // TODO: AndroidWebView isn't working with RN 0.44...
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
                style={[styles.container, {height: containerHeight}]}
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
    resetSession: PropTypes.func.isRequired,
    cookies: PropTypes.oneOfType([
        PropTypes.instanceOf(Object),
        PropTypes.instanceOf(Immutable.Map)],
    ).isRequired,
    onMessageEnabled: PropTypes.bool,
    removeCityBikeData: PropTypes.func.isRequired,
    removeCookie: PropTypes.func.isRequired,
    scrollEnabled: PropTypes.bool,
    session: PropTypes.oneOfType([
        PropTypes.instanceOf(Object),
        PropTypes.instanceOf(Immutable.Map)],
    ).isRequired,
    setCookie: PropTypes.func.isRequired,
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
        cookies: state.cookies,
        session: state.session,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        removeCookie: () => dispatch(removeCookie()),
        removeCityBikeData: () => dispatch(removeCityBikeData()),
        resetSession: () => dispatch(removeSession()),
        setCookie: cookie => dispatch(setCookie(cookie)),
        setSession: session => dispatch(setSession(session)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomWebView);
