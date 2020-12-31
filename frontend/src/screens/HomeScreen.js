import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { LinkContainer } from 'react-router-bootstrap';
import HomeCarousel from '../components/HomeCarousel';
import { USER_LOGIN_ERRORS_RESET } from '../constants/userConstants';

const HomeScreen = ({ location, history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const redirect = location.search
    ? location.search.split('=')[1]
    : '/auth/dashboard';

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    } else {
      dispatch({ type: USER_LOGIN_ERRORS_RESET });
    }
  }, [history, userInfo, redirect, dispatch]);

  return (
    <Row className="h-100 d-flex align-items-center justify-content-center">
      <Col className="align-items-center justify-content-center">
        <Row className="d-flex align-items-center justify-content-center">
          <h2 className="homefont text-nowrap">Welcome to</h2>
        </Row>
        <Row className="d-flex align-items-center justify-content-center">
          <h2 className="homefont text-nowrap">BugTracker</h2>
        </Row>
        <hr />
        <Row className="d-flex align-items-center justify-content-center ">
          <p className="font-weight-bold font-italic">Latest Bugs Added:</p>
        </Row>
        <Row className="d-flex align-items-center justify-content-center mb-4">
          <HomeCarousel />
        </Row>
        <hr />
        <Row className="d-flex align-items-center justify-content-center">
          <i className="fas fa-bug fa-3x mb-4"></i>
        </Row>

        <Row className="mb-3 d-flex align-items-center justify-content-center">
          <LinkContainer to="/login">
            <Button variant="outline-dark" className="buttonwidth">
              SIGN IN
            </Button>
          </LinkContainer>
        </Row>
        <Row className="d-flex align-items-center justify-content-center">
          <LinkContainer to="/register">
            <Button variant="outline-dark" className="buttonwidth">
              CREATE ACCOUNT
            </Button>
          </LinkContainer>
        </Row>
      </Col>
    </Row>
  );
};

export default HomeScreen;
