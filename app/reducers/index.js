import {combineReducers} from 'redux';
import news from './news';
import reittiopas from './reittiopasDownload';
import routes from './routes';

const rootReducer = combineReducers({
    news,
    reittiopas,
    routes,
});

export default rootReducer;
