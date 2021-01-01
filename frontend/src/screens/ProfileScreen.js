import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Image, Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { getScreenName } from '../actions/screenActions';
import {
  SCREEN_NAME_RESET,
  USER_PROFILE_EDIT_PAGE,
} from '../constants/screenConstants';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

const ProfileScreen = ({ history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [emailEdit, setEmailEdit] = useState(false);
  const [passwordEdit, setPasswordEdit] = useState(false);
  const [confirmPasswordEdit, setConfirmPasswordEdit] = useState(false);
  const [imageEdit, setImageEdit] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [show, setShow] = useState(false);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success, error: errorProfile } = userUpdateProfile;

  useEffect(() => {
    if (!userInfo) {
      history.push('/auth/fail');
    } else {
      console.log(userInfo.name);
      dispatch(getScreenName(USER_PROFILE_EDIT_PAGE));
      if (!user || !user.name || success) {
        setUpdateSuccess(success);
        setShow(true);
        //setTimeout(() => setShow(false), 2000);

        dispatch(getUserDetails('profile'));
      } else {
        if (success) {
          setUpdateSuccess(false);
        }

        setName(user.name);
        setEmail(user.email);
        setImage(user.image);
      }
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
    }
  }, [dispatch, history, userInfo, user, success, updateSuccess]);

  useEffect(() => {
    return () => {
      dispatch({ type: SCREEN_NAME_RESET });
    };
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    setShow(false);
    setEmailEdit(false);
    setPasswordEdit(false);
    setConfirmPasswordEdit(false);
    setImageEdit(false);

    // if (password !== confirmPassword) {
    //   setMessage('Passwords do not match');
    // } else {
    dispatch(
      updateUserProfile({
        id: user._id,
        name,
        email,
        password,
        confirmPassword,
        image,
      })
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
    console.log(e.target.files);
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append('image', file);
    console.log(formData);
    setUploading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await axios.post('/api/upload', formData, config);

      setImage(data);

      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  return (
    <>
      <Row>
        <Col>
          <h3 className="pagetitlefont">User Profile</h3>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <hr />
          {updateSuccess && (
            <Alert
              variant="success"
              dismissible
              transition
              show={show}
              onClose={() => setShow(false)}
            >
              User Profile Updated
            </Alert>
          )}
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name">
                <Form.Label className="mr-1">Edit Name</Form.Label>

                <Form.Control
                  type="name"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  isInvalid={errorProfile && errorProfile.name && !name}
                ></Form.Control>
                <Form.Control.Feedback
                  className="tooltipposition"
                  type="invalid"
                  tooltip
                >
                  {errorProfile && errorProfile.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label className="mr-1">Edit Email Address</Form.Label>

                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => settingEmail(e.target.value)}
                  isInvalid={errorProfile && errorProfile.email && !emailEdit}
                ></Form.Control>
                <Form.Control.Feedback
                  className="tooltipposition"
                  type="invalid"
                  tooltip
                >
                  {errorProfile && errorProfile.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Edit Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => settingPassword(e.target.value)}
                  isInvalid={
                    errorProfile && errorProfile.password && !passwordEdit
                  }
                ></Form.Control>
                <Form.Control.Feedback
                  className="tooltipposition"
                  type="invalid"
                  tooltip
                >
                  {errorProfile && errorProfile.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => settingConfirmPassword(e.target.value)}
                  isInvalid={
                    errorProfile &&
                    errorProfile.confirmPassword &&
                    !confirmPasswordEdit
                  }
                ></Form.Control>
                <Form.Control.Feedback
                  className="tooltipposition"
                  type="invalid"
                  tooltip
                >
                  {errorProfile && errorProfile.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="image">
                <Form.Label>Edit Profile Image</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter image url"
                  value={image}
                  onChange={(e) => settingImage(e.target.value)}
                  isInvalid={errorProfile && errorProfile.image && !imageEdit}
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
                  {errorProfile && errorProfile.image}
                </Form.Control.Feedback>
              </Form.Group>

              <Button className="mr-2" type="submit" variant="primary">
                Update
              </Button>
              <Link className="btn btn-dark my-3" to="/auth/dashboard">
                Go Back
              </Link>
            </Form>
          )}
        </Col>
        <Col md={6}>
          <Image
            className="mr-2"
            width="100%"
            // src="/images/profiles/profile2.jpg"
            src={user && user.image}
          />
        </Col>
      </Row>
    </>
  );
};

export default ProfileScreen;
