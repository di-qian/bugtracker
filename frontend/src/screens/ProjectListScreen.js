import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import { listProjects, deleteProject } from '../actions/projectActions';

const ProjectListScreen = ({ history, match }) => {
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
      dispatch(listProjects(pageNumber));
    } else {
      history.push('/auth/fail');
    }
  }, [dispatch, history, successDelete, userInfo, pageNumber]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure')) {
      dispatch(deleteProject(id));
    }
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
                      onClick={() => deleteHandler(project._id)}
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
    </>
  );
};

export default ProjectListScreen;
