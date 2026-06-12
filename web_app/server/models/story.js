const mongoose = require('mongoose');

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['happiness', 'anxiety_depression', 'anger_aggression'],
    },
    filePath: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    cover: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Story', storySchema);
