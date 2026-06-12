const mongoose = require('mongoose');
const { Schema } = mongoose;

const ParentModel = require('./parent');
const ChildModel = require('./child');

const parentChildSchema = new Schema({
  parent_id: {
    type: Schema.Types.ObjectId,
    ref: 'Parent',
    required: true,
  },
  child_id: {
    type: Schema.Types.ObjectId,
    ref: 'Child',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'denied'],
    default: 'pending',
  },
  is_owner: {
    type: Boolean,
    required: true,
    default: false,
  },
});

parentChildSchema.index({ parent_id: 1, child_id: 1 }, { unique: true });

parentChildSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.child = ret.child_id;
    delete ret._id;
    delete ret.child_id;
    delete ret.parent_id;
    delete ret.id;
    delete ret.status;
    delete ret.__v;
  },
});

const ParentChild = mongoose.model('ParentChild', parentChildSchema);

module.exports = ParentChild;
