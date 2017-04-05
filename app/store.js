import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {fromJS} from 'immutable';
import {DEFAULT_STATE} from './intialState';
import rootReducer from './reducers/index';

const middleware = applyMiddleware(thunk);
const initialState = fromJS(DEFAULT_STATE);
const store = createStore(rootReducer, initialState, middleware);

export default store;
