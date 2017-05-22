// TODO: the rest of the tests
import {
    FETCHING_NEWS,
    FETCHING_NEWS_DONE,
    // FETCHING_NEWS_ERROR,
    // HIDE_SINGLE_NEWS,
    // SHOW_SINGLE_NEWS,
    fetchingNews,
    fetchNewsDone,
    // fetchNewsError,
    // fetchNewsData,
    // hideSingleNews,
    // showSingleNews,
} from '../news';

describe('News actions', () => {
    describe('FETCHING_NEWS Action', () => {
        it('has a type of FETCHING_NEWS', () => {
            const expected = {
                type: FETCHING_NEWS,
            };
            expect(fetchingNews()).toEqual(expected);
        });
    });
    describe('REMOVE_COOKIE Action', () => {
        it('has a type of REMOVE_COOKIE', () => {
            const data = {};
            const expected = {
                type: FETCHING_NEWS_DONE,
                data,
            };
            expect(fetchNewsDone(data)).toEqual(expected);
        });
    });
});
