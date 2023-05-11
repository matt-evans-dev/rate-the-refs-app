import * as Actions from '../ActionTypes';

const initialState = {
  data: [],
  isFetching: false,
  error: undefined
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case Actions.FETCHING_NOTIFICATIONS:
      return Object.assign({}, state, {
        isFetching: true
      });

    case Actions.FETCHING_NOTIFICATIONS_SUCCESS:
      return Object.assign({}, state, {
        data: payload,
        isFetching: false,
        error: undefined
      });

    case Actions.FETCHING_NOTIFICATIONS_FAIL:
      return Object.assign({}, state, {
        data: [],
        isFetching: false,
        error: payload
      });

    case Actions.UPDATING_NOTIFICATIONS:
      return state;

    case Actions.UPDATING_NOTIFICATIONS_SUCCESS:
      return Object.assign({}, state, {
        data: payload,
        error: undefined
      });

    case Actions.UPDATING_NOTIFICATIONS_FAIL:
      return Object.assign({}, state, {
        error: payload
      });

    default:
      return state;
  }
};
