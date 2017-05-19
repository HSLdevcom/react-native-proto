export const SET_COOKIE = 'HSLProto/app/SET_COOKIE';
export const REMOVE_COOKIE = 'HSLProto/app/REMOVE_COOKIE';

/**
* Set cookie
* @param  {string} cookie
* @return {object} An action object with a type of SET_COOKIE
*/
export function setCookie(cookie) {
    return {type: SET_COOKIE, cookie};
}

/**
* Remove cookie
* @return {object} An action object with a type REMOVE_COOKIE SET_COOKIE
*/
export function removeCookie() {
    return {type: REMOVE_COOKIE};
}
