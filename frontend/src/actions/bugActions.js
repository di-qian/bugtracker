import axios from 'axios';
import {
  BUG_LIST_REQUEST,
  BUG_LIST_SUCCESS,
  BUG_LIST_FAIL,
  BUG_DETAILS_REQUEST,
  BUG_DETAILS_SUCCESS,
  BUG_DETAILS_FAIL,
} from '../constants/bugConstants';

export const listBugs = () => async (dispatch) => {
  try {
    dispatch({ type: BUG_LIST_REQUEST });

    const { data } = await axios.get('/api/bugs');

    dispatch({ type: BUG_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: BUG_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listBugDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: BUG_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/bugs/${id}`);

    dispatch({ type: BUG_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: BUG_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
