const mongoose = require('mongoose');

const AssessmentModel = require('./assessment');
const TestModel = require('./test');
const FileService = require('../services/FileService');

const assessmentTestSchema = new mongoose.Schema({
  assessment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
  },
  test_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
  },
  isCompleted: {
    type: mongoose.Schema.Types.Boolean,
    default: false,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy',
    required: true,
  },
  rawData: {
    type: mongoose.Schema.Types.Mixed,
  },
  results: {
    metrics: {
      type: mongoose.Schema.Types.Mixed,
    },

    difficultyAction: {
      type: String,
      enum: ['level_down', 'maintain', 'level_up'],
    },
  },

  starsEarned: {
    type: mongoose.Schema.Types.Number,
    default: 0,
  },
});

assessmentTestSchema.index({ assessment_id: 1, test_id: 1 }, { unique: true });

assessmentTestSchema.pre(/^find/, function (next) {
  if (this.getOptions().skipAutoPopulate) return next();

  this.populate({ path: 'test_id' });
  next();
});

assessmentTestSchema.pre('deleteMany', async function (next) {
  const filter = this.getFilter();
  const session = this.options?.session || this.$session?.();

  try {
    const testsToDelete = await this.model.find(filter).session(session);

    if (!testsToDelete || testsToDelete.length === 0) return next();

    const deleteFilePromises = testsToDelete.map((test) => {
      const imageName = test.rawData?.image;

      if (imageName) {
        console.log(imageName);

        return FileService.deleteFile(imageName);
      }

      return Promise.resolve();
    });

    await Promise.allSettled(deleteFilePromises);

    next();
  } catch (error) {
    next(error);
  }
});

assessmentTestSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.test = ret.test_id;

    delete ret.test_id;
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model('AssessmentTest', assessmentTestSchema);
