/**
 * Login component
 * @flow
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    ActivityIndicator,
    AppState,
    Dimensions,
    Linking,
    Platform,
    StyleSheet,
    View,
    WebView,
} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import Cookie from 'react-native-cookie';
import Immutable from 'immutable';
import {
    removeCookie,
    setCookie,
} from '../actions/cookies';
import {
    setSession,
    removeSession,
} from '../actions/session';
import colors from '../colors';
import {whitelistUrls} from './CustomWebView';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const HSLSAMLSessionID = 'HSLSAMLSessionID';

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
        height: screenHeight,
        justifyContent: 'center',
        marginBottom: 50,
    },
    hidden: {
        height: 0,
        zIndex: 0,
    },
    spinner: {
        height: 80,
        left: parseInt((screenWidth / 2) - 40, 10), // centering spinner...
        position: 'absolute',
        width: 80,
        zIndex: 2,
    },
    webView: {
        marginTop: (Platform.OS === 'ios') ? 20 : 0,
    },
});

export const HSL_LOGIN_URL = 'https://login.hsl.fi/';
export const HSL_LOGOUT_URL = 'https://login.hsl.fi/user/slo';

class Login extends Component {
    state = {
        loading: true,
    };
    componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);
        this.maybeLoginOrLogout();
    }
    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }
    onLoadEnd = () => this.setState({loading: false});
    onError = e => console.log(e);
    onNavigationStateChange = (navState) => {
        const {session} = this.props;
        const {url} = navState;
        // console.log(navState);
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
            url.startsWith('https://www.hsl.fi/saml/logout') ||
            url === 'https://login.hsl.fi/user/slo' ||
            url === 'https://login.hsl.fi/user/login?destination=user/slo' ||
            url.includes('login.hsl.fi/simplesaml/module.php/core/idp/resumelogout.php')
        ) {
            if (
                url.startsWith('https://www.hsl.fi/saml/logout') ||
                url === 'https://login.hsl.fi/user/login?destination=user/slo' ||
                url.includes('login.hsl.fi/simplesaml/module.php/core/idp/resumelogout.php')
            ) {
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
                url.includes('https://login.hsl.fi/user') &&
                !session.get('data').loggedIn
        ) {
            this.maybeLoginOrLogout(true);
        }
    }
    maybeLoginOrLogout = (probablyLogin = false, forceLogout = false) => {
        const {cookies, session} = this.props;
        const uri = session.get('data').loggedIn ? HSL_LOGOUT_URL : HSL_LOGIN_URL;
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
                .then(() => Cookie.clear())
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
                !session.get('data').loggedIn &&
                result.cookie.HSLSAMLSessionID
            ) {
                Promise.resolve(this.props.setCookie(result.cookie))
                .then(() => {
                    const newSession = session.get('data') ? Object.assign({}, session.get('data'), {
                        loggedIn: true,
                        [HSLSAMLSessionID]: result.cookie.HSLSAMLSessionID,
                    }) : {
                        loggedIn: true,
                        [HSLSAMLSessionID]: result.cookie.HSLSAMLSessionID,
                    };
                    return this.props.setSession(newSession);
                })
                .then((newSession) => {
                    if (newSession.session.redirect) {
                        Actions.cityBike();
                    } else if (uri === HSL_LOGIN_URL) {
                        // Open menu after login
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
    render() {
        const {session} = this.props;
        const {
            loading,
        } = this.state;
        const uri = session.get('data').loggedIn ? HSL_LOGOUT_URL : HSL_LOGIN_URL;
        return (
            <View
                style={[styles.container]}
            >
                <ActivityIndicator
                    animating={loading}
                    size="large"
                    style={[styles.centering, styles.spinner, loading ? null : styles.hidden]}
                />
                <WebView
                    ref={(c) => { this.webview = c; }}
                    domStorageEnabled
                    javaScriptEnabled
                    style={[styles.webView]}
                    source={{uri}}
                    onLoadEnd={this.onLoadEnd}
                    onNavigationStateChange={this.onNavigationStateChange}
                />
            </View>
        );
    }
}

Login.propTypes = {
    cookies: PropTypes.oneOfType([
        PropTypes.instanceOf(Object),
        PropTypes.instanceOf(Immutable.Map)],
    ).isRequired,
    removeCookie: PropTypes.func.isRequired,
    resetSession: PropTypes.func.isRequired,
    session: PropTypes.oneOfType([
        PropTypes.instanceOf(Object),
        PropTypes.instanceOf(Immutable.Map)],
    ).isRequired,
    setCookie: PropTypes.func.isRequired,
    setSession: PropTypes.func.isRequired,
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
)(Login);
