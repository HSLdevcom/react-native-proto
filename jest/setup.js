import 'isomorphic-fetch';

global.fetch = require('jest-fetch-mock'); //eslint-disable-line import/no-extraneous-dependencies

// https://github.com/facebook/jest/issues/2208#issuecomment-264733133
jest.mock('Linking', () => { // eslint-disable-line arrow-body-style
    return {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        openURL: jest.fn(),
        canOpenURL: jest.fn(),
        getInitialURL: jest.fn(),
    };
});
