import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { register } from '../actions/userActions';
import { GET_ERRORS_RESET } from '../constants/userConstants';

const RegisterScreen = ({ location, history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailEdit, setEmailEdit] = useState(false);
  const [passwordEdit, setPasswordEdit] = useState(false);
  const [confirmPasswordEdit, setConfirmPasswordEdit] = useState(false);

  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo, errors } = userRegister;

  const redirect = location.search
    ? location.search.split('=')[1]
    : '/auth/dashboard';

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
    dispatch({ type: GET_ERRORS_RESET });
  }, [history, userInfo, redirect, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();

    setEmailEdit(false);
    setPasswordEdit(false);
    setConfirmPasswordEdit(false);
    dispatch(register(name, email, password, confirmPassword));
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

  return (
    <FormContainer>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h3 className="pagetitlefont">Sign Up</h3> <hr />
          {error && <Message variant="danger">{error}</Message>}
          {loading && <Loader />}
          <Form onSubmit={submitHandler}>
            <Form.Group className="groupposition" controlId="name">
              <Form.Label className="mr-1">Name</Form.Label>
              <i className="fas fa-asterisk fa-xs fh"></i>
              <Form.Control
                type="text"
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
              <Form.Label className="mr-1">Password</Form.Label>
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
              <Form.Label className="mr-1">Confirm Password</Form.Label>
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

            <Button type="submit" variant="primary" className="mr-2">
              Register
            </Button>
            <Link className="btn btn-dark" to="/">
              Go Back
            </Link>
          </Form>
          <Row className="py-3">
            <Col>
              Have an Account?{' '}
              <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                Login
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
