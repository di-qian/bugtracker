import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';

const Message = ({ variant, children }) => {
  const [show, setShow] = useState(true);
  //setShow(true);

  // setTimeout(() => {
  //   setShow(false);
  // }, 2000);

  return (
    <Alert
      className="mt-2"
      show={show}
      variant={variant}
      transition
      onClose={() => setShow(false)}
      dismissible
    >
      {children}
    </Alert>
  );
};

Message.defaultProps = {
  variant: 'info',
};

export default Message;
