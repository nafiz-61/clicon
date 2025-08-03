exports.RegistrationTemplate = (
  firstName,
  verificationLink,
  otp,
  expireTime
) => {
  return `
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Confirm Your Registration</title>
  <style>
    body {
      background-color: #f2f4f8;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(90deg, #4f46e5, #6366f1);
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 30px 25px;
      color: #1f2937;
    }
    .content h2 {
      font-size: 20px;
      margin: 0 0 10px 0;
    }
    .otp-box {
      background-color: #f3f4f6;
      border: 1px dashed #4f46e5;
      padding: 12px 20px;
      font-size: 18px;
      font-weight: 600;
      text-align: center;
      margin: 20px 0;
      letter-spacing: 2px;
      color: #111827;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #4f46e5;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      font-weight: 500;
      margin-top: 20px;
    }
    .footer {
      background-color: #f9fafb;
      text-align: center;
      padding: 20px;
      font-size: 13px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>Welcome, ${firstName}!</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <h2>Complete Your Registration</h2>
      <p>Thanks for signing up! To activate your account, please confirm your email address using the code below.</p>
      
      <div class="otp-box">${otp}</div>

      <p>This code is valid for <strong>${expireTime}</strong>.</p>
      <p>Or click the button below to verify instantly:</p>

      <a href="${verificationLink}" class="button">Verify My Email</a>

      <p style="margin-top: 30px;">If you didn't create an account, no action is required. This link will expire automatically.</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      &copy; 2025 Your Company · All rights reserved<br>
      Need help? Contact us at <a href="mailto:support@yourcompany.com">support@yourcompany.com</a>
    </div>
  </div>
</body>
</html>

`;
};
