import React, { useEffect } from 'react';
import Moment from 'react-moment';
import { Carousel, Image } from 'react-bootstrap';
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
    <Carousel pause="hover" interval="7500" className="groupposition mb-4">
      {bugs.map((bug) => (
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/slide.png"
            alt="First slide"
          />
          <Carousel.Caption>
            <p>Bug Summary: {bug.name}</p>
            <p>
              Created On: {<Moment format="MM/DD/YYYY">{bug.createdAt}</Moment>}
            </p>
            <p>Created By: {bug.createdBy.name}</p>
            <p>
              Due Date: {<Moment format="MM/DD/YYYY">{bug.resolvedBy}</Moment>}
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
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
