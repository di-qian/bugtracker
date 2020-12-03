import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
    isManager: false,
  },
  {
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
    isManager: true,
  },
  {
    name: 'Larmar Jackson',
    email: 'larmarjackson@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
    isManager: true,
  },
  {
    name: 'Jane Doe',
    email: 'janedoe@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
    isManager: true,
  },
  {
    name: 'Aaron Roger',
    email: 'aaronroger@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
    isManager: false,
  },
  {
    name: 'John Smith',
    email: 'johnsmith@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
    isManager: false,
  },
  {
    name: 'Jane Smith',
    email: 'janesmith@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
    isManager: false,
  },
];

export default users;
