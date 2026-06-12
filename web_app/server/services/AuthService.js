const mailer = require('../utils/email');

class AuthService {
  sendAuthToken(parent, statusCode, res) {
    const token = parent.signToken();

    // Strip password from the serialised document before sending
    parent.password = undefined;

    res.status(statusCode).json({
      status: 'success',
      token,
      data: { parent },
    });
  }

  async sendEmailVerification(parent) {
    const emailVerificationToken = parent.createEmailVerificationToken();

    await parent.save({ validateBeforeSave: false });

    // Email failures won't crash the signup flow
    mailer.sendEmailVerificationToken(parent, emailVerificationToken).catch((e) => {});
  }
}

module.exports = new AuthService();
