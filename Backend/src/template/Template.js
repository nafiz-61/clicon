exports.registrationTemplate = (
  firstName,
  verificationLink,
  otp,
  minutesLeft
) => {
  return ` 
<html >
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    body {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
      line-height: 1.6;
      min-height: 100vh;
    }
    
    .container {
      max-width: 650px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 25px 80px rgba(0,0,0,0.15);
      position: relative;
    }
    
    .container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
      background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #f9ca24, #f0932b);
      background-size: 300% 100%;
      animation: gradientMove 3s ease infinite;
    }
    
    @keyframes gradientMove {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      padding: 45px 30px;
      position: relative;
      overflow: hidden;
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: rotate 8s linear infinite;
    }
    
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .header-icon {
      font-size: 48px;
      margin-bottom: 15px;
      display: block;
      animation: pulse 2s infinite;
      position: relative;
      z-index: 1;
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      position: relative;
      z-index: 1;
      text-shadow: 0 2px 15px rgba(0,0,0,0.3);
    }
    
    .content {
      padding: 50px 40px;
    }
    
    .content h2 {
      margin-top: 0;
      margin-bottom: 25px;
      font-size: 26px;
      color: #2c3e50;
      font-weight: 600;
      text-align: center;
    }
    
    .content p {
      font-size: 16px;
      color: #555;
      margin-bottom: 20px;
      text-align: center;
    }
    
    .verification-section {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 20px;
      padding: 35px;
      margin: 35px 0;
      text-align: center;
      border: 2px solid transparent;
      background-clip: padding-box;
      position: relative;
    }
    
    .verification-section::before {
      content: '';
      position: absolute;
      inset: 0;
      padding: 2px;
      background: linear-gradient(135deg, #667eea, #764ba2, #f093fb, #f5576c);
      border-radius: 20px;
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: xor;
      -webkit-mask-composite: xor;
    }
    
    .otp-label {
      font-size: 16px;
      color: #6c757d;
      margin-bottom: 15px;
      font-weight: 500;
    }
    
    .otp-box {
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      border: 3px solid #667eea;
      color: #2c3e50;
      font-size: 32px;
      font-weight: 800;
      text-align: center;
      padding: 20px;
      margin: 20px 0;
      letter-spacing: 8px;
      border-radius: 15px;
      font-family: 'Courier New', monospace;
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
      position: relative;
      overflow: hidden;
    }
    
    .otp-box::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
      animation: shimmer 2s infinite;
    }
    
    @keyframes shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }
    
    .timer-info {
      background: rgba(255, 193, 7, 0.1);
      border: 2px solid #ffc107;
      border-radius: 12px;
      padding: 15px;
      margin: 25px 0;
      text-align: center;
      color: #856404;
    }
    
    .timer-info strong {
      color: #dc3545;
      font-size: 18px;
    }
    
    .button-container {
      text-align: center;
      margin: 35px 0;
    }
    
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff !important;
      padding: 18px 45px;
      text-decoration: none;
      border-radius: 50px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    
    .button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }
    
    .button:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
    }
    
    .button:hover::before {
      left: 100%;
    }
    
    .divider {
      display: flex;
      align-items: center;
      text-align: center;
      margin: 30px 0;
    }
    
    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, #dee2e6, transparent);
    }
    
    .divider span {
      padding: 0 20px;
      color: #6c757d;
      font-size: 14px;
      font-weight: 500;
    }
    
    .security-note {
      background: linear-gradient(135deg, rgba(220, 53, 69, 0.05) 0%, rgba(220, 53, 69, 0.1) 100%);
      border: 1px solid rgba(220, 53, 69, 0.2);
      border-radius: 12px;
      padding: 20px;
      margin: 30px 0;
      text-align: center;
    }
    
    .security-note .icon {
      font-size: 24px;
      margin-bottom: 10px;
      display: block;
    }
    
    .security-note p {
      margin: 0;
      color: #721c24;
      font-size: 14px;
      font-weight: 500;
    }
    
    .footer {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      text-align: center;
      padding: 30px 25px;
      font-size: 14px;
      color: #6c757d;
      border-top: 1px solid #dee2e6;
    }
    
    .footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }
    
    .footer a:hover {
      color: #764ba2;
    }
    
    .footer-links {
      margin-top: 15px;
    }
    
    .footer-links a {
      margin: 0 15px;
    }
    
    @media (max-width: 600px) {
      body {
        padding: 15px;
      }
      
      .container {
        border-radius: 20px;
      }
      
      .header {
        padding: 35px 25px;
      }
      
      .header h1 {
        font-size: 24px;
      }
      
      .content {
        padding: 35px 25px;
      }
      
      .content h2 {
        font-size: 22px;
      }
      
      .verification-section {
        padding: 25px;
      }
      
      .otp-box {
        font-size: 24px;
        letter-spacing: 4px;
        padding: 15px;
      }
      
      .button {
        padding: 16px 35px;
        font-size: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <span class="header-icon">📧</span>
      <h1>Hello, ${firstName}!</h1>
    </div>
    
    <!-- Content -->
    <div class="content">
      <h2>Verify Your Email Address</h2>
      <p>Thank you for joining us! We're excited to have you on board.</p>
      
      <div class="verification-section">
        <div class="otp-label">Your Verification Code</div>
        <div class="otp-box">${otp}</div>
        
        <div class="timer-info">
          ⏰ This code expires in <strong>${minutesLeft} minutes</strong>
        </div>
      </div>
      
      <div class="divider">
        <span>OR</span>
      </div>
      
      <p>Click the button below for instant verification:</p>
      
      <div class="button-container">
        <a href="${verificationLink}" class="button">
          ✅ Verify My Email
        </a>
      </div>
      
      <div class="security-note">
        <span class="icon">🔒</span>
        <p><strong>Security Notice:</strong> If you didn't request this verification, please ignore this email or contact our support team immediately.</p>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>&copy; 2025 Your Company Name. All rights reserved.</p>
      <div class="footer-links">
        <a href="mailto:support@yourcompany.com">Contact Support</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
    </div>
  </div>
</body>
</html>
`;
};

