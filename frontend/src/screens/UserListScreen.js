import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Moment from 'react-moment';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import { listUsers, deleteUser } from '../actions/userActions';
import { getScreenName } from '../actions/screenActions';
import { createBugComment, removeBugAssignee } from '../actions/bugActions';
import {
  SCREEN_NAME_RESET,
  USER_LIST_PAGE,
} from '../constants/screenConstants';
import { BUG_CREATE_COMMENT_RESET } from '../constants/bugConstants';

const UserListScreen = ({ history, match }) => {
  const [show, setShow] = useState(false);
  const [delAssigneeBugs, setDelAssigneeBugs] = useState([]);
  const [delBugAssigneeId, setDelBugAssigneeId] = useState('');
  const [delBugAssigneeName, setDelBugAssigneeName] = useState('');

  const [delManagerProjects, setDelManagerProjects] = useState([]);

  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users, page, pages } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  const bugCommentCreate = useSelector((state) => state.bugCommentCreate);
  const { success: successBugTracker } = bugCommentCreate;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(getScreenName(USER_LIST_PAGE));
      dispatch(listUsers(pageNumber));
      if (successBugTracker) {
        dispatch({ type: BUG_CREATE_COMMENT_RESET });
      }
    } else {
      history.push('/auth/fail');
    }
  }, [
    dispatch,
    history,
    successDelete,
    userInfo,
    pageNumber,
    successBugTracker,
  ]);

  useEffect(() => {
    return () => {
      dispatch({ type: SCREEN_NAME_RESET });
    };
  }, [dispatch]);

  const listManagerProjects = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(`/api/users/${id}/projects`, config);
      if (data) {
        setDelManagerProjects(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const listAssigneebugs = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(`/api/users/${id}/bugs`, config);
      if (data) {
        setDelAssigneeBugs(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    setDelAssigneeBugs([]);
    setDelBugAssigneeName('');
    setDelBugAssigneeId('');
    setShow(false);
  };

  const handleShow = (id, name) => {
    listManagerProjects(id);

    listAssigneebugs(id);
    setDelBugAssigneeId(id);
    setDelBugAssigneeName(name);

    setShow(true);
  };

  const deleteHandler = () => {
    const str1 = 'deleted the current assignee ';
    var str2 = str1.concat(delBugAssigneeName);
    const str3 = ' from company employee list, and task is now unassigned.';
    var combined_comment = str2.concat(str3);

    delAssigneeBugs.assigneebugs &&
      delAssigneeBugs.assigneebugs.map(
        (bug) => (
          dispatch(removeBugAssignee(bug._id)),
          dispatch(createBugComment(bug._id, { combined_comment }))
        )
      );

    dispatch(deleteUser(delBugAssigneeId));

    handleClose();
  };

  const createUserHandler = () => {
    history.push('/admin/user/create');
  };

  return (
    <>
      <h3 className="pagetitlefont">User List</h3>

      <Button className="my-3" onClick={createUserHandler}>
        <i className="fas fa-plus"></i> New User
      </Button>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                {/* <th>ID</th> */}
                <th>NAME</th>
                <th>EMAIL</th>
                <th className="display-admin">ADMIN</th>
                <th className="display-manager">MANAGER</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  {/* <td>{user._id}</td> */}
                  <td>{user.name}</td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td className="display-admin">
                    {user.isAdmin ? (
                      <i
                        className="fas fa-check"
                        style={{ color: 'green' }}
                      ></i>
                    ) : (
                      <i className="fas fa-times" style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td className="display-manager">
                    {user.isManager ? (
                      <i
                        className="fas fa-check"
                        style={{ color: 'green' }}
                      ></i>
                    ) : (
                      <i className="fas fa-times" style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    {user.email !== 'admin@example.com' ? (
                      <>
                        <LinkContainer to={`/admin/user/${user._id}/edit`}>
                          <Button variant="light" className="btn-sm">
                            <i className="fas fa-edit"></i>
                          </Button>
                        </LinkContainer>

                        <Button
                          variant="danger"
                          className="btn-sm"
                          onClick={() => handleShow(user._id, user.name)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </>
                    ) : (
                      userInfo.email === 'admin@example.com' && (
                        <LinkContainer to={`/admin/user/${user._id}/edit`}>
                          <Button variant="light" className="btn-sm">
                            <i className="fas fa-edit"></i>
                          </Button>
                        </LinkContainer>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Paginate
            pages={pages}
            page={page}
            isAdmin={userInfo.isAdmin}
            cur_url={'userlist'}
          />
        </>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {' '}
            {delManagerProjects.managerprojects &&
            delManagerProjects.managerprojects.length === 0
              ? 'Confirm deleting user:'
              : 'Not able to delete user:'}{' '}
            {delBugAssigneeName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {delManagerProjects.managerprojects &&
          delManagerProjects.managerprojects.length !== 0 ? (
            <>
              The user is a manager and currently manages the following project:
              <Table striped bordered hover className="my-2">
                <tbody>
                  {delManagerProjects.managerprojects.map((project) => (
                    <tr key={project._id}>
                      <td>{project.name}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              Please go to "Manage Projects", assign new project manager for the
              projects listed above before user can be deleted.
            </>
          ) : delAssigneeBugs.assigneebugs &&
            delAssigneeBugs.assigneebugs.length !== 0 ? (
            <>
              Once deleted, the user will be unassigned from the following bugs:
              <Table striped bordered hover className="mt-2">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Bug</th>
                    <th>Created On</th>
                  </tr>
                </thead>
                <tbody>
                  {delAssigneeBugs.assigneebugs.map((bug) => (
                    <tr key={bug._id}>
                      <td>{bug.project && bug.project.name}</td>
                      <td>{bug.name}</td>
                      <td>
                        {' '}
                        <Moment format="MM/DD/YYYY">{bug.createdAt}</Moment>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          ) : (
            'Please confirm that you want to delete this user.'
          )}
        </Modal.Body>
        <Modal.Footer>
          {delManagerProjects.managerprojects &&
            delManagerProjects.managerprojects.length === 0 && (
              <Button variant="success" onClick={deleteHandler}>
                Delete
              </Button>
            )}
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserListScreen;
