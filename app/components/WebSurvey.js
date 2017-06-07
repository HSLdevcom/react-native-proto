/**
 * WebSurveys component
 * @flow
 */

import React from 'react';
import CustomWebView from './CustomWebView';

export const SURVEY_URL = 'https://jola.louhin.com/surveys/fill?id=404207&accessKey=3441f854-5502-456b-ade7-d457eba2c851&answers[%27linja%27]=8';

function WebSurveys() {
    return <CustomWebView uri={SURVEY_URL} />;
}

export default WebSurveys;
