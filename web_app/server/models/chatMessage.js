const mongoose = require('mongoose');

const { encryptText, decryptText } = require('../utils/cipher');

const chatMessageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatSession',
      required: true,
      index: true,
    },
    sender: {
      type: String,
      enum: ['parent', 'child', 'AI'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

chatMessageSchema.pre('save', function (next) {
  if (this.isModified('content') && this.content) {
    const key = process.env.ENCRYPTION_KEY;

    this.content = encryptText(key, this.content);
  }
  next();
});

const decryptDocuments = function (docs, next) {
  if (!docs) return next();

  const documents = Array.isArray(docs) ? docs : [docs];

  const key = process.env.ENCRYPTION_KEY;

  documents.forEach((doc) => {
    if (doc.content) {
      doc.content = decryptText(key, doc.content);
    }
  });

  next();
};

chatMessageSchema.post('find', decryptDocuments);
chatMessageSchema.post('findOne', decryptDocuments);

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
