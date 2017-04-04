/**
 * News component
 * @flow
 */

import React from 'react';
import CustomWebView from './CustomWebView';

function News() {
    return <CustomWebView uri="https://www.hsl.fi/ajankohtaista?qt-archives=2#qt-archives" />;
}

export default News;
