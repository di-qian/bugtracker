import React, { useEffect } from 'react';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, ListGroup } from 'react-bootstrap';
import { listBugDetails } from '../actions/bugActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import CommentBox from '../components/CommentBox';
import { userRegisterReducer } from '../reducers/userReducers';

const BugScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const bugDetails = useSelector((state) => state.bugDetails);
  const { loading, error, bug } = bugDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      dispatch(listBugDetails(match.params.id));
    }
  }, [dispatch, history, match]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Col>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <tr>
                    <i className="far fa-clock fa-lg mr-2"></i>
                    <Moment format="YYYY-MM-DD">{Date.now()}</Moment>
                  </tr>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row className="mb-3">
                  <span className="badge badge-pill badge-light mr-2">
                    Bug Tracking
                  </span>

                  {bug.priority === 'High' ? (
                    <span className="badge badge-danger">High Priority</span>
                  ) : bug.priority === 'Normal' ? (
                    <span className="badge badge-warning">Normal Priority</span>
                  ) : (
                    <span className="badge badge-primary">Low Priority</span>
                  )}
                </Row>
                <Row>
                  <p className="font-weight-bold mr-2">Project: </p>
                  <p>{bug.project ? bug.project.name : ''}</p>
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
                  <tr>
                    <td>
                      <p className="font-weight-bold mr-2">Assignee: </p>
                    </td>
                    <td>
                      <Image
                        className="mr-2"
                        src={bug.assignedTo ? bug.assignedTo.image : ''}
                        width="35"
                        height="35"
                        roundedCircle
                      />
                    </td>
                    <td>
                      <p>{bug.assignedTo ? bug.assignedTo.name : ''}</p>
                    </td>
                    <td>
                      <p className="font-weight-bold ml-4 mr-2">Manager: </p>
                    </td>
                    <td>
                      <Image
                        className="mr-2"
                        src={bug.assignedTo ? bug.assignedTo.image : ''}
                        width="35"
                        height="35"
                        roundedCircle
                      />
                    </td>
                    <td>
                      <p>{bug.project ? bug.project.managerAssigned : ''}</p>
                    </td>
                  </tr>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <p className="font-weight-bold mr-2">Description:</p>
                  <p>{bug.description}</p>
                </Row>

                <Row>
                  <tr>
                    <td>
                      <p className="font-weight-bold mr-2">Image:</p>
                    </td>
                    <td>
                      <a href={bug.image}>
                        <i class="fas fa-paperclip"></i>
                      </a>
                    </td>
                  </tr>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>Row1</ListGroup.Item>
              <Row className="mt-3">
                <Col>
                  <CommentBox />
                </Col>
              </Row>
            </ListGroup>
          </Col>
        </>
      )}
    </>
  );
};

export default BugScreen;
