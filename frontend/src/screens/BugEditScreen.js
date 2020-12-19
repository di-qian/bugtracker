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
  ListGroup,
} from 'react-bootstrap';
import {
  listBugDetails,
  updateBug,
  createBugComment,
} from '../actions/bugActions';
import { BUG_CREATE_COMMENT_RESET } from '../constants/bugConstants';
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
  const [resolvedBy, setResolvedBy] = useState(new Date('1993/09/28'));
  const [resolvedAt, setResolvedAt] = useState(new Date('1993/09/28'));
  const [comment, setComment] = useState('');
  const [outgoingComment, setOutgoingComment] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditAssignee, setIsEditAssignee] = useState(false);
  const [isEditProject, setIsEditProject] = useState(false);
  const [isEditIssue, setIsEditIssue] = useState(false);
  const [isEditPriority, setIsEditPriority] = useState(false);
  const [isEditDueDate, setIsEditDueDate] = useState(false);
  const [isEditDescription, setIsEditDescription] = useState(false);
  const [isEditImage, setIsEditImage] = useState(false);

  const dispatch = useDispatch();

  const bugDetails = useSelector((state) => state.bugDetails);
  const { loading, error, bug } = bugDetails;

  const projectList = useSelector((state) => state.projectList);
  const { projects } = projectList;

  const userList = useSelector((state) => state.userList);
  const { users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const bugUpdate = useSelector((state) => state.bugUpdate);
  const {
    loading: updateLoading,
    error: updateError,
    bug: updatedBug,
    successAssigneeUpdate,
    successNameUpdate,
    successProjectUpdate,
    successPriorityUpdate,
    successDueDateUpdate,
    successDescriptionUpdate,
    successImageUpdate,
    successCommentUpdate,
    successResolvedAtUpdate,
  } = bugUpdate;

  const bugCommentCreate = useSelector((state) => state.bugCommentCreate);
  const {
    success: successBugTracker,
    loading: loadingBugTracker,
    error: errorBugTracker,
  } = bugCommentCreate;

  useEffect(() => {
    if (successBugTracker) {
      setComment('');
      dispatch({ type: BUG_CREATE_COMMENT_RESET });
    }

    if (successNameUpdate) {
      setName('');
      dispatch({ type: BUG_CREATE_COMMENT_RESET });
    }

    if (successDescriptionUpdate) {
      setDescription('');
      dispatch({ type: BUG_CREATE_COMMENT_RESET });
    }

    if (
      successDueDateUpdate ||
      successPriorityUpdate ||
      successAssigneeUpdate ||
      successProjectUpdate
    ) {
      dispatch({ type: BUG_CREATE_COMMENT_RESET });
    }

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
          }
          if (!assignedToImage) {
            setAssignedToImage(assignedTo.image);
          }
        }

        setResolvedBy(new Date(bug.resolvedBy));
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
    isEditAssignee,
    isEditProject,
    isEditIssue,
    isEditPriority,
    isEditDueDate,
    isEditDescription,
    isEditImage,
    successBugTracker,
    resolvedAt,
  ]);

  const submitHandler = (e) => {
    e.preventDefault();

    //To be added
  };

  const submitCommentHandler = () => {
    if (comment) {
      var str1 = comment;
      var str2 = 'commented: ';
      var combined_comment = str2.concat(str1);

      dispatch(createBugComment(match.params.id, { combined_comment }));
    }
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

  const settingResolvedAt = () => {
    setResolvedAt(Date.now());
    dispatch(updateBug('UPDATE_RESOLVEDAT', { ...bug, resolvedAt }));

    const combined_comment = 'assigned the task status to RESOLVED!';

    dispatch(createBugComment(match.params.id, { combined_comment }));
  };

  const enableEditButton = () => {
    setIsEditMode(true);
  };

  const disableEditButton = () => {
    setIsEditMode(false);
  };

  const enableAssigneeEditButton = () => {
    setIsEditAssignee(true);
  };

  const disableAssigneeEditButton = () => {
    dispatch(updateBug('UPDATE_ASSIGNEE', { ...bug, assignedTo }));

    const str1 = assignedTo.name;
    const str2 = 'reassigned the task to ';
    const combined_comment = str2.concat(str1) + '.';

    dispatch(createBugComment(match.params.id, { combined_comment }));
    setIsEditAssignee(false);
  };

  const enableProjectEditButton = () => {
    setIsEditProject(true);
  };

  const disableProjectEditButton = () => {
    dispatch(updateBug('UPDATE_PROJECT', { ...bug, project }));

    const newproject = projects.find((x) => x._id === project);
    if (newproject) {
      const str1 = newproject.name;
      const str2 = 'reassigned the task under project "';
      const combined_comment = str2.concat(str1) + '".';

      dispatch(createBugComment(match.params.id, { combined_comment }));
    }

    setIsEditProject(false);
  };

  const enableIssueEditButton = () => {
    setIsEditIssue(true);
  };

  const disableIssueEditButton = () => {
    dispatch(updateBug('UPDATE_NAME', { ...bug, name }));

    const combined_comment = ' updated the bug summary.';
    dispatch(createBugComment(match.params.id, { combined_comment }));
    setIsEditIssue(false);
  };

  const enablePriorityEditButton = () => {
    setIsEditPriority(true);
  };

  const disablePriorityEditButton = () => {
    dispatch(updateBug('UPDATE_PRIORITY', { ...bug, priority }));

    const str1 = priority;
    const str2 = 'updated the priority to ';
    const combined_comment = str2.concat(str1) + ' Priority.';

    dispatch(createBugComment(match.params.id, { combined_comment }));
    setIsEditPriority(false);
  };

  const enableDueDateEditButton = () => {
    setIsEditDueDate(true);
  };

  const disableDueDateEditButton = () => {
    dispatch(updateBug('UPDATE_DUEDATE', { ...bug, resolvedBy }));

    const str1 = resolvedBy;
    const str2 = 'changed the due date to ';
    const combined_comment = str2.concat(str1) + '.';

    dispatch(createBugComment(match.params.id, { combined_comment }));
    setIsEditDueDate(false);
  };

  const enableDescriptionEditButton = () => {
    setIsEditDescription(true);
  };

  const disableDescriptionEditButton = () => {
    dispatch(updateBug('UPDATE_DESCRIPTION', { ...bug, description }));

    const combined_comment = ' updated the bug description.';
    dispatch(createBugComment(match.params.id, { combined_comment }));
    setIsEditDescription(false);
  };

  const enableImageEditButton = () => {
    setIsEditImage(true);
  };

  const disableImageEditButton = () => {
    setIsEditImage(false);
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

                  <h5>
                    {bug.priority === 'High' ? (
                      <Badge className="font-weight-bold mr-2" variant="danger">
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
                {assignedTo || isEditAssignee ? (
                  <Form.Control
                    as="select"
                    className="my-1 mr-sm-2 text-dark"
                    value={assignedToName}
                    onChange={(e) => settingAssignee(e.target.value)}
                    disabled={!isEditAssignee}
                    custom
                  >
                    {users
                      ? users
                          .filter((user) => !user.isAdmin)
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
              <Col xs="auto">
                {!isEditAssignee ? (
                  <i
                    className={bug.resolvedAt ? 'hide' : 'far fa-edit fa-lg'}
                    onClick={enableAssigneeEditButton}
                  ></i>
                ) : (
                  <i
                    className="fas fa-check fa-lg"
                    onClick={disableAssigneeEditButton}
                  ></i>
                )}
              </Col>
            </Form.Row>
            {successAssigneeUpdate && (
              <Message variant="success">Assignee Updated</Message>
            )}
            <hr />

            <Form disabled onSubmit={submitHandler}>
              <Form.Group controlId="name">
                <Form.Row className="align-items-center">
                  <Form.Label column lg={2} className="font-weight-bold mr-2">
                    Project:
                  </Form.Label>
                  <Col>
                    <Form.Control
                      as="select"
                      className="my-1 mr-sm-2 text-dark "
                      disabled={!isEditProject}
                      value={project.name}
                      onChange={(e) => settingProject(e.target.value)}
                      custom
                    >
                      {projects.map((project) => (
                        <option key={project._id}>{project.name}</option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col xs="auto">
                    {!isEditProject ? (
                      <i
                        className={
                          bug.resolvedAt ? 'hide' : 'far fa-edit fa-lg'
                        }
                        onClick={enableProjectEditButton}
                      ></i>
                    ) : (
                      <i
                        className="fas fa-check fa-lg"
                        onClick={disableProjectEditButton}
                      ></i>
                    )}
                  </Col>
                </Form.Row>
                {successProjectUpdate && (
                  <Message variant="success">Project Updated</Message>
                )}
              </Form.Group>

              <Form.Group controlId="project">
                <Form.Row className="align-items-center">
                  <Form.Label column lg={2} className="font-weight-bold mr-2">
                    Summary:
                  </Form.Label>

                  <Col>
                    <Form.Control
                      type="name"
                      placeholder="Enter New Issue"
                      disabled={!isEditIssue}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                  </Col>
                  <Col xs="auto">
                    {!isEditIssue ? (
                      <i
                        className={
                          bug.resolvedAt ? 'hide' : 'far fa-edit fa-lg'
                        }
                        onClick={enableIssueEditButton}
                      ></i>
                    ) : (
                      <i
                        className="fas fa-check fa-lg"
                        onClick={disableIssueEditButton}
                      ></i>
                    )}
                  </Col>
                </Form.Row>

                {successNameUpdate && (
                  <Message variant="success">Summary Updated</Message>
                )}
              </Form.Group>

              <Form.Group controlId="priority">
                <Form.Row className="align-items-center">
                  <Form.Label column lg={2} className="font-weight-bold mr-2">
                    Priority:
                  </Form.Label>

                  <Col>
                    <Form.Control
                      as="select"
                      className="my-1 mr-sm-2 text-dark"
                      disabled={!isEditPriority}
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      custom
                    >
                      <option value="Low">Low Priority</option>
                      <option value="Normal">Normal Priority</option>
                      <option value="High">High Priority</option>
                    </Form.Control>
                  </Col>
                  <Col xs="auto">
                    {!isEditPriority ? (
                      <i
                        className={
                          bug.resolvedAt ? 'hide' : 'far fa-edit fa-lg'
                        }
                        onClick={enablePriorityEditButton}
                      ></i>
                    ) : (
                      <i
                        className="fas fa-check fa-lg"
                        onClick={disablePriorityEditButton}
                      ></i>
                    )}
                  </Col>
                </Form.Row>
                {successPriorityUpdate && (
                  <Message variant="success">Priority Updated</Message>
                )}
              </Form.Group>

              <Form.Group>
                <Form.Row className="align-items-center">
                  <Col>
                    <Form.Label className="font-weight-bold mr-2">
                      Manager:
                    </Form.Label>
                    <Image
                      className="mr-2"
                      src={
                        bug.project
                          ? bug.project.managerAssigned
                            ? bug.project.managerAssigned.image
                            : ''
                          : ''
                      }
                      width="35"
                      height="35"
                      roundedCircle
                    />
                    <Form.Label className="mr-2">
                      {bug.project
                        ? bug.project.managerAssigned
                          ? bug.project.managerAssigned.name
                          : 'PENDING'
                        : 'PENDING'}
                    </Form.Label>
                  </Col>
                  <Col xs="auto">
                    <Form.Label className="font-weight-bold mr-2">
                      Due Date:
                    </Form.Label>
                    <DatePicker
                      selected={resolvedBy}
                      disabled={!isEditDueDate}
                      onChange={(date) => setResolvedBy(date)}
                    />
                  </Col>
                  <Col xs="auto">
                    {!isEditDueDate ? (
                      <i
                        className={
                          bug.resolvedAt ? 'hide' : 'far fa-edit fa-lg'
                        }
                        onClick={enableDueDateEditButton}
                      ></i>
                    ) : (
                      <i
                        className="fas fa-check fa-lg"
                        onClick={disableDueDateEditButton}
                      ></i>
                    )}
                  </Col>
                </Form.Row>
                {successDueDateUpdate && (
                  <Message variant="success">Due Date Updated</Message>
                )}
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
                      disabled={!isEditDescription}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></Form.Control>
                  </Col>
                  <Col xs="auto">
                    {!isEditDescription ? (
                      <i
                        className={
                          bug.resolvedAt ? 'hide' : 'far fa-edit fa-lg'
                        }
                        onClick={enableDescriptionEditButton}
                      ></i>
                    ) : (
                      <i
                        className="fas fa-check fa-lg"
                        onClick={disableDescriptionEditButton}
                      ></i>
                    )}
                  </Col>
                </Form.Row>
                {successDescriptionUpdate && (
                  <Message variant="success">Description Updated</Message>
                )}
              </Form.Group>

              <Form.Group controlId="imagefile">
                <Form.Row>
                  <Col xs={'auto'}>
                    <Form.Label lg={2} className="font-weight-bold mr-2">
                      Image:
                    </Form.Label>
                  </Col>
                  <Col xs={'auto'}>
                    <a href={bug.image}>
                      <i className="fas fa-paperclip" />{' '}
                    </a>
                  </Col>
                  <Col xs="auto">
                    {!isEditImage ? (
                      <i
                        className={
                          bug.resolvedAt ? 'hide' : 'far fa-edit fa-lg'
                        }
                        onClick={enableImageEditButton}
                      ></i>
                    ) : (
                      <i
                        className="fas fa-check fa-lg"
                        onClick={disableImageEditButton}
                      ></i>
                    )}
                  </Col>
                </Form.Row>
              </Form.Group>

              <hr />
              <Form.Group controlId="trackerlogs">
                <Form.Label lg={2} className="font-weight-bold mr-2 mb-3">
                  Tracker Logs:
                </Form.Label>
                <ListGroup variant="flush">
                  {bug.comments.map((tracker) => (
                    <ListGroup.Item key={tracker._id}>
                      <p className="font-weight-light font-italic">
                        <i className="far fa-comment"></i>
                        <Moment format=" MM/DD/YYYY  hh:mm:ss A">
                          {tracker.updatedAt}
                        </Moment>
                        {', ' + tracker.name + ' ' + tracker.comment}
                      </p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
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
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={5}
                        disabled={bug.resolvedAt ? true : false}
                      />

                      <Button
                        variant="outline-primary"
                        type="submit"
                        disabled={bug.resolvedAt ? true : false}
                        onClick={() => submitCommentHandler()}
                      >
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
                    {/* {!isEditMode ? (
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
                    )} */}

                    <Button
                      className="mr-2"
                      type="button"
                      variant="success"
                      disabled={bug.resolvedAt ? true : false}
                      onClick={() => settingResolvedAt()}
                    >
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
