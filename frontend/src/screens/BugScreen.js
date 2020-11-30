import React, { useState, useEffect } from 'react';
import { Row, Col, Image, ListGroup } from 'react-bootstrap';
import CommentBox from '../components/CommentBox';
import axios from 'axios';

const BugScreen = ({ match }) => {
  const [bug, setBug] = useState({});

  useEffect(() => {
    const fetchBug = async () => {
      const { data } = await axios.get(`/api/bugs/${match.params.id}`);

      setBug(data);
    };
    fetchBug();
  }, [match]);

  return (
    <>
      <Row>
        <Col>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Image
                className="mr-2"
                src="/images/profiles/profile2.jpg"
                width="35"
                height="35"
                roundedCircle
              />
              My Name
              {'       '}
              <i className="far fa-clock fa-lg ml-4 mr-1"></i>
              {Date.now()}
            </ListGroup.Item>

            <ListGroup.Item>
              <Row>
                <span class="badge badge-pill badge-light">Bug Tracking</span>

                {bug.Priority === 'High' ? (
                  <span class="badge badge-danger">High Priority</span>
                ) : bug.Priority === 'Normal' ? (
                  <span class="badge badge-warning">Normal Priority</span>
                ) : (
                  <span class="badge badge-primary">Low Priority</span>
                )}
              </Row>
              <Row className="ex1 title1">
                <span className="font-weight-bold pt-3">{bug.name}</span>
              </Row>
            </ListGroup.Item>

            <ListGroup.Item>
              <Row className="ex1">
                <span className="font-weight-bold mr-2">Description:</span>
                <p>{bug.description}</p>
              </Row>
            </ListGroup.Item>

            <ListGroup.Item>Row1</ListGroup.Item>
            <ListGroup.Item></ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <CommentBox />
        </Col>
      </Row>
    </>
  );
};

export default BugScreen;
