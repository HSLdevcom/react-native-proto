// https://facebook.github.io/jest/blog/2016/07/27/jest-14.html
import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import {fromJS} from 'immutable';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import CustomWebView from '../../app/components/CustomWebView';

const mockStore = configureStore();
// https://github.com/facebook/react-native/issues/12440#issuecomment-282184173
jest.unmock('ScrollView');
const cookies = fromJS({
    cookie: false,
});

it('renders correctly', () => {
    const tree = renderer.create(
        <CustomWebView
            store={mockStore({
                cookies,
                removeCookie: jest.fn(),
                removeSession: jest.fn(),
                setCookie: jest.fn(),
                setSession: jest.fn(),
            })}
            uri="https://reittiopas.fi"
        />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
