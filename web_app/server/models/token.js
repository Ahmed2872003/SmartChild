const mongoose = require('mongoose');
const crypto = require('node:crypto');
const token = require('../utils/token');

const tokenSchema = new mongoose.Schema({
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  tokenType: {
    type: String,
    enum: ['coparent_request', 'password_reset', 'email_verification'],
    required: true,
  },

  hashedToken: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // Auto-delete after 1 hour
  },
});

tokenSchema.statics.generateToken = async function (referenceId, tokenType) {
  const { rawToken, hashedToken } = token.generateToken();

  await this.create({
    referenceId: referenceId,
    tokenType: tokenType,
    hashedToken: hashedToken,
  });

  return rawToken;
};

module.exports = mongoose.model('Token', tokenSchema);
