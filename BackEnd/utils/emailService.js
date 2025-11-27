// utils/emailService.js - More robust version
const nodemailer = require('nodemailer');

// Create transporter with better configuration
const createTransporter = () => {
  try {
    // Check if required environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('EMAIL_USER and EMAIL_PASS environment variables are required');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Additional options for better reliability
      pool: true,
      maxConnections: 1,
      maxMessages: 10,
      rateDelta: 1000,
      rateLimit: 5
    });

    return transporter;
  } catch (error) {
    console.error('❌ Failed to create email transporter:', error.message);
    throw error;
  }
};

// Send verification email
const sendVerificationEmail = async (email, verificationCode) => {
  let transporter;
  
  try {
    console.log(`📧 Attempting to send verification email to: ${email}`);
    
    // Create transporter
    transporter = createTransporter();
    
    // Verify connection first
    await transporter.verify();
    console.log('✅ Email server connection verified');

    const mailOptions = {
      from: `"GRC360" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - GRC360',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">GRC360</h1>
            <p style="color: #6b7280; margin: 5px 0;">Governance, Risk & Compliance</p>
          </div>
          
          <h2 style="color: #1f2937;">Email Verification Required</h2>
          <p>Thank you for registering with GRC360. To complete your registration and access your account, please use the verification code below:</p>
          
          <div style="background-color: #f3f4f6; padding: 25px; text-align: center; margin: 25px 0; border-radius: 8px; border: 2px dashed #d1d5db;">
            <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px; margin: 0;">${verificationCode}</div>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            <strong>Important:</strong> This code will expire in 15 minutes. 
            If you didn't request this code, please ignore this email.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              This is an automated message from GRC360. Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
      text: `
        GRC360 Email Verification
        
        Thank you for registering with GRC360. 
        
        Your verification code is: ${verificationCode}
        
        This code will expire in 15 minutes.
        
        If you didn't create an account with GRC360, please ignore this email.
        
        This is an automated message, please do not reply.
      `
    };

    console.log('📤 Sending email...');
    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent successfully to ${email}`);
    console.log(`📨 Message ID: ${result.messageId}`);
    
    return result;
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    
    // More specific error messages
    if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check your EMAIL_USER and EMAIL_PASS.');
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Could not connect to email server. Please check your internet connection.');
    } else {
      throw new Error('Failed to send verification email: ' + error.message);
    }
  } finally {
    // Close the transporter if it was created
    if (transporter) {
      transporter.close();
    }
  }
};

// Test email configuration
const testEmailConnection = async () => {
  try {
    console.log('🧪 Testing email configuration...');
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Missing EMAIL_USER or EMAIL_PASS environment variables');
      return false;
    }

    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email server connection successful');
    
    // Test sending a simple email
    const testResult = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: 'GRC360 - Email Test',
      text: 'This is a test email from GRC360. Your email configuration is working correctly!',
      html: '<p>This is a test email from GRC360. Your email configuration is working correctly!</p>'
    });
    
    console.log('✅ Test email sent successfully');
    console.log(`📨 Test Message ID: ${testResult.messageId}`);
    
    transporter.close();
    return true;
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('🔐 Authentication failed. Please check:');
      console.error('   - Your Gmail account has 2-factor authentication enabled');
      console.error('   - You are using an App Password (not your regular password)');
      console.error('   - The App Password is correctly set in EMAIL_PASS');
    }
    
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  testEmailConnection,
};