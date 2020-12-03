import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import bugs from './data/bugs.js';
import projects from './data/projects.js';
import Bug from './models/bugModel.js';
import Project from './models/projectModel.js';
import User from './models/userModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Bug.deleteMany();
    await Project.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);

    const managerUser = createdUsers[1]._id;

    const memberUser = createdUsers[5]._id;

    const memberUsers = [createdUsers[2]._id, createdUsers[3]._id];

    const sampleProjects = projects.map((project) => {
      return { ...project, managerAssigned: managerUser, members: memberUsers };
    });

    const createdProjects = await Project.insertMany(sampleProjects);

    const bugProject = createdProjects[1]._id;

    const sampleBugs = bugs.map((bug) => {
      return {
        ...bug,
        project: bugProject,
        createdBy: managerUser,
        assignedTo: memberUser,
      };
    });

    await Bug.insertMany(sampleBugs);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Bug.deleteMany();
    await Project.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
