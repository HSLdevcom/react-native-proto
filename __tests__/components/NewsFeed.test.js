// https://facebook.github.io/jest/blog/2016/07/27/jest-14.html
import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import NewsFeed from '../../app/components/NewsFeed';

it('renders correctly', () => {
    const tree = renderer.create(<NewsFeed />).toJSON();
    expect(tree).toMatchSnapshot();
});
