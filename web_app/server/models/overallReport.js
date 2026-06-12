const mongoose = require('mongoose');

const ChildModel = require('./child');

const overallReportSchema = new mongoose.Schema(
  {
    child_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Child',
      required: true,
      unique: true,
    },
    overall_system_recommendation: {
      type: mongoose.Schema.Types.String,
      default: '',
    },
    overall_growth_percentage: {
      type: mongoose.Schema.Types.Number,
      min: 0,
      max: 100,
      default: 0,
    },
    overall_feeling: {
      type: mongoose.Schema.Types.String,
      enum: ['happiness', 'anxiety_depression', 'anger_aggression', 'N/A'],
      default: 'N/A',
      required: true,
    },
    color_radar_profile: {
      red: { type: mongoose.Schema.Types.Number, default: 0, min: 0, max: 100 },
      green: { type: mongoose.Schema.Types.Number, default: 0, min: 0, max: 100 },
      blue: { type: mongoose.Schema.Types.Number, default: 0, min: 0, max: 100 },
    },
  },
  { timestamps: true },
);

overallReportSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

overallReportSchema.pre('save', function (next) {
  this.last_updated = Date.now();
  next();
});

module.exports = mongoose.model('OverallReport', overallReportSchema);
