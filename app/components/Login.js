/**
 * Login component
 * @flow
 */

import React from 'react';
import CustomWebView from './CustomWebView';

export const HSL_LOGIN_URL = 'https://login.hsl.fi/';
export const HSL_LOGOUT_URL = 'https://login.hsl.fi/user/slo';
function Login({loggedIn}) {
    return <CustomWebView uri={loggedIn ? HSL_LOGOUT_URL : HSL_LOGIN_URL} />;
}

Login.propTypes = {
    loggedIn: React.PropTypes.bool.isRequired,
};

export default Login;
