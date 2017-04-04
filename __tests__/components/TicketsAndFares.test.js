// https://facebook.github.io/jest/blog/2016/07/27/jest-14.html
import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import TicketsAndFares from '../../components/TicketsAndFares';

// https://github.com/facebook/react-native/issues/12440#issuecomment-282184173
jest.unmock('ScrollView');

it('renders correctly', () => {
    const tree = renderer.create(<TicketsAndFares />).toJSON();
    expect(tree).toMatchSnapshot();
});
