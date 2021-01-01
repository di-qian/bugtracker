import {
  SCREEN_NAME_REQUEST,
  SCREEN_NAME_SUCCESS,
  SCREEN_NAME_FAIL,
  SCREEN_NAME_RESET,
} from '../constants/screenConstants';

export const screenNameReducer = (state = {}, action) => {
  switch (action.type) {
    case SCREEN_NAME_REQUEST:
      return { ...state, loading: true };
    case SCREEN_NAME_SUCCESS:
      return {
        loading: false,
        screen: action.payload,
      };
    case SCREEN_NAME_FAIL:
      return { loading: false, error: action.payload };
    case SCREEN_NAME_RESET:
      return {};
    default:
      return state;
  }
};
