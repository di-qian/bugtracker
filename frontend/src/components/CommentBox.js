import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Image, Row, Col, ListGroup, Button } from 'react-bootstrap';

const CommentBox = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  return (
    <>
      <Row>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <Row>
              <Col sm={2}>
                <Image
                  className="mr-2"
                  src={userInfo.image}
                  width="35"
                  height="35"
                  roundedCircle
                />
              </Col>
              <Col sm={10}>
                <Form>
                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    {/* <Form.Label className="font-weight-bold">Comment</Form.Label> */}
                    <Form.Control
                      as="textarea"
                      placeholder="Write a comment..."
                      rows={5}
                    />
                  </Form.Group>
                  <Button className="mr-2" variant="primary" type="submit">
                    Submit
                  </Button>
                  <Link className="btn btn-dark my-3" to="/">
                    Go Back
                  </Link>
                </Form>
              </Col>
            </Row>
          </ListGroup.Item>
        </ListGroup>
      </Row>
    </>
  );
};

export default CommentBox;
