import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { LinkContainer } from 'react-router-bootstrap';

const HomeScreen = () => {
  return (
    <FormContainer>
      <Row className=" justify-content-md-center">
        <h2 className="homefont">Welcome to</h2>
      </Row>
      <Row className="justify-content-md-center">
        <h2 className="homefont">BugTracker</h2>
      </Row>
      <Row className="justify-content-md-center">
        <i className="fas fa-bug fa-3x mb-4"></i>
      </Row>
      <Row className="justify-content-md-center mb-4">
        <LinkContainer to="/register">
          <Button variant="outline-dark" className="buttonwidth">
            CREATE ACCOUNT
          </Button>
        </LinkContainer>
      </Row>
      <Row className="justify-content-md-center">
        <LinkContainer to="/login">
          <Button variant="outline-dark" className="buttonwidth">
            SIGN IN
          </Button>
        </LinkContainer>
      </Row>
    </FormContainer>
  );
};

export default HomeScreen;
