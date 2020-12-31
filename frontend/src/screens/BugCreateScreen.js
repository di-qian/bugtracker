import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { Form, Button, Image, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { createBug } from '../actions/bugActions';
import { listProjects } from '../actions/projectActions';
import { listUsers } from '../actions/userActions';
import { BUG_CREATE_RESET } from '../constants/bugConstants';

const BugEditScreen = ({ history }) => {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageEdit, setImageEdit] = useState(false);

  const dispatch = useDispatch();

  const bugDetails = useSelector((state) => state.bugDetails);
  const { loading, error } = bugDetails;

  const bugCreate = useSelector((state) => state.bugCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = bugCreate;

  const projectList = useSelector((state) => state.projectList);
  const { projects } = projectList;

  const userList = useSelector((state) => state.userList);
  const { users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push('/auth/fail');
    } else {
      dispatch(listProjects());
      dispatch(listUsers());
      dispatch({ type: BUG_CREATE_RESET });
      if (successCreate) {
        history.push('/auth/dashboard');
      }
    }
  }, [dispatch, history, userInfo, successCreate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await axios.post('/api/upload', formData, config);

      settingImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    setImageEdit(false);

    var dt = new Date();
    dt.setMonth(dt.getMonth() + 1);

    dispatch(
      createBug({
        name,
        priority,
        image,
        description,
        createdBy: userInfo._id,
        resolvedBy: dt,
        project,
        assignedTo,
      })
    );
  };

  const settingProject = (e) => {
    const newproject = projects.find((x) => x.name === e);
    if (newproject) {
      setProject(newproject._id);
    } else {
      setProject('');
    }
  };

  const settingAssignedTo = (e) => {
    const user_assignedTo = users.find((x) => x.name === e);
    if (user_assignedTo) {
      setAssignedTo(user_assignedTo._id);
    } else {
      setAssignedTo(null);
    }
  };

  const settingImage = (e) => {
    setImage(e);
    setImageEdit(true);
  };

  return (
    <>
      <FormContainer>
        <Form.Row className="align-items-center mb-3">
          <Col sm={3} className="my-1">
            <h4>New Bug</h4>
          </Col>
          <Col sm={3} className="my-1">
            <i className="far fa-clock fa-lg mr-2"></i>

            <Moment format="YYYY-MM-DD">{Date.now()}</Moment>
          </Col>
          <Col xs="auto" className="my-1">
            <Image
              className="mr-2"
              src={
                userInfo.image
                  ? userInfo.image
                  : '/images/profiles/profile2.jpg'
              }
              width="35"
              height="35"
              roundedCircle
            />

            <Form.Label>
              <span>{userInfo.name ? userInfo.name : ''}</span>
            </Form.Label>
          </Col>
        </Form.Row>

        <hr />

        {loadingCreate && <Loader />}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label className="mr-1">Issue</Form.Label>
              <i className="fas fa-asterisk fa-xs fh"></i>
              <Form.Control
                type="name"
                placeholder="Enter New Issue"
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

            <Form.Group controlId="description">
              <Form.Label className="mr-1">Description</Form.Label>
              <i className="fas fa-asterisk fa-xs fh"></i>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                isInvalid={
                  errorCreate && errorCreate.description && !description
                }
              ></Form.Control>
              <Form.Control.Feedback
                className="tooltipposition"
                type="invalid"
                tooltip
              >
                {errorCreate && errorCreate.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="priority">
              <Form.Label className="mr-1">Priority</Form.Label>
              <i className="fas fa-asterisk fa-xs fh"></i>
              <Form.Control
                as="select"
                className="my-1 mr-sm-2"
                onChange={(e) => setPriority(e.target.value)}
                isInvalid={errorCreate && errorCreate.priority && !priority}
                custom
              >
                <option value="">Choose...</option>
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
              </Form.Control>
              <Form.Control.Feedback
                className="tooltipposition"
                type="invalid"
                tooltip
              >
                {errorCreate && errorCreate.priority}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="project">
              <Form.Label className="mr-1">Project</Form.Label>
              <i className="fas fa-asterisk fa-xs fh"></i>
              <Form.Control
                as="select"
                className="my-1 mr-sm-2"
                onChange={(e) => settingProject(e.target.value)}
                isInvalid={errorCreate && errorCreate.project && !project}
                custom
              >
                <option key="0">Choose...</option>
                {projects.map((project) => (
                  <option key={project._id}>{project.name}</option>
                ))}
              </Form.Control>
              <Form.Control.Feedback
                className="tooltipposition"
                type="invalid"
                tooltip
              >
                {errorCreate && errorCreate.project}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image url"
                value={image}
                onChange={(e) => settingImage(e.target.value)}
                isInvalid={errorCreate && errorCreate.image && !imageEdit}
              ></Form.Control>
              <Form.File
                id="image-file"
                label="Choose File"
                custom
                onChange={uploadFileHandler}
              ></Form.File>
              {uploading && <Loader />}
              <Form.Control.Feedback
                className="tooltipposition"
                type="invalid"
                tooltip
              >
                {errorCreate && errorCreate.image}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="assignedTo">
              <Form.Label>Assign To (By Manager Only)</Form.Label>
              <Form.Control
                as="select"
                className="my-1 mr-sm-2"
                onChange={(e) => settingAssignedTo(e.target.value)}
                disabled={!userInfo.isManager}
                custom
              >
                <option key="0">Choose...</option>
                {users
                  ? users
                      .filter((user) => !user.isAdmin)
                      .map((user) => (
                        <option key={user._id}>{user.name}</option>
                      ))
                  : ''}
              </Form.Control>
            </Form.Group>

            <Button className="mr-2" type="submit" variant="primary">
              Add
            </Button>
            <Link className="btn btn-dark my-3" to="/auth/dashboard">
              Go Back
            </Link>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default BugEditScreen;
