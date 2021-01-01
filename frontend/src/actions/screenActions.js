import {
  SCREEN_NAME_REQUEST,
  SCREEN_NAME_SUCCESS,
  SCREEN_NAME_FAIL,
} from '../constants/screenConstants';

export const getScreenName = (screen_name) => async (dispatch) => {
  try {
    dispatch({ type: SCREEN_NAME_REQUEST });

    const data = screen_name;

    dispatch({ type: SCREEN_NAME_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SCREEN_NAME_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
