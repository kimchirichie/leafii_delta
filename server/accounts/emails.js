Accounts.emailTemplates.siteName = "Leafii";
Accounts.emailTemplates.from     = "Leafii <support@leafii.com>";

Accounts.emailTemplates.verifyEmail = {
  subject() {
    return "Leafii: Please Verify Your Account";
  },
  text( user, url ) {
    let emailAddress   = user.emails[0].address,
        urlWithoutHash = url.replace( '#/', '' ),
        supportEmail   = "support@leafii.com",
        emailBody      = `Welcome to Leafii \n\nTo verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email.\n\n If you feel something is wrong, please contact our support team: ${supportEmail}.`;

    return emailBody;
  }
};

Accounts.emailTemplates.resetPassword = {
  subject() {
    return "Leafii: Password Reset";
  },
  text( user, url ) {
    let emailAddress   = user.emails[0].address,
        urlWithoutHash = url.replace( '#/', '' ),
        supportEmail   = "support@leafii.com",
        emailBody      = `Hello, \n\n\ To reset your password click the link below. \n\n ${urlWithoutHash}`;

    return emailBody;
  }
};