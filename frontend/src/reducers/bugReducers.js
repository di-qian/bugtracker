import {
  BUG_LIST_REQUEST,
  BUG_LIST_SUCCESS,
  BUG_LIST_FAIL,
  BUG_DETAILS_REQUEST,
  BUG_DETAILS_SUCCESS,
  BUG_DETAILS_FAIL,
} from '../constants/bugConstants';

export const bugListReducer = (state = { bugs: [] }, action) => {
  switch (action.type) {
    case BUG_LIST_REQUEST:
      return { loading: true, bugs: [] };
    case BUG_LIST_SUCCESS:
      return { loading: false, bugs: action.payload };
    case BUG_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const bugDetailsReducer = (
  state = { bug: { comments: [] } },
  action
) => {
  switch (action.type) {
    case BUG_DETAILS_REQUEST:
      return { ...state, loading: true };
    case BUG_DETAILS_SUCCESS:
      return { loading: false, bug: action.payload };
    case BUG_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
