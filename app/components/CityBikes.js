/**
 * CityBikes component
 * @flow
 */

import React from 'react';
import CustomWebView from './CustomWebView';

export const CITYBIKE_URL = 'https://www.hsl.fi/citybike';

function CityBikes() {
    return <CustomWebView uri={CITYBIKE_URL} />;
}

export default CityBikes;
