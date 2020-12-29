import React, { useState, useEffect } from 'react';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Image, Button, Badge } from 'react-bootstrap';
import { listBugDetails } from '../actions/bugActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import CommentBox from '../components/CommentBox';

const BugTestScreen = ({ history, match }) => {
  const [name, setName] = useState('');

  const dispatch = useDispatch();

  const bugDetails = useSelector((state) => state.bugDetails);
  const { loading, error, bug } = bugDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push('/auth/fail');
    } else {
      dispatch(listBugDetails(match.params.id));
    }
  }, [dispatch, history, match, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(e);
    //submitHandlersomething
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <FormContainer>
            <Form.Row className="align-items-center mb-3">
              <i className="far fa-clock fa-lg mr-2"></i>
              <Moment format="MM/DD/YYYY  hh:mm A">{Date.now()}</Moment>
            </Form.Row>

            <Form.Label>
              <Badge className="mr-2" variant="light">
                Bug Tracking
              </Badge>
            </Form.Label>

            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name">
                <Form.Label className="font-weight-bold mr-2">Issue</Form.Label>
                <Form.Control
                  type="name"
                  placeholder="Enter New Issue"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Button className="mr-2" type="submit" variant="primary">
                Add
              </Button>
              <Link className="btn btn-dark my-3" to="/auth/dashboard">
                Go Back
              </Link>
            </Form>
          </FormContainer>
        </>
      )}
      <BugTestScreen />
    </>
  );
};

export default BugTestScreen;