// reset password email template
exports.resetPasswordEmailTemplate = (
  firstName,
  verifyLink,
  otp,
  minutesLeft
) => {
  return `
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            color: #333;
            line-height: 1.6;
        }

        .email-wrapper {
            max-width: 600px;
            margin: 40px auto;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="30" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
            opacity: 0.3;
        }

        .lock-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 20px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
            position: relative;
            z-index: 1;
        }

        .lock-icon svg {
            width: 28px;
            height: 28px;
            fill: white;
        }

        .header h1 {
            color: white;
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            position: relative;
            z-index: 1;
        }

        .content {
            padding: 40px 30px;
        }

        .greeting {
            font-size: 20px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 20px;
        }

        .message {
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 30px;
            line-height: 1.7;
        }

        .otp-section {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            border-radius: 16px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
            border: 2px dashed #cbd5e0;
            position: relative;
            overflow: hidden;
        }

        .otp-section::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent 40%, rgba(102, 126, 234, 0.05) 50%, transparent 60%);
            transform: rotate(-45deg);
            animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
            0% { transform: translateX(-100%) translateY(-100%) rotate(-45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(-45deg); }
        }

        .otp-label {
            font-size: 14px;
            color: #718096;
            font-weight: 500;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .otp {
            font-size: 36px;
            font-weight: 800;
            color: #667eea;
            font-family: 'Courier New', monospace;
            letter-spacing: 4px;
            margin: 10px 0 20px;
            text-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
            position: relative;
            z-index: 1;
        }

        .expiry {
            font-size: 14px;
            color: #e53e3e;
            font-weight: 600;
            background: rgba(254, 178, 178, 0.2);
            padding: 8px 16px;
            border-radius: 20px;
            display: inline-block;
            border: 1px solid rgba(254, 178, 178, 0.4);
        }

        .button-container {
            text-align: center;
            margin: 40px 0;
        }

        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            padding: 16px 32px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 700;
            font-size: 16px;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            position: relative;
            overflow: hidden;
            border: none;
            cursor: pointer;
        }

        .reset-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .reset-button:hover::before {
            left: 100%;
        }

        .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
        }

        .reset-button:active {
            transform: translateY(0);
        }

        .security-note {
            background: #f0fff4;
            border-left: 4px solid #38a169;
            padding: 20px;
            margin: 30px 0;
            border-radius: 0 12px 12px 0;
            font-size: 14px;
            color: #2f855a;
        }

        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }

        .footer-content {
            font-size: 12px;
            color: #718096;
            line-height: 1.5;
        }

        .company-name {
            font-weight: 600;
            color: #4a5568;
        }

        .divider {
            width: 60px;
            height: 3px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 20px auto;
            border-radius: 2px;
        }

        /* Responsive Design */
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            
            .email-wrapper {
                margin: 20px auto;
                border-radius: 16px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .otp-section {
                padding: 20px;
            }
            
            .otp {
                font-size: 28px;
                letter-spacing: 2px;
            }
            
            .header h1 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="header">
            <div class="lock-icon">
                <svg viewBox="0 0 24 24">
                    <path d="M12,1A7,7 0 0,0 5,8V10.91C3.78,11.82 3,13.32 3,15A6,6 0 0,0 9,21H15A6,6 0 0,0 21,15C21,13.32 20.22,11.82 19,10.91V8A7,7 0 0,0 12,1M6,8A6,6 0 0,1 18,8V9H6V8M12,16A1,1 0 0,1 11,15A1,1 0 0,1 12,14A1,1 0 0,1 13,15A1,1 0 0,1 12,16Z"/>
                </svg>
            </div>
            <h1>Reset Your Password</h1>
        </div>
        
        <div class="content">
            <div class="greeting">Hello ${firstName},</div>
            
            <div class="message">
                We received a request to reset your password. You can use the verification code below or click the reset button to create a new password for your account.
            </div>
            
            <div class="otp-section">
                <div class="otp-label">Verification Code</div>
                <div class="otp">Your one-time password (OTP) is${otp}</div>
                <div class="expiry">It will expire in${minutesLeft}minutes  </div>
            </div>
            
            <div class="button-container">
                <a href=${verifyLink} target = "_blank" class="reset-button">Reset Password</a>
            </div>
            
            <div class="security-note">
                <strong>🔒 Security Notice:</strong> If you didn't request this password reset, you can safely ignore this email. Your account remains secure and no changes have been made.
            </div>
            
            <div class="divider"></div>
            
            <div style="text-align: center; color: #718096; font-size: 14px;">
                Having trouble? Contact our support team at <a href="mailto:support@company.com" style="color: #667eea;">support@company.com</a>
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-content">
                © 2024 <span class="company-name">Your Company Name</span>. All rights reserved.<br>
                This email was sent to you because you requested a password reset.<br>
                <a href="#" style="color: #667eea; text-decoration: none;">Unsubscribe</a> | 
                <a href="#" style="color: #667eea; text-decoration: none;">Privacy Policy</a>
            </div>
        </div>
    </div>
</body>
</html>`;
};

