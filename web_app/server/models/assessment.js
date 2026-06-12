const mongoose = require('mongoose');

const ChildModel = require('./child');

const cascadeDeletePlugin = require('./plugins/cascadeDeletePlugin');

const assessmentSchema = new mongoose.Schema(
  {
    child_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Child',
      required: true,
    },
    status: {
      type: String,
      enum: ['completed', 'in-progress'],
      required: true,
      default: 'in-progress',
    },
    active_in: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
  },
  { timestamps: true },
);

assessmentSchema.virtual('report', {
  ref: 'DailyReport',
  localField: '_id',
  foreignField: 'assessment_id',
  justOne: true,
});

assessmentSchema.virtual('tests', {
  ref: 'AssessmentTest',
  localField: '_id',
  foreignField: 'assessment_id',
});

assessmentSchema.set('toObject', { virtuals: true });

assessmentSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

assessmentSchema.plugin(cascadeDeletePlugin, [
  { modelName: 'DailyReport', foreignKey: 'assessment_id' },
  { modelName: 'AssessmentTest', foreignKey: 'assessment_id' },
]);

module.exports = mongoose.model('Assessment', assessmentSchema);
