import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row className="mb=0">
          <Col className="text-center py-3">
            Profile Image Sources:{' '}
            <a href="https://randomuser.me/photos">
              https://randomuser.me/photos
            </a>
          </Col>
        </Row>
        <Row>
          <Col className="text-center py-3">Copyright &copy; Bug Tracker</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
