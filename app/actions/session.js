export const SET_SESSION = 'HSLProto/app/SET_SESSION';
export const REMOVE_SESSION = 'HSLProto/app/REMOVE_SESSION';

/**
* Set session
* @param  {object} session
* @return {object} An action object with a type of SET_SESSION
*/
export function setSession(session) {
    return {type: SET_SESSION, session};
}

/**
* Remove session
* @return {object} An action object with a type REMOVE_SESSION
*/
export function removeSession() {
    return {type: REMOVE_SESSION};
}
