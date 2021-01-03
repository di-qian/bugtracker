import React from 'react';
import { useSelector } from 'react-redux';

const NotAuthorized = ({ history }) => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  return (
    <div style={{ marginLeft: '10px' }}>
      <h2>
        {userInfo && !userInfo.isAdmin
          ? '401 Unauthorized/Admin Only'
          : '401 Unauthorized'}
      </h2>
      <p>
        Redirect to{' '}
        <span
          style={{ color: 'dodgerblue', cursor: 'pointer' }}
          onClick={() => history.push('/')}
        >
          {userInfo && !userInfo.isAdmin ? ' Dashboard' : ' Home Page'}
        </span>
      </p>
    </div>
  );
};

export default NotAuthorized;
