import {combineReducers} from 'redux';
// import {combineReducers} from 'redux-immutablejs';
import {reducer as form} from 'redux-form/immutable';
import news from './news';
import cookies from './cookies';
import routes from './routes';
import session from './session';

const rootReducer = combineReducers({
    cookies,
    form,
    news,
    routes,
    session,
});

export default rootReducer;
