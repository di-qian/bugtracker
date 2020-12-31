import React, { useEffect } from 'react';
import Moment from 'react-moment';
import { Carousel, Image, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from './Loader';
import Message from './Message';
import { listBugs } from '../actions/bugActions';
import { BUG_UPDATE_ASSIGNEE_SUCCESS } from '../constants/bugConstants';

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
      <Carousel pause="hover" interval="10000" indicators="false">
        {bugs.map((bug) => (
          <Carousel.Item>
            <img class="d-block img-fluid" src="/images/slide.png" />

            <Carousel.Caption>
              <p>
                {/* <b>Created On: </b> */}
                <i>{<Moment format="MM/DD/YYYY">{bug.createdAt}</Moment>}</i>
              </p>
              <p>
                <b>New Issue: </b> {bug.name}
              </p>
              {/* <p>
                <b>Created On: </b>
                {<Moment format="MM/DD/YYYY">{bug.createdAt}</Moment>}
              </p> */}

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

{
  /*       
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="images/bugreporting2.png"
          alt="Third slide"
        />

        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="images/bugreporting3.png"
          alt="Third slide"
        />

        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item> */
}

export default HomeCarousel;
