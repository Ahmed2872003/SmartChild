const mongoose = require('mongoose');

const TestModel = require('./test');

const testDescSchema = new mongoose.Schema({
  test_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },

  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },

  config: { type: mongoose.Schema.Types.Mixed, default: {} },
});

testDescSchema.set('toObject', { virtuals: true });

testDescSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.test_id;
    delete ret.__v;
  },
});

const TestDesc = mongoose.model('TestDesc', testDescSchema);

module.exports = TestDesc;