// order template
exports.orderTemplate = (cart, finalAmount, charge) => {
  return `
   <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Order Confirmation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f6f6f6;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h2 {
      color: #333333;
    }

    .summary-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    .summary-table th, .summary-table td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }

    .summary-table th {
      background-color: #f2f2f2;
    }

    .totals {
      margin-top: 20px;
    }

    .totals p {
      font-size: 16px;
      margin: 5px 0;
    }

    .totals p strong {
      float: right;
    }

    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 14px;
      color: #999999;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Thank you for your order!</h2>
    <p>We've received your order and it's being processed. Below is the summary:</p>

    <!-- Optional: Order summary table -->
    <table class="summary-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <!-- Repeat this block for each item -->
        ${cart.items.map(
          (item) =>
            `<tr>
            <td>${item.product ? item.product.name : item.variant.name}</td>
            <td>${item.quantity}</td>
            <td>${item.totalPrice}</td>
          </tr>`
        )}
      
        
      </tbody>
    </table>

    <div class="totals">
      <p>Total Products: <strong>${cart.totalQuantity}</strong></p>
      <p>Total Amount: <strong>${cart.finalAmount}</strong></p>
      <p>Delivery Charge: <strong>+${charge}</strong></p>
     
      <hr>
      <p><strong>Final Amount: <span style="color: green;">${finalAmount}</span></strong></p>
    </div>

    <div class="footer">
      <p>If you have any questions, feel free to contact our support team.</p>
    </div>
  </div>
</body>
</html>

  `;
};
