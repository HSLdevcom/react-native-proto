import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {fromJS} from 'immutable';
import {composeWithDevTools} from 'remote-redux-devtools';
import {DEFAULT_STATE} from './intialState';
import rootReducer from './reducers/index';

const middleware = applyMiddleware(thunk);
const initialState = fromJS(DEFAULT_STATE);
const store = createStore(rootReducer, initialState, composeWithDevTools(middleware));

export default store;
