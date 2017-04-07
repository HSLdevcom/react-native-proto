/* global fetch*/
import base64 from 'base-64';
import news from '../../testData.json';
import {
    HSLGraphQLAuthUsername,
    HSLGraphQLAuthPassword,
    HSLGraphQLAuthURL,
} from '../../config';

const auth = `${HSLGraphQLAuthUsername}:${HSLGraphQLAuthPassword}`;
const headers = new Headers();
headers.append('Authorization', `Basic ${base64.encode(auth)}`);

const getNewsData = q =>
    // eslint-disable-next-line compat/compat
    fetch(`${HSLGraphQLAuthURL}?query={${q}}`, {
        headers,
    })
    .then((response) => {
        if (response.status !== 200) {
            throw response;
        }
        return response.json();
    })
    .catch((e) => {
        console.error(e);
        return new Error('Fetch failed');
    });

export {getNewsData};

export default() => new Promise(resolve => setTimeout(() => resolve(news.data.nodeQuery), 500));
