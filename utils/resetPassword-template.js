export const generateEmailTemplate = {
  passwordReset: (firstName, resetURL) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #fff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
            }
            .content {
                padding: 30px;
            }
            .greeting {
                font-size: 18px;
                margin-bottom: 20px;
                color: #333;
            }
            .message {
                margin-bottom: 30px;
                font-size: 16px;
                line-height: 1.8;
                color: #555;
            }
            .reset-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                font-size: 16px;
                margin: 20px 0;
                transition: transform 0.2s ease;
            }
            .reset-button:hover {
                transform: translateY(-2px);
            }
            .security-notice {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
                font-size: 14px;
                color: #856404;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                font-size: 14px;
                color: #666;
                border-top: 1px solid #eee;
            }
            .footer p {
                margin: 5px 0;
            }
            .link-fallback {
                word-break: break-all;
                color: #667eea;
                margin-top: 15px;
                padding: 10px;
                background-color: #f8f9fa;
                border-radius: 3px;
                font-size: 12px;
            }
            .icon {
                font-size: 48px;
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="icon">🔐</div>
                <h1>Password Reset Request</h1>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Hello ${firstName}!
                </div>
                
                <div class="message">
                    We received a request to reset your password for your account. If you made this request, click the button below to reset your password.
                </div>
                
                <div style="text-align: center;">
                    <a href="${resetURL}" class="reset-button">Reset My Password</a>
                </div>
                
                <div class="security-notice">
                    <strong>🛡️ Security Notice:</strong> This link will expire in 15 minutes for your security. If you didn't request this password reset, you can safely ignore this email - your account remains secure.
                </div>
                
                <div class="message">
                    If the button doesn't work, you can copy and paste the following link into your browser:
                </div>
                
                <div class="link-fallback">
                    ${resetURL}
                </div>
                
                <div class="message">
                    <strong>Need help?</strong> If you're having trouble resetting your password, please contact our support team.
                </div>
            </div>
            
            <div class="footer">
                <p><strong>Express APP</strong></p>
                <p>This is an automated message, please do not reply to this email.</p>
                <p>&copy; ${new Date().getFullYear()} Express APP. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  },

  emailVerification: (firstName, verificationURL) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email Address</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #fff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
            }
            .content {
                padding: 30px;
            }
            .greeting {
                font-size: 18px;
                margin-bottom: 20px;
                color: #333;
            }
            .message {
                margin-bottom: 30px;
                font-size: 16px;
                line-height: 1.8;
                color: #555;
            }
            .verify-button {
                display: inline-block;
                background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                font-size: 16px;
                margin: 20px 0;
                transition: transform 0.2s ease;
            }
            .verify-button:hover {
                transform: translateY(-2px);
            }
            .security-notice {
                background-color: #e7f3ff;
                border: 1px solid #b3d7ff;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
                font-size: 14px;
                color: #0056b3;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                font-size: 14px;
                color: #666;
                border-top: 1px solid #eee;
            }
            .footer p {
                margin: 5px 0;
            }
            .link-fallback {
                word-break: break-all;
                color: #4CAF50;
                margin-top: 15px;
                padding: 10px;
                background-color: #f8f9fa;
                border-radius: 3px;
                font-size: 12px;
            }
            .icon {
                font-size: 48px;
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="icon">✉️</div>
                <h1>Welcome to Express APP!</h1>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Hello ${firstName}!
                </div>
                
                <div class="message">
                    Thank you for signing up with Express APP! To complete your registration and start using your account, please verify your email address by clicking the button below.
                </div>
                
                <div style="text-align: center;">
                    <a href="${verificationURL}" class="verify-button">Verify My Email</a>
                </div>
                
                <div class="security-notice">
                    <strong>📧 Important:</strong> This verification link will expire in 24 hours. If you didn't create an account with us, you can safely ignore this email.
                </div>
                
                <div class="message">
                    If the button doesn't work, you can copy and paste the following link into your browser:
                </div>
                
                <div class="link-fallback">
                    ${verificationURL}
                </div>
                
                <div class="message">
                    <strong>Need help?</strong> If you're having trouble verifying your email, please contact our support team.
                </div>
            </div>
            
            <div class="footer">
                <p><strong>Express APP</strong></p>
                <p>This is an automated message, please do not reply to this email.</p>
                <p>&copy; ${new Date().getFullYear()} Express APP. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  },
};
