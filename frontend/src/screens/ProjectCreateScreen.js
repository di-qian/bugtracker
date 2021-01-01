import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { listProjects, createProject } from '../actions/projectActions';
import { listUsers } from '../actions/userActions';
import { PROJECT_CREATE_RESET } from '../constants/projectConstants';
import { getScreenName } from '../actions/screenActions';
import {
  SCREEN_NAME_RESET,
  PROJECT_CREATE_PAGE,
} from '../constants/screenConstants';

const ProjectCreateScreen = ({ history }) => {
  const [name, setName] = useState('');
  const [managerAssigned, setManagerAssigned] = useState('');

  const dispatch = useDispatch();

  const projectDetails = useSelector((state) => state.projectDetails);
  const { loading, error } = projectDetails;

  const projectCreate = useSelector((state) => state.projectCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = projectCreate;

  const userList = useSelector((state) => state.userList);
  const { allusers } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo || (userInfo && !userInfo.isAdmin)) {
      history.push('/auth/fail');
    } else {
      dispatch(getScreenName(PROJECT_CREATE_PAGE));
      dispatch(listProjects());
      dispatch(listUsers());
      dispatch({ type: PROJECT_CREATE_RESET });
      if (successCreate) {
        history.push('/admin/projectlist');
      }
    }
  }, [dispatch, history, userInfo, successCreate]);

  useEffect(() => {
    return () => {
      dispatch({ type: SCREEN_NAME_RESET });
    };
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(
      createProject({
        name,
        managerAssigned,
      })
    );
  };

  const settingAssignedTo = (e) => {
    const manager_assignedTo = allusers.find((x) => x.name === e);
    if (manager_assignedTo) {
      setManagerAssigned(manager_assignedTo._id);
    } else {
      setManagerAssigned('');
    }
  };

  return (
    <>
      <FormContainer>
        <h3 className="pagetitlefont mb-3">New Project</h3>

        <hr />

        {loadingCreate && <Loader />}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label className="mr-1">Project Name</Form.Label>
              <i className="fas fa-asterisk fa-xs fh"></i>
              <Form.Control
                type="name"
                placeholder="Enter New Project Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isInvalid={errorCreate && errorCreate.name && !name}
              ></Form.Control>
              <Form.Control.Feedback
                className="tooltipposition"
                type="invalid"
                tooltip
              >
                {errorCreate && errorCreate.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="assignedTo">
              <Form.Label className="mr-1">Project Manager</Form.Label>
              <i className="fas fa-asterisk fa-xs fh"></i>
              <Form.Control
                as="select"
                className="my-1 mr-sm-2"
                onChange={(e) => settingAssignedTo(e.target.value)}
                isInvalid={
                  errorCreate && errorCreate.managerAssigned && !managerAssigned
                }
                custom
              >
                <option key="">Choose...</option>
                {allusers
                  ? allusers
                      .filter((user) => user.isManager)
                      .map((user) => (
                        <option key={user._id}>{user.name}</option>
                      ))
                  : ''}
              </Form.Control>
              <Form.Control.Feedback
                className="tooltipposition"
                type="invalid"
                tooltip
              >
                {errorCreate && errorCreate.managerAssigned}
              </Form.Control.Feedback>
            </Form.Group>

            <Button className="mr-2" type="submit" variant="primary">
              Add
            </Button>
            <Link className="btn btn-dark my-3" to="/admin/projectlist">
              Go Back
            </Link>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProjectCreateScreen;
