import * as Actions from '../ActionTypes';

const initialState = {
  user: undefined,
  isFetching: true,
  isUpdating: false,
  error: undefined,
  resetting: false
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case Actions.FETCHING_USER:
      return Object.assign({}, state, {
        user: undefined,
        isFetching: true,
        error: undefined,
        resetting: false
      });

    case Actions.FETCHING_USER_SUCCESS:
      return Object.assign({}, state, {
        user: payload,
        isFetching: false,
        error: undefined,
        resetting: false
      });

    case Actions.FETCHING_USER_FAIL:
      return Object.assign({}, state, {
        user: undefined,
        isFetching: false,
        error: payload
      });

    case Actions.UPDATING_USER:
      return Object.assign({}, state, {
        isUpdating: true,
        error: undefined
      });

    case Actions.UPDATE_USER_SUCCESS:
      return Object.assign({}, state, {
        user: payload,
        isFetching: false,
        isUpdating: false,
        error: undefined,
        resetting: false
      });

    case Actions.UPDATE_USER_FAIL:
      return Object.assign({}, state, {
        isFetching: false,
        isUpdating: false,
        error: payload
      });
    case Actions.RESET_STATE:
      return Object.assign({}, state, {
        resetting: true,
        isFetching: false
      });

    case Actions.CLEAR_STATE:
      return Object.assign({}, state, {
        ...initialState,
        isFetching: false
      });

    default:
      return state;
  }
};
