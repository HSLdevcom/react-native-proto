/**
 * Login component
 * @flow
 */

import React from 'react';
import CustomWebView from './CustomWebView';

function Login() {
    return <CustomWebView uri="https://login.hsl.fi/" />;
}

Login.propTypes = {
    loggedIn: React.PropTypes.bool.isRequired,
};

export default Login;
