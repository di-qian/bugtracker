import axios from 'axios';
import {
  BUG_LIST_REQUEST,
  BUG_LIST_SUCCESS,
  BUG_LIST_FAIL,
  BUG_DETAILS_REQUEST,
  BUG_DETAILS_SUCCESS,
  BUG_DETAILS_FAIL,
  BUG_DELETE_REQUEST,
  BUG_DELETE_SUCCESS,
  BUG_DELETE_FAIL,
  BUG_CREATE_REQUEST,
  BUG_CREATE_SUCCESS,
  BUG_CREATE_FAIL,
  BUG_CREATE_COMMENT_REQUEST,
  BUG_CREATE_COMMENT_SUCCESS,
  BUG_CREATE_COMMENT_FAIL,
  BUG_UPDATE_REQUEST,
  BUG_UPDATE_FAIL,
  BUG_UPDATE_ASSIGNEE_SUCCESS,
  BUG_UPDATE_NAME_SUCCESS,
  BUG_UPDATE_PROJECT_SUCCESS,
  BUG_UPDATE_PRIORITY_SUCCESS,
  BUG_UPDATE_DUEDATE_SUCCESS,
  BUG_UPDATE_DESCRIPTION_SUCCESS,
  BUG_UPDATE_IMAGE_SUCCESS,
  BUG_UPDATE_COMMENT_SUCCESS,
  BUG_UPDATE_RESOLVED_SUCCESS,
} from '../constants/bugConstants';
import { logout } from './userActions';

export const listBugs = (keyword = '', pageNumber = '') => async (dispatch) => {
  try {
    dispatch({ type: BUG_LIST_REQUEST });

    const { data } = await axios.get(
      `/api/bugs?keyword=${keyword}&pageNumber=${pageNumber}`
    );

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

export const deleteBug = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: BUG_DELETE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/bugs/${id}`, config);

    dispatch({
      type: BUG_DELETE_SUCCESS,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Not authorized, token failed') {
      dispatch(logout());
    }
    dispatch({
      type: BUG_DELETE_FAIL,
      payload: message,
    });
  }
};

export const createBug = (newbug) => async (dispatch, getState) => {
  try {
    dispatch({
      type: BUG_CREATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/bugs`, newbug, config);

    dispatch({
      type: BUG_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Not authorized, token failed') {
      dispatch(logout());
    }
    dispatch({
      type: BUG_CREATE_FAIL,
      payload: message,
    });
  }
};

export const updateBug = (updatetype, bug) => async (dispatch, getState) => {
  try {
    dispatch({
      type: BUG_UPDATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    console.log(bug._id);
    const { data } = await axios.put(`/api/bugs/${bug._id}`, bug, config);

    switch (updatetype) {
      case 'UPDATE_ASSIGNEE':
        dispatch({
          type: BUG_UPDATE_ASSIGNEE_SUCCESS,
          payload: data,
        });
        break;
      case 'UPDATE_NAME':
        dispatch({
          type: BUG_UPDATE_NAME_SUCCESS,
          payload: data,
        });
        break;
      case 'UPDATE_PROJECT':
        dispatch({
          type: BUG_UPDATE_PROJECT_SUCCESS,
          payload: data,
        });
        break;
      case 'UPDATE_PRIORITY':
        dispatch({
          type: BUG_UPDATE_PRIORITY_SUCCESS,
          payload: data,
        });
        break;
      case 'UPDATE_DUEDATE':
        dispatch({
          type: BUG_UPDATE_DUEDATE_SUCCESS,
          payload: data,
        });
        break;
      case 'UPDATE_DESCRIPTION':
        dispatch({
          type: BUG_UPDATE_DESCRIPTION_SUCCESS,
          payload: data,
        });
        break;
      case 'UPDATE_IMAGE':
        dispatch({
          type: BUG_UPDATE_IMAGE_SUCCESS,
          payload: data,
        });
        break;
      case 'UPDATE_COMMENT':
        dispatch({
          type: BUG_UPDATE_COMMENT_SUCCESS,
          payload: data,
        });
        break;
      case 'UPDATE_RESOLVEDAT':
        dispatch({
          type: BUG_UPDATE_RESOLVED_SUCCESS,
          payload: data,
        });
        break;
      default:
    }

    dispatch({ type: BUG_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Not authorized, token failed') {
      dispatch(logout());
    }
    dispatch({
      type: BUG_UPDATE_FAIL,
      payload: message,
    });
  }
};

export const createBugComment = (bugId, tracker) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: BUG_CREATE_COMMENT_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      `/api/bugs/${bugId}/trackers`,
      tracker,
      config
    );
    console.log(data);
    dispatch({
      type: BUG_CREATE_COMMENT_SUCCESS,
    });

    dispatch({ type: BUG_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Not authorized, token failed') {
      dispatch(logout());
    }
    dispatch({
      type: BUG_CREATE_COMMENT_FAIL,
      payload: message,
    });
  }
};
