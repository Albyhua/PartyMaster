const { Schema, Types } = require('mongoose');

const commentSchema = new Schema({
  commentId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
    required: true,
  },

  // need time for comment? maybe add notification?
});

module.exports = commentSchema;
