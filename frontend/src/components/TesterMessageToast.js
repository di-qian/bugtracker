import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Toast } from 'react-bootstrap';

const TesterMessageToast = () => {
  const [showA, setShowA] = useState(true);
  const toggleShowA = () => setShowA(!showA);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  return (
    <div className="mb-4">
      <Toast className="toastwidth" show={showA} onClose={toggleShowA}>
        <Toast.Header>
          <i class="fas fa-sticky-note mr-2"></i>
          <strong className="mr-auto">Note to Tester</strong>
          {/* <small>11 mins ago</small> */}
        </Toast.Header>
        <Toast.Body>
          {!userInfo ? (
            <>
              <p>
                Login as regular team member: <br />
                Email: johndoe@xyz.com <br />
                Password: 123456 <br />
              </p>
              <p>
                Key features: <br />
                - create new bug report, <br />
                - edit existing bug report, <br />
                - edit user profile, <br />
              </p>
              <hr />
              <p>
                Login as project manager: <br />
                Email: joeschmoe@xyz.com <br />
                Password: 123456 <br />
              </p>
              <p>
                Key features: <br />
                - all team member capabilities, <br />
                - designate assignee for a bug, <br />
              </p>
              <hr />
              <p>
                Login as web admin: <br />
                Email: admin@xyz.com <br />
                Password: 123456 <br />
              </p>
              <p>
                Key features: <br />
                - all team member capabilities, <br />
                - create/edit/delete users, <br />
                - create/edit/delete project, <br />
              </p>
            </>
          ) : userInfo.isAdmin ? (
            <p>You are logged in as an admin</p>
          ) : userInfo.isManager ? (
            <p>You are logged in as an manager</p>
          ) : (
            <p>You are logged in as an team member</p>
          )}
        </Toast.Body>
      </Toast>

      {/* <Col xs={6}>
        <Button onClick={toggleShowA}>
          Toggle Toast <strong>with</strong> Animation
        </Button>
      </Col> */}
      {/* <Col xs={6} className="my-1">
        <Toast onClose={toggleShowB} show={showB} animation={false}>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded mr-2"
              alt=""
            />
            <strong className="mr-auto">Bootstrap</strong>
            <small>11 mins ago</small>
          </Toast.Header>
          <Toast.Body>Woohoo, you're reading this text in a Toast!</Toast.Body>
        </Toast>
      </Col>
      <Col xs={6}>
        <Button onClick={toggleShowB}>
          Toggle Toast <strong>without</strong> Animation
        </Button>
      </Col> */}
    </div>
  );
};

export default TesterMessageToast;
