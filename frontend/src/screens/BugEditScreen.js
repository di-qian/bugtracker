import React, { useState, useEffect } from 'react';
import Moment from 'react-moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Form,
  Row,
  Col,
  Image,
  Button,
  Badge,
  Jumbotron,
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import { listBugDetails } from '../actions/bugActions';
import Message from '../components/Message';
import Loader from '../components/Loader';

import FormContainer from '../components/FormContainer';
import { listProjects } from '../actions/projectActions';
import { listUsers } from '../actions/userActions';

const BugEditScreen = ({ history, match }) => {
  const [name, setName] = useState('');
  const [project, setProject] = useState('');
  const [priority, setPriority] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [assignedToImage, setAssignedToImage] = useState('');
  const [assignedToName, setAssignedToName] = useState('');
  const [startDate, setStartDate] = useState(new Date('1993/09/28'));
  const [isEditMode, setIsEditMode] = useState(false);

  const dispatch = useDispatch();

  const bugDetails = useSelector((state) => state.bugDetails);
  const { loading, error, bug } = bugDetails;

  const projectList = useSelector((state) => state.projectList);
  const { projects } = projectList;

  const userList = useSelector((state) => state.userList);
  const { users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      if (!bug || !bug.name) {
        dispatch(listBugDetails(match.params.id));
        dispatch(listProjects());
        dispatch(listUsers());
      } else {
        setName(bug.name);
        setProject(bug.project);
        setPriority(bug.priority);
        setDescription(bug.description);

        if (!assignedTo) {
          setAssignedTo(bug.assignedTo);
        } else {
          if (!assignedToName) {
            setAssignedToName(assignedTo.name);
            console.log('here 2');
          }
          if (!assignedToImage) {
            setAssignedToImage(assignedTo.image);
            console.log('here 3');
          }
        }

        setStartDate(new Date(bug.resolvedBy));
      }
    }
  }, [
    dispatch,
    history,
    match,
    userInfo,
    bug,
    assignedTo,
    assignedToImage,
    assignedToName,
    isEditMode,
  ]);

  const submitHandler = (e) => {
    e.preventDefault();

    //To be added
  };

  const settingProject = (e) => {
    const newproject = projects.find((x) => x.name === e);
    if (newproject) {
      setProject(newproject._id);
    }
  };

  const settingAssignee = (e) => {
    const newAssignee = users.find((x) => x.name === e);

    if (newAssignee) {
      setAssignedTo(newAssignee);
      setAssignedToName(newAssignee.name);
      setAssignedToImage(newAssignee.image);
    }
  };

  const enableEditButton = () => {
    setIsEditMode(true);
  };

  const disableEditButton = () => {
    setIsEditMode(false);
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
            <Form.Row className="align-items-center mb-2">
              <Col>
                <Row>
                  <h5>
                    <Badge className="font-weight-bold mr-2" variant="info">
                      Bug Tracking
                    </Badge>
                  </h5>

                  {!isEditMode ? (
                    <h5>
                      {bug.priority === 'High' ? (
                        <Badge
                          className="font-weight-bold mr-2"
                          variant="danger"
                        >
                          High Priority
                        </Badge>
                      ) : bug.priority === 'Normal' ? (
                        <Badge
                          className="font-weight-bold mr-2"
                          variant="warning"
                        >
                          Normal Priority
                        </Badge>
                      ) : (
                        <Badge
                          className="font-weight-bold mr-2"
                          variant="primary"
                        >
                          Low Priority
                        </Badge>
                      )}
                    </h5>
                  ) : (
                    <Col xs="auto">
                      <Form.Control
                        as="select"
                        size="sm"
                        className="font-weight-bold my-1 mr-sm-2"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        custom
                      >
                        <option value="Low">Low Priority</option>
                        <option value="Normal">Normal Priority</option>
                        <option value="High">High Priority</option>
                      </Form.Control>
                    </Col>
                  )}

                  <h5>
                    {bug.resolvedAt ? (
                      <Badge
                        className="font-weight-bold mr-2"
                        variant="success"
                      >
                        CLOSED
                      </Badge>
                    ) : Date.parse(bug.resolvedBy) > Date.now() ? (
                      <Badge
                        className="font-weight-bold mr-2"
                        variant="primary"
                      >
                        OPEN
                      </Badge>
                    ) : (
                      <Badge className="font-weight-bold mr-2" variant="danger">
                        OVERDUE
                      </Badge>
                    )}
                  </h5>
                </Row>
              </Col>

              <Col xs="auto">
                {!isEditMode ? (
                  <Button
                    className="mr-2"
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => enableEditButton()}
                  >
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button
                      className="mr-2"
                      type="button"
                      variant="primary"
                      size="sm"
                    >
                      OK
                    </Button>
                    <Button
                      className="mr-2"
                      type="submit"
                      variant="primary"
                      size="sm"
                      onClick={() => disableEditButton()}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Col>
            </Form.Row>

            <Form.Row className="align-items-center mb-3">
              <Col>
                <i className="far fa-clock fa-lg mr-2"></i>
                <Moment format="MM/DD/YYYY  hh:mm A">{Date.now()}</Moment>
              </Col>
              <Col xs="auto">
                <Form.Label className="font-weight-bold mr-2">
                  Assignee:
                </Form.Label>
                <Image
                  className="mr-2"
                  src={
                    assignedTo
                      ? assignedToImage
                      : '/images/profiles/profile1.png'
                  }
                  width="35"
                  height="35"
                  roundedCircle
                />
              </Col>
              <Col xs="auto">
                {assignedTo || isEditMode ? (
                  <Form.Control
                    as="select"
                    className="my-1 mr-sm-2 text-dark"
                    value={assignedToName}
                    onChange={(e) => settingAssignee(e.target.value)}
                    disabled={!isEditMode}
                    custom
                  >
                    {users
                      ? users
                          //.filter((user) => !user.isManager)

                          .map((user) => (
                            <option key={user._id}>{user.name}</option>
                          ))
                      : ''}
                  </Form.Control>
                ) : (
                  <Badge className="font-weight-bold" variant="warning">
                    PENDING
                  </Badge>
                )}
              </Col>
            </Form.Row>

            <hr />

            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name">
                <Form.Row>
                  <Form.Label column lg={2} className="font-weight-bold mr-2">
                    Project:
                  </Form.Label>
                  <Col>
                    <Form.Control
                      as="select"
                      className="my-1 mr-sm-2 text-dark "
                      disabled={!isEditMode}
                      value={project.name}
                      onChange={(e) => settingProject(e.target.value)}
                      custom
                    >
                      {projects.map((project) => (
                        <option key={project._id}>{project.name}</option>
                      ))}
                    </Form.Control>
                  </Col>
                </Form.Row>
              </Form.Group>

              <Form.Group controlId="project">
                <Form.Row>
                  <Form.Label column lg={2} className="font-weight-bold mr-2">
                    Issue:
                  </Form.Label>

                  <Col>
                    <Form.Control
                      type="name"
                      placeholder="Enter New Issue"
                      disabled={!isEditMode}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                  </Col>
                </Form.Row>
              </Form.Group>

              <Form.Group>
                <Form.Row>
                  <Col>
                    <Form.Label className="font-weight-bold mr-2">
                      Manager:
                    </Form.Label>
                    <Image
                      className="mr-2"
                      src={bug.project ? bug.project.managerAssigned.image : ''}
                      width="35"
                      height="35"
                      roundedCircle
                    />
                    <Form.Label className="mr-2">
                      {bug.project
                        ? bug.project.managerAssigned.name
                        : 'PENDING'}
                    </Form.Label>
                  </Col>
                  <Col xs="auto">
                    <Form.Label className="font-weight-bold mr-2">
                      Due Date:
                    </Form.Label>
                    <DatePicker
                      selected={startDate}
                      disabled={!isEditMode}
                      onChange={(date) => setStartDate(date)}
                    />
                  </Col>
                </Form.Row>
              </Form.Group>

              <hr />

              <Form.Group controlId="description">
                <Form.Row>
                  <Form.Label column lg={2} className="font-weight-bold mr-2">
                    Description:
                  </Form.Label>

                  <Col>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter description"
                      disabled={!isEditMode}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></Form.Control>
                  </Col>
                </Form.Row>
              </Form.Group>

              <Form.Group controlId="imagefile">
                <Form.Row>
                  <Col xs={'auto'}>
                    <Form.Label lg={2} className="font-weight-bold mr-2">
                      Image:
                    </Form.Label>
                  </Col>
                  <Col>
                    <a href={bug.image}>
                      <i className="fas fa-paperclip" />{' '}
                    </a>
                  </Col>
                </Form.Row>
              </Form.Group>

              <hr />
              <Form.Group controlId="trackerlogs">
                <Form.Label lg={2} className="font-weight-bold mr-2 mb-3">
                  Tracker Logs:
                </Form.Label>
                <p className="font-weight-light font-italic">
                  Created at: 2020/12/11 1:10 am by ABC
                </p>

                <p className="font-weight-light font-italic">
                  Assigned at: 2020/12/11 1:10 am by ABC
                </p>

                <p className="font-weight-light font-italic">
                  Comment at: 2020/12/11 1:10 am by ABC: This is the message
                </p>

                <p className="font-weight-light font-italic">
                  Comment at: 2020/12/11 1:10 am by ABC: This is the message
                </p>
              </Form.Group>
              <hr />

              <Form.Group controlId="comments">
                <Jumbotron className="jumboheight ">
                  <Form.Row>
                    <Col xs={'auto'}>
                      <Image
                        className="mr-2"
                        src={userInfo.image}
                        width="35"
                        height="35"
                        roundedCircle
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        className="mb-3"
                        as="textarea"
                        placeholder="Write a comment..."
                        rows={5}
                      />

                      <Button variant="outline-primary" type="submit">
                        Submit
                      </Button>
                    </Col>
                  </Form.Row>
                </Jumbotron>
              </Form.Group>

              <hr />
              <Form.Group controlId="submits">
                <Form.Row className="mt-4 ">
                  <Col></Col>
                  <Col xs={'auto'}>
                    {!isEditMode ? (
                      <Button
                        className="mr-2"
                        type="button"
                        variant="primary"
                        onClick={() => enableEditButton()}
                      >
                        Edit Tracker
                      </Button>
                    ) : (
                      <>
                        <Button
                          className="mr-2"
                          type="button"
                          variant="primary"
                          onClick={() => disableEditButton()}
                        >
                          Update
                        </Button>
                        <Button
                          className="mr-2"
                          type="submit"
                          variant="primary"
                        >
                          Cancel
                        </Button>
                      </>
                    )}

                    <Button className="mr-2" type="button" variant="success">
                      Resolved
                    </Button>
                    <Link className="btn btn-dark" to="/auth/dashboard">
                      Go Back
                    </Link>
                  </Col>
                  <Col></Col>
                </Form.Row>
              </Form.Group>
            </Form>
          </FormContainer>
        </>
      )}
    </>
  );
};

export default BugEditScreen;
