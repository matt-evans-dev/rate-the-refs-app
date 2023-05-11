import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import rootReducer from './reducers';

const middleware = applyMiddleware(thunk, createLogger());
const Store = createStore(rootReducer, compose(middleware));
export default Store;
