import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Image, Row, Col, ListGroup, Button } from 'react-bootstrap';

const CommentBox = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  return (
    <>
      <tr>
        <td>
          <Image
            className="mr-2"
            src={userInfo.image}
            width="35"
            height="35"
            roundedCircle
          />
        </td>
        <td width="100%">
          <Form>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Control
                className="mb-3"
                as="textarea"
                placeholder="Write a comment..."
                rows={5}
              />

              <Button className="mr-2" variant="primary" type="submit">
                Submit
              </Button>
              <Link className="btn btn-dark" to="/auth/dashboard">
                Go Back
              </Link>
            </Form.Group>
          </Form>
        </td>
      </tr>
    </>
  );
};

export default CommentBox;
