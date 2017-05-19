import {combineReducers} from 'redux';
import news from './news';
import cookies from './cookies';
import routes from './routes';

const rootReducer = combineReducers({
    cookies,
    news,
    routes,
});

export default rootReducer;
