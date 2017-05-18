/**
 * TicketsAndFares component
 * @flow
 */

import React from 'react';
import CustomWebView from './CustomWebView';

function TicketsAndFares() {
    return <CustomWebView autoHeightEnabled onMessageEnabled scrollEnabled={false} uri="https://www.hsl.fi/liput-ja-hinnat?content-only" />;
}

export default TicketsAndFares;
