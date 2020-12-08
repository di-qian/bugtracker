import React, { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Table, Badge, Button } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listBugs, deleteBug, createBug } from '../actions/bugActions';
import { BUG_CREATE_RESET } from '../constants/bugConstants';

const DashboardScreen = ({ history }) => {
  const [showTable, setShowTable] = useState('');
  const dispatch = useDispatch();

  const bugList = useSelector((state) => state.bugList);
  const { loading, error, bugs } = bugList;

  const bugDelete = useSelector((state) => state.bugDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = bugDelete;

  const bugCreate = useSelector((state) => state.bugCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    bug: createdBug,
  } = bugCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: BUG_CREATE_RESET });

    if (!userInfo.isAdmin) {
      setShowTable('hide trwidth');
    } else {
      setShowTable('');
    }

    if (successCreate) {
      history.push(`/bug/${createdBug._id}/edit`);
    } else {
      dispatch(listBugs());
    }
  }, [dispatch, history, userInfo, successDelete, successCreate, createdBug]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure')) {
      dispatch(deleteBug(id));
    }
  };

  const createBugHandler = () => {
    dispatch(createBug());
  };

  return (
    <>
      <h1>Latest Bugs</h1>
      <Row>
        <Button className="my-3" onClick={createBugHandler}>
          <i className="fas fa-plus"></i> New Issue
        </Button>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Project</th>
                <th>Bug Title</th>
                <th>Staus</th>
                <th>Created At</th>
                <th>Due</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>
                  <i className="fas fa-ellipsis-v"></i>
                </th>
              </tr>
            </thead>
            <tbody>
              {bugs.map((bug) => (
                <tr key={bug._id}>
                  <td>{bug.project.name}</td>
                  <td>{bug.name}</td>
                  <td>
                    {bug.resolvedAt ? (
                      <Badge variant="success">CLOSED</Badge>
                    ) : Date.parse(bug.resolvedBy) > Date.now() ? (
                      <Badge variant="primary">OPEN</Badge>
                    ) : (
                      <Badge variant="danger">OVERDUE</Badge>
                    )}
                  </td>
                  <td>
                    <Moment format="YYYY-MM-DD">{bug.createdAt}</Moment>
                  </td>
                  <td>
                    <Moment format="YYYY-MM-DD">{bug.resolvedBy}</Moment>
                  </td>
                  <td>
                    {bug.priority === 'High' ? (
                      <i className="fas fa-bolt fh" />
                    ) : bug.priority === 'Normal' ? (
                      <i className="fas fa-bolt fn" />
                    ) : (
                      <i className="fas fa-bolt fl" />
                    )}
                  </td>
                  <td>{bug.assignedTo.name}</td>
                  <td>
                    <a href={`/bug/${bug._id}`}>
                      <i className="fas fa-ellipsis-v"></i>
                    </a>
                  </td>

                  <td className={showTable}>
                    {/* <LinkContainer to={`/admin/bug/${bug._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer> */}
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
        </Row>
      )}
    </>
  );
};

export default DashboardScreen;
