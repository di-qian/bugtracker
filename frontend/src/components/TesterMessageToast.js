import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Toast } from 'react-bootstrap';
import ToastMessage from './ToastMessage';

const TesterMessageToast = () => {
  const [showA, setShowA] = useState(true);
  const [user, setUser] = useState('');

  const toggleShowA = () => setShowA(!showA);

  const screenName = useSelector((state) => state.screenName);
  const { screen } = screenName;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      setUser(userInfo);
    }
  }, [userInfo]);

  return (
    <div className="mb-4">
      <Toast className="toastwidth" show={showA} onClose={toggleShowA}>
        <Toast.Header>
          <i className="fas fa-sticky-note mr-2"></i>
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
          ) : (
            <>
              {userInfo.isAdmin ? (
                <p>You are logged in as an admin.</p>
              ) : userInfo.isManager ? (
                <p>You are logged in as a manager.</p>
              ) : (
                <p>You are logged in as a team member.</p>
              )}
              <ToastMessage curr_page={screen} lg_user={user} />
            </>
          )}
        </Toast.Body>
      </Toast>
    </div>
  );
};

export default TesterMessageToast;
