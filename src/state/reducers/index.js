import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import NotificationsReducer from './NotificationsReducer';
import { CLEAR_STATE } from '../ActionTypes';

const AppReducer = combineReducers({
  auth: AuthReducer,
  notifications: NotificationsReducer
});

const rootReducer = (state, action) => {
  if (action.type === CLEAR_STATE) {
    state = undefined;
  }

  return AppReducer(state, action);
};

export default rootReducer;
