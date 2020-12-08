import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { listBugDetails, updateBug } from '../actions/bugActions';
import { listProjects } from '../actions/projectActions';
import { listUsers } from '../actions/userActions';
import { BUG_UPDATE_RESET } from '../constants/bugConstants';

const BugEditScreen = ({ match, history }) => {
  const bugId = match.params.id;

  const [name, setName] = useState('');
  const [priority, setPriority] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const bugDetails = useSelector((state) => state.bugDetails);
  const { loading, error, bug } = bugDetails;

  const bugUpdate = useSelector((state) => state.bugUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = bugUpdate;

  const projectList = useSelector((state) => state.projectList);
  const { projects } = projectList;

  const userList = useSelector((state) => state.userList);
  const { users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch(listProjects());
    dispatch(listUsers());

    if (successUpdate) {
      dispatch({ type: BUG_UPDATE_RESET });
      history.push('/');
    } else {
      if (!bug.name || bug._id !== bugId) {
        dispatch(listBugDetails(bugId));
      } else {
        setName(bug.name);
        setPriority(bug.priority);
        setImage(bug.image);
        setDescription(bug.description);
      }
    }
  }, [dispatch, history, bugId, bug, successUpdate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await axios.post('/api/upload', formData, config);

      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    var dt = new Date();
    dt.setMonth(dt.getMonth() + 1);

    dispatch(
      updateBug({
        _id: bugId,
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
    const projectId = projects.find((x) => x.name === e)._id;
    setProject(projectId);
  };

  const settingAssignedTo = (e) => {
    const assignedToId = users.find((x) => x.name === e)._id;
    setAssignedTo(assignedToId);
  };

  return (
    <>
      <FormContainer>
        <h1>Edit Bug</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Issue</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter New Issue"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="priority">
              <Form.Label>Priority</Form.Label>
              <Form.Control
                as="select"
                className="my-1 mr-sm-2"
                id="inlineFormCustomSelectPref"
                onChange={(e) => setPriority(e.target.value)}
                custom
              >
                <option value="0">Choose...</option>
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="project">
              <Form.Label>Project</Form.Label>
              <Form.Control
                as="select"
                className="my-1 mr-sm-2"
                id="inlineFormCustomSelectPref"
                onChange={(e) => settingProject(e.target.value)}
                custom
              >
                <option>Choose...</option>
                {projects.map((project) => (
                  <option>{project.name}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.File
                id="image-file"
                label="Choose File"
                custom
                onChange={uploadFileHandler}
              ></Form.File>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId="assignedTo">
              <Form.Label>Assign To</Form.Label>
              <Form.Control
                as="select"
                className="my-1 mr-sm-2"
                id="inlineFormCustomSelectPref"
                onChange={(e) => settingAssignedTo(e.target.value)}
                custom
              >
                <option>Choose...</option>
                {users ? users.map((user) => <option>{user.name}</option>) : ''}
              </Form.Control>
            </Form.Group>

            <Button className="mr-2" type="submit" variant="primary">
              Update
            </Button>
            <Link className="btn btn-dark my-3" to="/">
              Go Back
            </Link>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default BugEditScreen;
