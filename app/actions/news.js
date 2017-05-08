/*
*
* News actions
*
*/
import {getNewsData} from '../utils/api';

export const FETCHING_NEWS = 'HSLProto/app/FETCHING_NEWS';
export const FETCHING_NEWS_DONE = 'HSLProto/app/FETCHING_NEWS_DONE';
export const FETCHING_NEWS_ERROR = 'HSLProto/app/FETCHING_NEWS_ERROR';
export const HIDE_SINGLE_NEWS = 'HSLProto/app/HIDE_SINGLE_NEWS';
export const SHOW_SINGLE_NEWS = 'HSLProto/app/SHOW_SINGLE_NEWS';

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
        getNewsData(`nodeQuery(type: "news", langcode: "fi") {
            ... on EntityNodeNews {
              title
              body{
                value
              }
              ingress{
                value
              }
              created
              nid
              uuid
              vid
              images {
                targetId
                entity {
                  renderedOutput
                  fid
                  uuid
                  filename
                  uri
                  filemime
                }
              }
            }
          }`
        )
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

/**
* Hide Single News
*
* @return {object} An action object with a type of HIDE_SINGLE_NEWS
*/

export function hideSingleNews() {
    return {
        type: HIDE_SINGLE_NEWS,
    };
}

/**
* Show Single News
* @param  {int} nid
*
* @return {object} An action object with a type of SHOW_SINGLE_NEWS
*/

export function showSingleNews(nid) {
    return {
        type: SHOW_SINGLE_NEWS,
        nid,
    };
}
