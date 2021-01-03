import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { createUser } from '../actions/userActions';
import { getScreenName } from '../actions/screenActions';
import {
  SCREEN_NAME_RESET,
  USER_CREATE_PAGE,
} from '../constants/screenConstants';
import { USER_CREATE_RESET } from '../constants/userConstants';

const UserCreateScreen = ({ location, history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [emailEdit, setEmailEdit] = useState(false);
  const [passwordEdit, setPasswordEdit] = useState(false);
  const [confirmPasswordEdit, setConfirmPasswordEdit] = useState(false);
  const [imageEdit, setImageEdit] = useState(false);

  const dispatch = useDispatch();

  const userCreate = useSelector((state) => state.userCreate);
  const { loading, errors, success } = userCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo || (userInfo && !userInfo.isAdmin)) {
      history.push('/auth/fail');
    } else {
      dispatch(getScreenName(USER_CREATE_PAGE));
      dispatch({ type: USER_CREATE_RESET });
      if (success) {
        history.push('/admin/userlist');
      }
    }
  }, [dispatch, history, success, userInfo]);

  useEffect(() => {
    return () => {
      dispatch({ type: SCREEN_NAME_RESET });
    };
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    setEmailEdit(false);
    setPasswordEdit(false);
    setConfirmPasswordEdit(false);
    setImageEdit(false);

    // if (password !== confirmPassword) {
    //   setMessage('Passwords do not match');
    // } else {
    dispatch(
      createUser(
        name,
        email,
        password,
        confirmPassword,
        image,
        isAdmin,
        isManager
      )
    );
    //}
  };

  const settingEmail = (e) => {
    setEmail(e);
    setEmailEdit(true);
  };

  const settingPassword = (e) => {
    setPassword(e);
    setPasswordEdit(true);
  };

  const settingConfirmPassword = (e) => {
    setConfirmPassword(e);
    setConfirmPasswordEdit(true);
  };

  const settingImage = (e) => {
    setImage(e);
    setImageEdit(true);
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await axios.post('/api/upload', formData, config);

      settingImage(data);

      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

  return (
    <>
      <FormContainer>
        <h3 className="pagetitlefont mb-3">New User</h3>
        <hr />
        {loading ? (
          <Loader />
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group className="groupposition" controlId="name">
              <Form.Label className="mr-1">Name</Form.Label>
              <i className="fas fa-asterisk fa-xs fh"></i>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isInvalid={errors && errors.name && !name}
              ></Form.Control>
              <Form.Control.Feedback
                className="tooltipposition"
                type="invalid"
                tooltip
              >
                {errors && errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="groupposition" controlId="email">
              <Form.Label className="mr-1">Email Address</Form.Label>
              <i className="fas fa-asterisk fa-xs fh"></i>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => settingEmail(e.target.value)}
                isInvalid={errors && errors.email && !emailEdit}
              ></Form.Control>
              <Form.Control.Feedback
                className="tooltipposition"
                type="invalid"
                tooltip
              >
                {errors && errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="groupposition" controlId="password">
              <Form.Label className="mr-1">Temporary Password</Form.Label>
              <i className="fas fa-asterisk fa-xs fh"></i>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => settingPassword(e.target.value)}
                isInvalid={errors && errors.password && !passwordEdit}
              ></Form.Control>
              <Form.Control.Feedback
                className="tooltipposition"
                type="invalid"
                tooltip
              >
                {errors && errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="groupposition" controlId="confirmPassword">
              <Form.Label className="mr-1">
                Confirm Temporary Password
              </Form.Label>
              <i className="fas fa-asterisk fa-xs fh"></i>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => settingConfirmPassword(e.target.value)}
                isInvalid={
                  errors && errors.confirmPassword && !confirmPasswordEdit
                }
              ></Form.Control>
              <Form.Control.Feedback
                className="tooltipposition"
                type="invalid"
                tooltip
              >
                {errors && errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="isadmin">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Form.Group controlId="ismanager">
              <Form.Check
                type="checkbox"
                label="Is Manager"
                checked={isManager}
                onChange={(e) => setIsManager(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image url"
                value={image}
                onChange={(e) => settingImage(e.target.value)}
                isInvalid={errors && errors.image && !imageEdit}
              ></Form.Control>
              <Form.File
                id="image-file"
                label="Choose File"
                custom
                onChange={uploadFileHandler}
              ></Form.File>
              {uploading && <Loader />}
              <Form.Control.Feedback
                className="tooltipposition"
                type="invalid"
                tooltip
              >
                {errors && errors.image}
              </Form.Control.Feedback>
            </Form.Group>

            <Button className="mr-2" type="submit" variant="primary">
              Add
            </Button>
            <Link className="btn btn-dark my-3" to="/admin/userlist">
              Go Back
            </Link>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserCreateScreen;
