// https://facebook.github.io/jest/blog/2016/07/27/jest-14.html
import 'react-native';
import React from 'react';
import {fromJS} from 'immutable';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import NewsFeedItem from '../../app/components/NewsFeedItem';

it('renders correctly', () => {
    const tree = renderer.create(
        <NewsFeedItem showSingle={jest.fn()} data={fromJS({})} />).toJSON();
    expect(tree).toMatchSnapshot();
});
