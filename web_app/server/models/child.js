const mongoose = require('mongoose');
const { Schema } = mongoose;
const parentChildModel = require('./parentChild');
const { customAlphabet } = require('nanoid');
const cascadeDeletePlugin = require('./plugins/cascadeDeletePlugin');

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 8);

const minAge = 1;
const maxAge = 12;

const childSchema = new Schema({
  name: {
    type: String,
    required: true,
    match: [
      /^[a-zA-Z]([a-zA-Z_]* ?[a-zA-Z_]+)*$/,
      'Name should:\n- Start with a letter\n- Have Only letters and _\n- Have No double spaces',
    ],
  },
  age: {
    type: Number,
    required: true,
    min: [minAge, `Age must be at least ${minAge}`],
    max: [maxAge, `Age cannot be greater than ${maxAge}`],
  },
  share_code: {
    type: String,
    default: () => nanoid(8),
    unique: true,
  },
  gender: {
    type: String,
    required: true,
    enum: {
      values: ['M', 'F'],
      message: '{VALUE} is not a valid gender (Must be M or F)',
    },
  },
  photo: {
    type: String,
    required: true,
  },
  num_of_stars: {
    type: Number,
    default: 0,
  },
  last_active: {
    type: Date,
    default: null,
  },
});

childSchema.virtual('parents', {
  ref: 'ParentChild',
  localField: '_id',
  foreignField: 'child_id',
});

childSchema.set('toObject', { virtuals: true });

childSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

childSchema.plugin(cascadeDeletePlugin, [
  { modelName: 'ParentChild', foreignKey: 'child_id' },
  { modelName: 'OverallReport', foreignKey: 'child_id' },
  { modelName: 'Assessment', foreignKey: 'child_id' },
  { modelName: 'ChatSession', foreignKey: 'childId' },
]);

const Child = mongoose.model('Child', childSchema);

module.exports = Child;
