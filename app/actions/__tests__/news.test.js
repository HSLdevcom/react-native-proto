// TODO: the rest of the tests
import {
    FETCHING_NEWS,
    FETCHING_NEWS_DONE,
    FETCHING_NEWS_ERROR,
    HIDE_SINGLE_NEWS,
    SHOW_SINGLE_NEWS,
    fetchingNews,
    fetchNewsDone,
    fetchNewsError,
    // fetchNewsData,
    hideSingleNews,
    showSingleNews,
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
    describe('FETCHING_NEWS_DONE Action', () => {
        it('has a type of FETCHING_NEWS_DONE', () => {
            const data = {};
            const expected = {
                type: FETCHING_NEWS_DONE,
                data,
            };
            expect(fetchNewsDone(data)).toEqual(expected);
        });
    });
    describe('FETCHING_NEWS_ERROR Action', () => {
        it('has a type of FETCHING_NEWS_ERROR', () => {
            const error = {};
            const expected = {
                type: FETCHING_NEWS_ERROR,
                error,
            };
            expect(fetchNewsError(error)).toEqual(expected);
        });
    });
    describe('HIDE_SINGLE_NEWS Action', () => {
        it('has a type of HIDE_SINGLE_NEWS', () => {
            const expected = {
                type: HIDE_SINGLE_NEWS,
            };
            expect(hideSingleNews()).toEqual(expected);
        });
    });
    describe('SHOW_SINGLE_NEWS Action', () => {
        it('has a type of SHOW_SINGLE_NEWS', () => {
            const nid = '1';
            const expected = {
                type: SHOW_SINGLE_NEWS,
                nid,
            };
            expect(showSingleNews(nid)).toEqual(expected);
        });
    });
});
