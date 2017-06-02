import {combineReducers} from 'redux';
import news from './news';
import cookies from './cookies';
import routes from './routes';
import session from './session';
import beacons from './beacons';

const rootReducer = combineReducers({
    cookies,
    news,
    routes,
    session,
    beacons,
});

export default rootReducer;
