const passwordResetTemplate = require('./../utils/templates/email-reset');
const emailVerificationTemplate = require('./../utils/templates/email-verification');
const { childLinkRequestTemplate } = require('./templates/child-link-request');
const { acceptedTemplate, deniedTemplate } = require('./templates/coparent-reply');
const { assessmentCompletedTemplate } = require('./templates/assessment-completion');

// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_APP_PASSWORD,
//   },
//   family: 4,
// });

// const sendEmail = async (options) => {
//   await transporter.sendMail({
//     from: '"Smart Child" <smartchildorg@gmail.com>',
//     to: options.recipientsEmail,
//     subject: options.subject,
//     html: options.html,
//   });

//   console.log('Email has been successfully sent!');
// };

const sendEmail = async (options) => {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: 'Smart Child', email: 'amohammedmorsy@gmail.com' },
        to: [{ email: options.recipientsEmail }],
        subject: options.subject,
        htmlContent: options.html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Email API rejected request: ${JSON.stringify(errorData)}`);
    }

    console.log('Email has been successfully sent via HTTP!');
  } catch (error) {
    console.error('Email Error:', error.message);
    throw error;
  }
};

exports.sendPasswordResetTokenEmail = async (user, token, expireTimeInMinutes) => {
  const options = {
    recipientsEmail: user.email,
    subject: `Password reset token (valid for ${expireTimeInMinutes} min).`,
    token: token,
    html: passwordResetTemplate(user, token),
  };

  // console.log('Password reset token: ' + token);
  await sendEmail(options);
};

exports.sendEmailVerificationToken = async (user, token) => {
  const options = {
    recipientsEmail: user.email,
    subject: 'Email verification token.',
    token: token,
    html: emailVerificationTemplate(user, token),
  };

  // console.log('Email verification token: ' + token);
  await sendEmail(options);
};

exports.sendChildLinkRequest = async (data, token) => {
  const options = {
    recipientsEmail: data.recipient.email,
    subject: 'Child access request',
    html: childLinkRequestTemplate(data.recipient.name, data.sender.name, data.sender.email, data.child.name, token),
  };

  await sendEmail(options);
};

exports.sendCoparentReply = async (action, data) => {
  const isAccepted = action === 'accept';

  const replyTemplate = isAccepted ? acceptedTemplate : deniedTemplate;

  const subject = isAccepted
    ? 'Access Granted: Read-Only Profile Access Approved'
    : 'Status Update: Your profile access request';

  const options = {
    recipientsEmail: data.user.email,
    subject,
    html: replyTemplate(data),
  };

  await sendEmail(options);
};

exports.sendAssessmentCompletionEmail = async (data) => {
  const options = {
    recipientsEmail: data.parent.email,
    subject: 'Assessment completion',
    html: assessmentCompletedTemplate(data.parent.name, data.child.name),
  };

  await sendEmail(options);
};
