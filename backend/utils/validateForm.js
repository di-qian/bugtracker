import Validator from 'validator';
import isEmpty from 'is-empty';

const validateRegisterInput = (data) => {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions

  data.name = !isEmpty(data.name) ? data.name : '';
  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  data.email = !isEmpty(data.email) ? data.email : '';
  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  data.password = !isEmpty(data.password) ? data.password : '';
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  data.confirmPassword = !isEmpty(data.confirmPassword)
    ? data.confirmPassword
    : '';
  if (Validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = 'Confirm password field is required';
  }

  if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validateProfileInput = (data) => {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions

  data.name = !isEmpty(data.name) ? data.name : '';
  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  data.email = !isEmpty(data.email) ? data.email : '';
  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (data.password) {
    data.password = !isEmpty(data.password) ? data.password : '';
    //   if (Validator.isEmpty(data.password)) {
    //     errors.password = 'Password field is required';
    //   }
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
      errors.password = 'Password must be at least 6 characters';
    }
  }

  data.confirmPassword = !isEmpty(data.confirmPassword)
    ? data.confirmPassword
    : '';
  //   if (Validator.isEmpty(data.confirmPassword)) {
  //     errors.confirmPassword = 'Confirm password field is required';
  //   }

  if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validateLoginInput = (data) => {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }
  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validateNewBugInput = (data) => {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : '';
  data.description = !isEmpty(data.description) ? data.description : '';
  data.priority = !isEmpty(data.priority) ? data.priority : '';
  data.project = !isEmpty(data.project) ? data.project : '';

  // Bug name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = 'Issue field is required';
  }

  // Bug description checks
  if (Validator.isEmpty(data.description)) {
    errors.description = 'Description is required';
  }

  // Bug priority checks
  if (Validator.isEmpty(data.priority)) {
    errors.priority = 'Priority is required';
  }

  // Bug project checks
  if (Validator.isEmpty(data.project)) {
    errors.project = 'Project is required';
  }
  return {
    errors,
    //isValid: isEmpty(errors),
  };
};

const validateEditBugInput = (data) => {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : '';
  data.description = !isEmpty(data.description) ? data.description : '';

  // Bug name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = 'Summary field is required';
  }

  // Bug description checks
  if (Validator.isEmpty(data.description)) {
    errors.description = 'Description is required';
  }

  let date = new Date(data.resolvedBy); // some mock date
  let milliseconds = date.getTime();
  console.log(milliseconds + ' ' + Date.now());
  if (milliseconds < Date.now()) {
    console.log('here12');
    errors.duedate = 'Invalid due date';
  }

  return {
    errors,
    //isValid: isEmpty(errors),
  };
};

const validateNewProjectInput = (data) => {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : '';
  data.managerAssigned = !isEmpty(data.managerAssigned)
    ? data.managerAssigned
    : '';

  // Project name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = 'Project name is required';
  }

  // Project manager assigned checks
  if (Validator.isEmpty(data.managerAssigned)) {
    errors.managerAssigned = 'Project manager is required';
  }

  return {
    errors,
    //isValid: isEmpty(errors),
  };
};

const validateEditProjectInput = (data) => {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : '';

  // Project name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = 'Project name is required';
  }

  return {
    errors,
    //isValid: isEmpty(errors),
  };
};

export {
  validateRegisterInput,
  validateProfileInput,
  validateLoginInput,
  validateEditBugInput,
  validateNewBugInput,
  validateNewProjectInput,
  validateEditProjectInput,
};
