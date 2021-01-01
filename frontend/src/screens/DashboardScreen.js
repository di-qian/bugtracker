import React, { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Table, Badge, Button } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import { listBugs, deleteBug } from '../actions/bugActions';
import { getScreenName } from '../actions/screenActions';
import { BUG_CREATE_RESET } from '../constants/bugConstants';
import {
  SCREEN_NAME_RESET,
  DASHBOARD_PAGE,
} from '../constants/screenConstants';

const DashboardScreen = ({ history, match }) => {
  const keyword = match.params.keyword;

  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const bugList = useSelector((state) => state.bugList);
  const { loading, error, bugs, page, pages } = bugList;

  const bugDelete = useSelector((state) => state.bugDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = bugDelete;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push('/auth/fail');
    } else {
      dispatch(getScreenName(DASHBOARD_PAGE));
      dispatch({ type: BUG_CREATE_RESET });
      dispatch(listBugs(keyword, pageNumber));
    }
  }, [dispatch, history, userInfo, successDelete, keyword, pageNumber]);

  useEffect(() => {
    return () => {
      dispatch({ type: SCREEN_NAME_RESET });
    };
  }, []);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure')) {
      dispatch(deleteBug(id));
    }
  };

  const createBugHandler = () => {
    history.push('/auth/bug/create');
  };

  return (
    <>
      <h3 className="pagetitlefont">Latest Bugs</h3>

      <Button className="my-3" onClick={createBugHandler}>
        <i className="fas fa-plus"></i> New Issue
      </Button>

      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="display-project">Project</th>
                <th className="display-summary">Bug Summary</th>
                <th className="display-status">Staus</th>
                <th className="display-createdAt">Created On</th>
                <th className="display-resolvedBy">Due On</th>
                <th className="display-priority">Priority</th>
                <th className="display-assignedTo">Assignee</th>
                <th className="display-edit">
                  <i className="fas fa-list-ul"></i>
                </th>
                <th className={userInfo && !userInfo.isAdmin && 'hideAdmin'}>
                  Del
                </th>
              </tr>
            </thead>
            <tbody>
              {bugs.map((bug) => (
                <tr key={bug._id}>
                  <td className="display-project">{bug.project.name}</td>
                  <td className="display-summary">{bug.name}</td>
                  <td className="display-status">
                    {bug.resolvedAt ? (
                      <Badge variant="success">CLOSED</Badge>
                    ) : Date.parse(bug.resolvedBy) > Date.now() ? (
                      <Badge variant="primary">OPEN</Badge>
                    ) : (
                      <Badge variant="danger">OVERDUE</Badge>
                    )}
                  </td>
                  <td className="display-createdAt">
                    <Moment format="MM/DD/YYYY">{bug.createdAt}</Moment>
                  </td>
                  <td className="display-resolvedBy">
                    <Moment format="MM/DD/YYYY">{bug.resolvedBy}</Moment>
                  </td>
                  <td className="display-priority">
                    {bug.priority === 'High' ? (
                      <i className="fas fa-bolt fh"> High</i>
                    ) : bug.priority === 'Normal' ? (
                      <i className="fas fa-bolt fn"> Normal</i>
                    ) : (
                      <i className="fas fa-bolt fl"> Low</i>
                    )}
                  </td>
                  <td className="display-assignedTo">
                    {bug.assignedTo ? (
                      bug.assignedTo.name
                    ) : (
                      <Badge variant="warning">PENDING</Badge>
                    )}
                  </td>
                  <td className="display-edit">
                    <a href={`/auth/bug/edit/${bug._id}`}>
                      <i className="fas fa-list-ul"></i>
                    </a>
                  </td>

                  <td className={userInfo.isAdmin ? '' : 'hideAdmin'}>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(bug._id)}
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
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  );
};

export default DashboardScreen;
