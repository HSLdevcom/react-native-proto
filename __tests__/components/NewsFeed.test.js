// https://facebook.github.io/jest/blog/2016/07/27/jest-14.html
import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import {fromJS} from 'immutable';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import NewsFeed from '../../app/components/NewsFeed';

const mockStore = configureStore();
const news = fromJS({
    data: [],
});

it('renders correctly', () => {
    const tree = renderer.create(
        <NewsFeed
            store={mockStore({
                news,
                fetchNewsData: jest.fn(),
                hideSingleNews: jest.fn(),
                showSingleNews: jest.fn(),
            })}
        />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
