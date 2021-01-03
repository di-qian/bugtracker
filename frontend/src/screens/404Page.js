import React from 'react';
import { useSelector } from 'react-redux';

const NoMatch = ({ history }) => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  return (
    <div style={{ marginLeft: '10px' }}>
      <h2>404 Page</h2>
      <p>
        Redirect to{' '}
        <span
          style={{ color: 'dodgerblue', cursor: 'pointer' }}
          onClick={() => history.push('/')}
        >
          {userInfo ? ' Dashboard' : ' Home Page'}
        </span>
      </p>
    </div>
  );
};

export default NoMatch;
