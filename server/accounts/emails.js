Accounts.emailTemplates.siteName = "Leafii";
Accounts.emailTemplates.from     = "Leafii <support@leafii.com>";

Accounts.emailTemplates.verifyEmail = {
  subject() {
    return "Leafii: Please Verify Your Account";
  },
  html(user, url){
    var urlWithoutHash = url.replace( '#/verify-email', 'verify' );
    var supportEmail = "support@leafii.com";
    var emailAddress = user.emails[0].address;
    return '<div style="padding:10%;">' +
              '<div style="padding: 3%; color: #f8f8f8;text-align: center;background: #3edeaa;background-size: cover;">' +
                '<h1>Welcome to Leafii</h1>' + 
              '</div>' +
              '<div style="text-align:center;padding:5%;border:thin solid;">'+ 
                '<span>Hello there,</span><br><br>' +
                '<span>To verify your email address ' + emailAddress + ', please click the button below:</span><br>'+
                '<a target="_blank" href="' + urlWithoutHash + 
                '"style="background-color: #3edeaa;color: white;font-weight: bold;font-size: 20px;padding: 14px 25px;text-align: center;text-decoration: none;display: inline-block; margin:5%;">Verify</button></a><br>' + 
                '<span>If you did not request this verification, please ignore this email.</span><br>' +
                '<span>If you feel something is wrong, please contact our support team: ' + supportEmail + '</span>' +
              '</div>'+
            '</div>'
  }


};

Accounts.emailTemplates.resetPassword = {
  subject() {
    return "Leafii: Password Reset";
  },
  html(user, url){
    var urlWithoutHash = url.replace( '#/reset-password', 'reset');
    var supportEmail = "support@leafii.com";
    return '<div style="padding:10%;">' +
              '<div style="padding: 3%; color: #f8f8f8;text-align: center;background: #3edeaa;background-size: cover;">' +
                '<h1>Leafii Notification</h1>' + 
              '</div>' +
              '<div style="text-align:center;padding:5%;border:thin solid;">'+ 
                '<span>Hello there,</span><br><br>' +
                '<span>You have requested a new password for your Leafii account.</span><br>'+
                '<a target="_blank" href="' + urlWithoutHash + 
                '"style="background-color: #3edeaa;color: white;font-weight: bold;font-size: 20px;padding: 14px 25px;text-align: center;text-decoration: none;display: inline-block; margin:5%;">Reset Password</button></a><br>' + 
                '<span>If you did not make this request then you can safely ignore this email :D</span><br>' +
                '<span>If you feel something is wrong, please contact our support team: ' + supportEmail + '</span>' +
              '</div>'+
            '</div>'
  }
};
