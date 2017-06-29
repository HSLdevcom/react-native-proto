/**
 * Main component
 * @flow
 */

import React, {Component} from 'react';
import CustomWebView from './CustomWebView';

export const REITTIOPAS_MOCK_URL = 'https://reittiopas.fi/?mock';
export const REITTIOPAS_URL = 'https://reittiopas.fi';

class Main extends Component { // eslint-disable-line react/prefer-stateless-function

    // TODO: add options view and define there if user wants to use this with "?mock"?
    render() {
        return (
            <CustomWebView uri={REITTIOPAS_MOCK_URL} />
        );
    }
}

export default Main;
