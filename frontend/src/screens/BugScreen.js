import React, { useEffect } from 'react';
import Moment from 'react-moment';
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
                  <i className="far fa-clock fa-lg mr-2"></i>
                  <Moment format="YYYY-MM-DD">{Date.now()}</Moment>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row className="mb-3">
                    <span className="badge badge-pill badge-light mr-2">
                      Bug Tracking
                    </span>

                    {bug.Priority === 'High' ? (
                      <span className="badge badge-danger">High Priority</span>
                    ) : bug.Priority === 'Normal' ? (
                      <span className="badge badge-warning">
                        Normal Priority
                      </span>
                    ) : (
                      <span className="badge badge-primary">Low Priority</span>
                    )}
                  </Row>
                  <Row>
                    <p className="font-weight-bold mr-2">Issue: </p>
                    <p>{bug.name}</p>
                  </Row>
                  <Row>
                    <p className="font-weight-bold mr-2">Created on: </p>
                    <Moment format="YYYY-MM-DD">{bug.createdAt}</Moment>
                    <p className="font-weight-bold ml-4 mr-2">Due By: </p>
                    <Moment format="YYYY-MM-DD">{bug.resolvedBy}</Moment>
                  </Row>
                  <Row>
                    <p className="font-weight-bold mr-2">Assignee: </p>
                    <Image
                      className="mr-2"
                      src="/images/profiles/profile2.jpg"
                      width="35"
                      height="35"
                      roundedCircle
                    />
                    <p>{bug.assignedTo ? bug.assignedTo.name : ''}</p>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
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
