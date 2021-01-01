import React, { useEffect } from 'react';
import Moment from 'react-moment';
import { Carousel, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from './Loader';
import Message from './Message';
import { listBugs } from '../actions/bugActions';

const HomeCarousel = () => {
  const dispatch = useDispatch();

  const bugList = useSelector((state) => state.bugList);
  const { loading, error, bugs } = bugList;

  useEffect(() => {
    dispatch(listBugs());
  }, [dispatch]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <Carousel pause="hover" interval={5000}>
        {bugs.map((bug) => (
          <Carousel.Item key={bug._id}>
            <img className="d-block img-fluid" src="/images/slide.png" alt="" />

            <Carousel.Caption>
              <p>{<Moment format="MM/DD/YYYY">{bug.createdAt}</Moment>}</p>
              <p>
                <b>New Issue: </b> {bug.name}
              </p>

              <p>
                <b>Due Date: </b>
                {<Moment format="MM/DD/YYYY">{bug.resolvedBy}</Moment>}
              </p>
              <p className="vertalign">
                <b>Assigned To: </b>
                {bug.assignedTo ? (
                  bug.assignedTo.name
                ) : (
                  <Badge variant="warning">PENDING</Badge>
                )}
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
};

export default HomeCarousel;
