import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, ListGroup } from 'react-bootstrap';
import { listBugDetails } from '../actions/bugActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import CommentBox from '../components/CommentBox';

const BugScreen = ({ match }) => {
  const dispatch = useDispatch();

  const bugDetails = useSelector((state) => state.bugDetails);
  const { loading, error, bug } = bugDetails;

  useEffect(() => {
    dispatch(listBugDetails(match.params.id));
  }, [dispatch, match]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
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
                  My Name
                  {'       '}
                  <i className="far fa-clock fa-lg ml-4 mr-1"></i>
                  {Date.now()}
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <span class="badge badge-pill badge-light">
                      Bug Tracking
                    </span>

                    {bug.Priority === 'High' ? (
                      <span class="badge badge-danger">High Priority</span>
                    ) : bug.Priority === 'Normal' ? (
                      <span class="badge badge-warning">Normal Priority</span>
                    ) : (
                      <span class="badge badge-primary">Low Priority</span>
                    )}
                  </Row>
                  <Row className="ex1 title1">
                    <span className="font-weight-bold pt-3">{bug.name}</span>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row className="ex1">
                    <span className="font-weight-bold mr-2">Description:</span>
                    <p>{bug.description}</p>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>Row1</ListGroup.Item>
                <ListGroup.Item></ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <CommentBox />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default BugScreen;
