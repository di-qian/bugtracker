import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Moment from 'react-moment';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Modal, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import { listProjects, deleteProject } from '../actions/projectActions';
import { deleteBug } from '../actions/bugActions';
import { getScreenName } from '../actions/screenActions';
import {
  SCREEN_NAME_RESET,
  PROJECT_LIST_PAGE,
} from '../constants/screenConstants';

const ProjectListScreen = ({ history, match }) => {
  const [show, setShow] = useState(false);
  const [delProjectBugs, setDelProjectBugs] = useState([]);
  const [delProjectId, setDelProjectId] = useState('');
  const [delProjectName, setDelProjectName] = useState('');

  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const projectList = useSelector((state) => state.projectList);
  const { loading, error, projects, page, pages } = projectList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const projectDelete = useSelector((state) => state.projectDelete);
  const { success: successDelete } = projectDelete;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(getScreenName(PROJECT_LIST_PAGE));
      dispatch(listProjects(pageNumber));
    } else {
      history.push('/auth/fail');
    }
  }, [dispatch, history, successDelete, userInfo, pageNumber]);

  useEffect(() => {
    return () => {
      dispatch({ type: SCREEN_NAME_RESET });
    };
  }, []);

  const listProjectBugs = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(`/api/projects/${id}/bugs`, config);
      if (data) {
        setDelProjectBugs(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    setDelProjectBugs([]);
    setDelProjectName('');
    setDelProjectId('');
    setShow(false);
  };

  const handleShow = (id, name) => {
    listProjectBugs(id);
    setDelProjectId(id);
    setDelProjectName(name);

    setShow(true);
  };

  const deleteHandler = () => {
    delProjectBugs.projectbugs &&
      delProjectBugs.projectbugs.map((bug) => dispatch(deleteBug(bug._id)));

    dispatch(deleteProject(delProjectId));

    handleClose();
  };

  const createProjectHandler = () => {
    history.push('/admin/project/create');
  };

  return (
    <>
      <h3 className="pagetitlefont">Project List</h3>

      <Button className="my-3" onClick={createProjectHandler}>
        <i className="fas fa-plus"></i> New Project
      </Button>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>NAME</th>
                <th className="display-manager">MANAGER</th>

                <th>Edit/Del</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id}>
                  <td>{project.name}</td>

                  <td className="display-manager">
                    {project.managerAssigned.name}
                  </td>

                  <td>
                    <LinkContainer to={`/admin/project/${project._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => handleShow(project._id, project.name)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Paginate
            pages={pages}
            page={page}
            isAdmin={userInfo.isAdmin}
            cur_url={'projectlist'}
          />
        </>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm deleting project: {delProjectName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {delProjectBugs.projectbugs &&
          delProjectBugs.projectbugs.length !== 0 ? (
            <>
              The following bugs associated with the project will also be
              deleted:
              <Table striped bordered hover className="mt-2">
                <thead>
                  <tr>
                    <th>Bug</th>
                    <th>Created On</th>
                    <th>Priority</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {delProjectBugs.projectbugs.map((bug) => (
                    <tr key={bug._id}>
                      <td>{bug.name}</td>
                      <td>
                        {' '}
                        <Moment format="MM/DD/YYYY">{bug.createdAt}</Moment>
                      </td>
                      <td>{bug.priority}</td>
                      <td>
                        {bug.resolvedAt ? (
                          <Badge variant="success">CLOSED</Badge>
                        ) : Date.parse(bug.resolvedBy) > Date.now() ? (
                          <Badge variant="primary">OPEN</Badge>
                        ) : (
                          <Badge variant="danger">OVERDUE</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          ) : (
            'Please confirm that you want to delete this project.'
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={deleteHandler}>
            Delete
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProjectListScreen;
