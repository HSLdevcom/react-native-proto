import {combineReducers} from 'redux';
import news from './news';
import routes from './routes';

const rootReducer = combineReducers({
    news,
    routes,
});

export default rootReducer;
