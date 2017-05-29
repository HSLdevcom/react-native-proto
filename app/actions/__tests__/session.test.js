import {
    SET_SESSION,
    REMOVE_SESSION,
    setSession,
    removeSession,
} from '../session';

describe('Session actions', () => {
    describe('SET_SESSION Action', () => {
        it('has a type of SET_SESSION', () => {
            const session = false;
            const expected = {
                type: SET_SESSION,
                session,
            };
            expect(setSession(session)).toEqual(expected);
        });
    });
    describe('REMOVE_SESSION Action', () => {
        it('has a type of REMOVE_SESSION', () => {
            const expected = {
                type: REMOVE_SESSION,
            };
            expect(removeSession()).toEqual(expected);
        });
    });
});
