/*
*
* Reittiopas Download actions
*
*/

export const FETCHING_REITTIOPAS = 'HSLProto/app/FETCHING_REITTIOPAS';
export const FETCHING_REITTIOPAS_DONE = 'HSLProto/app/FETCHING_REITTIOPAS_DONE';
export const FETCHING_REITTIOPAS_ERROR = 'HSLProto/app/FETCHING_REITTIOPAS_ERROR';

/**
* Fetching reittiopas
*
* @return {object} An action object with a type of FETCHING_REITTIOPAS
*/
export function fetchingReittiopas() {
    return {type: FETCHING_REITTIOPAS};
}

/**
* Reittiopas data load success
* @param  {integer} timestamp reittiopas data loaded time
*
* @return {object} An action object with a type of FETCHING_REITTIOPAS_DONE
*/

export function fetchReittiopasDone(timestamp) {
    return {
        type: FETCHING_REITTIOPAS_DONE,
        timestamp,
    };
}

/**
* Reittiopas data load error
* @param  {object} error
*
* @return {object} An action object with a type of FETCHING_REITTIOPAS_ERROR
*/
export function fetchReittiopasError(error) {
    return {
        type: FETCHING_REITTIOPAS_ERROR,
        error,
    };
}
