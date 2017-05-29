import {combineReducers} from 'redux';
import news from './news';
import cookies from './cookies';
import routes from './routes';
import session from './session';

const rootReducer = combineReducers({
    cookies,
    news,
    routes,
    session,
});

export default rootReducer;
