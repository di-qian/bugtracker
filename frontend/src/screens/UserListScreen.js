import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import { listUsers, deleteUser } from '../actions/userActions';
import { getScreenName } from '../actions/screenActions';
import {
  SCREEN_NAME_RESET,
  USER_LIST_PAGE,
} from '../constants/screenConstants';

const UserListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users, page, pages } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(getScreenName(USER_LIST_PAGE));
      dispatch(listUsers(pageNumber));
    } else {
      history.push('/auth/fail');
    }
  }, [dispatch, history, successDelete, userInfo, pageNumber]);

  useEffect(() => {
    return () => {
      dispatch({ type: SCREEN_NAME_RESET });
    };
  }, []);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure')) {
      dispatch(deleteUser(id));
    }
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
                          onClick={() => deleteHandler(user._id)}
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
    </>
  );
};

export default UserListScreen;
