/* global fetch*/
import base64 from 'base-64';
import {
    HSLGraphQLAuthUsername,
    HSLGraphQLAuthPassword,
    HSLGraphQLAuthURL,
} from '../../config';


/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
    return response.json();
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */

export default function apiRequest(url, options) {
    const mergedOptions = Object.assign({}, {
        mode: 'cors',
    }, options);
    // eslint-disable-next-line compat/compat
    return fetch(url, mergedOptions).then(checkStatus).then(parseJSON);
}

const auth = `${HSLGraphQLAuthUsername}:${HSLGraphQLAuthPassword}`;
const headers = new Headers();
headers.append('Authorization', `Basic ${base64.encode(auth)}`);

/**
 * News requests from HSLGraphQLAuthURL
 *
 * @param  {string} q       The GraphQL query we want to request
 *
 * @return {object}           The response data from apiRequest
 */
export const getNewsData = q => apiRequest(`${HSLGraphQLAuthURL}?query={${q}}`, {headers});
