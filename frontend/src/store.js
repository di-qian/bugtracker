import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  bugListReducer,
  bugDetailsReducer,
  bugDeleteReducer,
  bugCreateReducer,
  bugUpdateReducer,
  bugCommentCreateReducer,
  bugRmAssigneeReducer,
} from './reducers/bugReducers';
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userCreateReducer,
  userDeleteReducer,
  userUpdateReducer,
} from './reducers/userReducers';

import {
  projectListReducer,
  projectDetailsReducer,
  projectDeleteReducer,
  projectCreateReducer,
  projectUpdateReducer,
} from './reducers/projectReducers';

import { screenNameReducer } from './reducers/screenReducers';

const reducer = combineReducers({
  bugList: bugListReducer,
  bugDetails: bugDetailsReducer,
  bugDelete: bugDeleteReducer,
  bugCreate: bugCreateReducer,
  bugUpdate: bugUpdateReducer,
  bugCommentCreate: bugCommentCreateReducer,
  bugRmAssignee: bugRmAssigneeReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userCreate: userCreateReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  projectList: projectListReducer,
  projectDetails: projectDetailsReducer,
  projectDelete: projectDeleteReducer,
  projectCreate: projectCreateReducer,
  projectUpdate: projectUpdateReducer,
  screenName: screenNameReducer,
});

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = { userLogin: { userInfo: userInfoFromStorage } };

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
