import {
    SET_COOKIE,
    REMOVE_COOKIE,
    setCookie,
    removeCookie,
} from '../cookies';

describe('Cookie actions', () => {
    describe('SET_COOKIE Action', () => {
        it('has a type of SET_COOKIE', () => {
            const cookie = false;
            const expected = {
                type: SET_COOKIE,
                cookie,
            };
            expect(setCookie(cookie)).toEqual(expected);
        });
    });
    describe('REMOVE_COOKIE Action', () => {
        it('has a type of REMOVE_COOKIE', () => {
            const expected = {
                type: REMOVE_COOKIE,
            };
            expect(removeCookie()).toEqual(expected);
        });
    });
});
