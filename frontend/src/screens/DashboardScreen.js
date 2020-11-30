import React, { useState, useEffect } from 'react';
import { Row, Table, Badge } from 'react-bootstrap';
import axios from 'axios';

const DashboardScreen = () => {
  const [bugs, setBugs] = useState([]);

  useEffect(() => {
    const fetchBugs = async () => {
      const { data } = await axios.get('/api/bugs');
      setBugs(data);
    };
    fetchBugs();
  }, []);

  return (
    <>
      <h1>Latest Bugs</h1>
      <Row>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
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
                <td>{bug._id}</td>
                <td>{bug.project}</td>
                <td>{bug.name}</td>
                <td>
                  {console.log(
                    Date.parse(JSON.stringify(bug.resolvedBy)) +
                      ' ' +
                      Date.now()
                  )}
                  {bug.resolvedAt ? (
                    <Badge variant="success">CLOSED</Badge>
                  ) : Date.parse(JSON.stringify(bug.resolvedBy)) >
                    Date.now() ? (
                    <Badge variant="primary">OPEN</Badge>
                  ) : (
                    <Badge variant="danger">OVERDUE</Badge>
                  )}
                </td>
                <td>{bug.createdAt}</td>
                <td>{bug.resolvedBy}</td>
                <td>
                  {bug.Priority === 'High' ? (
                    <i className="fas fa-bolt fh" />
                  ) : bug.Priority === 'Normal' ? (
                    <i className="fas fa-bolt fn" />
                  ) : (
                    <i className="fas fa-bolt fl" />
                  )}
                </td>
                <td>{bug.assignedTo}</td>
                <td>
                  <a href={`/bug/${bug._id}`}>
                    <i className="fas fa-ellipsis-v"></i>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </>
  );
};

export default DashboardScreen;
