import {combineReducers} from 'redux';
// import {combineReducers} from 'redux-immutablejs';
import {reducer as form} from 'redux-form/immutable';
import cityBike from './cityBike';
import news from './news';
import cookies from './cookies';
import routes from './routes';
import session from './session';

const rootReducer = combineReducers({
    cityBike,
    cookies,
    form,
    news,
    routes,
    session,
});

export default rootReducer;
