const crypto = require('node:crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const passwordMinLength = 8;
const passwordMaxLength = 30;

const parentChildModel = require('./parentChild');

const parentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name.'],
    unique: true,
    trim: true,
  },
  verifiedEmail: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
    select: false,
  },
  email: {
    type: String,
    required: [true, 'A user must have an email.'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Email address is not valid.'],
  },
  photo: {
    type: String,
    default: 'default-user.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'guide', 'lead-guide'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: [passwordMinLength, `Password should be more than or equal to ${passwordMinLength} characters`],
    maxlength: [passwordMaxLength, `Password should be less than or equal to ${passwordMaxLength} characters`],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      message: 'Password does not match!',
      validator: function (passConfirm) {
        return passConfirm === this.password;
      },
    },
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  active: {
    type: Boolean,
    select: false,
    default: true,
  },
});

parentSchema.methods.createEmailVerificationToken = function () {
  const emailVerificationToken = crypto.randomBytes(32).toString('hex');

  this.emailVerificationToken = crypto.createHash('sha256').update(emailVerificationToken).digest('hex');

  return emailVerificationToken;
};

parentSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

parentSchema.pre('save', async function (next) {
  // Only run if password was modified.
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  const saltCost = 12;
  this.password = await bcrypt.hash(this.password, saltCost);
  this.passwordConfirm = undefined;
  this.passwordChangedAt = Date.now() - 1e3;

  next();
});

parentSchema.methods.passwordMatch = async function (testPassword) {
  if (!testPassword) {
    return false;
  }
  return await bcrypt.compare(testPassword, this.password);
};

parentSchema.methods.signToken = function () {
  return jwt.sign({ id: this._id, role: 'parent' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

parentSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (!this.passwordChangedAt) return false;
  const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1e3, 10);
  return changedTimestamp > JWTTimestamp;
};

parentSchema.methods.createPasswordResetToken = function (expireTime) {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.passwordResetExpires = Date.now() + expireTime * 60 * 1000;

  return resetToken;
};

parentSchema.virtual('children', {
  ref: 'ParentChild',
  localField: '_id',
  foreignField: 'parent_id',
});

parentSchema.set('toObject', { virtuals: true });

parentSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  },
});

const Parent = mongoose.model('Parent', parentSchema);

module.exports = Parent;
