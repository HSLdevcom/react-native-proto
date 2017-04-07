/*
*
* News actions
*
*/
import {getNewsData} from '../utils/api';

export const FETCHING_NEWS = 'HSLReactNativeProto/app/FETCHING_NEWS';
export const FETCHING_NEWS_DONE = 'HSLReactNativeProto/app/FETCHING_NEWS_DONE';
export const FETCHING_NEWS_ERROR = 'HSLReactNativeProto/app/FETCHING_NEWS_ERROR';

/**
* Fetching news
*
* @return {object} An action object with a type of FETCHING_NEWS
*/
export function fetchingNews() {
    return {type: FETCHING_NEWS};
}

/**
* News data load success
* @param  {object} data news data
*
* @return {object} An action object with a type of FETCHING_NEWS_DONE
*/

export function fetchNewsDone(data) {
    return {
        type: FETCHING_NEWS_DONE,
        data,
    };
}

/**
* News data load error
* @param  {object} error
*
* @return {object} An action object with a type of FETCHING_NEWS_ERROR
*/
export function fetchNewsError(error) {
    return {
        type: FETCHING_NEWS_ERROR,
        error,
    };
}

/**
* Load data from API
* getNewsData() uses just static temporary query at the moment
* for some reason limit is not working without offset and offset can not be 0...
*/
export function fetchNewsData() {
    return (dispatch) => {
        dispatch(fetchingNews());
        getNewsData(`nodeQuery(limit: 10, offset: 1, langcode: "fi", type: "news"){
            title
            renderedOutput
            created
            nid
            type {
                targetId
            }
        }`)
        .then((result) => {
            // TODO: some error handling maybe?
            dispatch(fetchNewsDone(result.data.nodeQuery));
        })
        .catch((err) => {
            // TODO: show error in app
            console.error('err:', err);
            fetchNewsError(err);
        });
    };
}
