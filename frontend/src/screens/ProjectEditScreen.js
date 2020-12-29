import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listProjectDetails, updateProject } from '../actions/projectActions';
import { PROJECT_UPDATE_RESET } from '../constants/projectConstants';
import { listUsers } from '../actions/userActions';

const ProjectEditScreen = ({ history, match }) => {
  const projectId = match.params.id;
  const [name, setName] = useState('');
  const [managerAssigned, setManagerAssigned] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [show, setShow] = useState(false);

  const dispatch = useDispatch();

  const projectDetails = useSelector((state) => state.projectDetails);
  const { loading, error, project } = projectDetails;

  const userList = useSelector((state) => state.userList);
  const { users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const projectUpdate = useSelector((state) => state.projectUpdate);
  const { success, error: errorUpdate } = projectUpdate;

  useEffect(() => {
    if (!userInfo || (userInfo && !userInfo.isAdmin)) {
      history.push('/auth/fail');
    } else {
      if (!project.name || project._id !== projectId || success) {
        setUpdateSuccess(success);
        setShow(true);
        dispatch({ type: PROJECT_UPDATE_RESET });
        dispatch(listUsers());
        dispatch(listProjectDetails(projectId));
        //history.push('/admin/projectlist');
      } else {
        if (success) {
          setUpdateSuccess(false);
        }
        setName(project.name);
        setManagerAssigned(project.managerAssigned);
      }
    }
  }, [
    dispatch,
    history,
    match,
    userInfo,
    project,
    success,
    updateSuccess,
    projectId,
  ]);

  const submitHandler = (e) => {
    e.preventDefault();
    setShow(false);
    // if (project.name) {

    dispatch(
      updateProject({
        _id: project._id,
        name,
        managerAssigned: managerAssigned._id,
      })
    );
    // } else {
    //   setMessage('No project name');
    // }
  };

  const settingAssignedTo = (e) => {
    const user_assignedTo = users.find((x) => x.name === e);
    if (user_assignedTo) {
      setManagerAssigned(user_assignedTo);
    }
  };

  return (
    <>
      <Row>
        <Col>
          <h2>Edit Project</h2>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          {updateSuccess && (
            <Alert
              variant="success"
              dismissible
              transition
              show={show}
              onClose={() => setShow(false)}
            >
              User Profile Updated
            </Alert>
          )}
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name">
                <Form.Label>Edit Project Name</Form.Label>
                <Form.Control
                  type="name"
                  placeholder="Enter new project name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  isInvalid={errorUpdate && errorUpdate.name && !name}
                ></Form.Control>
                <Form.Control.Feedback
                  className="tooltipposition"
                  type="invalid"
                  tooltip
                >
                  {console.log(errorUpdate)}
                  {errorUpdate && errorUpdate.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="managerAssignedTo">
                <Form.Label>Edit Project Manager</Form.Label>
                <Form.Control
                  as="select"
                  className="my-1 mr-sm-2"
                  onChange={(e) => settingAssignedTo(e.target.value)}
                  value={managerAssigned.name ? managerAssigned.name : ''}
                  custom
                >
                  {users
                    ? users
                        .filter((user) => user.isManager)
                        .map((user) => (
                          <option key={user._id}>{user.name}</option>
                        ))
                    : ''}
                </Form.Control>
              </Form.Group>

              <Button className="mr-2" type="submit" variant="primary">
                Update
              </Button>
              <Link className="btn btn-dark my-3" to="/admin/projectlist">
                Go Back
              </Link>
            </Form>
          )}
        </Col>
      </Row>
    </>
  );
};

export default ProjectEditScreen;
