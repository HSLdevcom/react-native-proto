// https://facebook.github.io/jest/blog/2016/07/27/jest-14.html
import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import MobileTicket from '../../app/components/MobileTicket';

it('renders correctly', () => {
    const tree = renderer.create(<MobileTicket />).toJSON();
    expect(tree).toMatchSnapshot();
});
