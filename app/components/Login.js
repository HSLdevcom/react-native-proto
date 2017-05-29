/**
 * Login component
 * @flow
 */

import React from 'react';
import CustomWebView from './CustomWebView';

export const HSL_LOGIN_URL = 'https://login.hsl.fi/';
function Login() {
    return <CustomWebView uri={HSL_LOGIN_URL} />;
}

Login.propTypes = {
    loggedIn: React.PropTypes.bool.isRequired,
};

export default Login;
