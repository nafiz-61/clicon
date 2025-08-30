exports.RegistrationTemplate = (
  firstName,
  verificationLink,
  otp,
  minutesLeft
) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
  <style>
    body {
      background-color: #f5f7fa;
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      border: 1px solid #e0e0e0;
      overflow: hidden;
    }
    .header {
      background-color: #00a8ff;
      color: white;
      text-align: center;
      padding: 25px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }
    .content {
      padding: 30px 25px;
    }
    .content h2 {
      margin-top: 0;
      font-size: 20px;
      color: #2f3640;
    }
    .otp-box {
      background-color: #f0f8ff;
      border: 2px dashed #00a8ff;
      color: #2f3640;
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      padding: 15px;
      margin: 20px 0;
      letter-spacing: 2px;
      border-radius: 6px;
    }
    .button {
      display: inline-block;
      background-color: #00a8ff;
      color: #ffffff;
      padding: 12px 20px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .button:hover {
      background-color: #0091e0;
    }
    .note {
      font-size: 14px;
      color: #555;
      margin-top: 20px;
    }
    .footer {
      background-color: #fafafa;
      text-align: center;
      padding: 15px;
      font-size: 13px;
      color: #999;
      border-top: 1px solid #eee;
    }
    .footer a {
      color: #00a8ff;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Hello ${firstName}!</h1>
    </div>
    <div class="content">
      <h2>Verify Your Email Address</h2>
      <p>Thank you for joining us! Use the following code to verify your account:</p>
      
      <div class="otp-box">${otp}</div>

      <p>This code is valid for <strong>${minutesLeft} minutes</strong>.</p>
      <p>Or click the button below:</p>

      <p><a href="${verificationLink}" class="button">Verify My Email</a></p>

      <p class="note">If you did not request this, please ignore this email.</p>
    </div>
    <div class="footer">
      &copy; 2025 Your Company. All rights reserved.  
      Need help? <a href="mailto:support@yourcompany.com">Contact Support</a>
    </div>
  </div>
</body>
</html>
`;
};

// reset password  email template
exports.resetPasswordEmailTemplate = (
  firstName,
  verifyLink,
  otp,
  minutesLeft
) => {
  return `<html>
    <head>
      <meta charset="UTF-8" />
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          padding: 20px;
          color: #333;
        }
        .container {
          max-width: 500px;
          background-color: #fff;
          margin: auto;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0px 4px 10px rgba(0,0,0,0.1);
        }
        h2 {
          color: #2d89ef;
        }
        .otp {
          font-size: 24px;
          font-weight: bold;
          color: #2d89ef;
          margin: 20px 0;
        }
        .link-btn {
          display: inline-block;
          background-color: #2d89ef;
          color: #fff !important;
          padding: 10px 20px;
          border-radius: 5px;
          text-decoration: none;
          font-weight: bold;
        }
        .footer {
          font-size: 12px;
          color: #777;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Hello ${firstName},</h2>
        <p>We received a request to reset your password. You can reset it using the code below or the link provided.</p>
        
        <div class="otp">${otp}</div>
        <p>This code will expire in <strong>${minutesLeft} minutes</strong>.</p>

        <p>
          <a href="${verifyLink} target=_blank" class="link-btn">Reset Password</a>
        </p>

        <p>If you did not request this, you can safely ignore this email. Your account will remain secure.</p>

        <div class="footer">
          &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
        </div>
      </div>
    </body>
  </html>`;
};




