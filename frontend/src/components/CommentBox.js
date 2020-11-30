import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Image, Row, Col, ListGroup, Button } from 'react-bootstrap';

const CommentBox = () => {
  return (
    <>
      <Row>
        <Col>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Image
                className="mr-2"
                src="/images/profiles/profile2.jpg"
                width="35"
                height="35"
                roundedCircle
              />

              <Form>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label className="font-weight-bold">Comment</Form.Label>
                  <Form.Control as="textarea" rows={3} />
                </Form.Group>
                <Button className="mr-2" variant="primary" type="submit">
                  Submit
                </Button>
                <Link className="btn btn-dark my-3" to="/">
                  Go Back
                </Link>
              </Form>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default CommentBox;
