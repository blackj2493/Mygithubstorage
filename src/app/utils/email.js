// app/utils/email.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendBookingConfirmation = (booking) => {
  const msg = {
    to: 'user@example.com',
    from: 'noreply@example.com',
    subject: 'Viewing Confirmation',
    text: `Your viewing for ${booking.property} on ${booking.date} at ${booking.time} has been confirmed.`,
    html: `<p>Your viewing for ${booking.property} on ${booking.date} at ${booking.time} has been confirmed.</p>`,
  };
  return sgMail.send(msg);
};

module.exports = { sendBookingConfirmation };