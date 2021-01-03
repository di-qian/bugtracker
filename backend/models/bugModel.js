import mongoose from 'mongoose';

const commentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '/images/profiles/defaultprofile.png',
    },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const bugSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    priority: {
      type: String,
      required: true,
    },
    resolvedBy: {
      type: Date,
      required: true,
    },
    resolvedAt: {
      type: Date,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

const Bug = mongoose.model('Bug', bugSchema);

export default Bug;
