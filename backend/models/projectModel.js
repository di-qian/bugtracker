import mongoose from 'mongoose';

const projectSchema = mongoose.Schema({
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  ],
  managerAssigned: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
