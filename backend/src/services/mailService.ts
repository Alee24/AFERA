import nodemailer from 'nodemailer';
import { SystemSetting } from '../models';

const getTransporter = async () => {
  try {
    const hostSetting = await SystemSetting.findOne({ where: { key: 'smtp_host' } });
    const portSetting = await SystemSetting.findOne({ where: { key: 'smtp_port' } });
    const userSetting = await SystemSetting.findOne({ where: { key: 'smtp_user' } });
    const passSetting = await SystemSetting.findOne({ where: { key: 'smtp_pass' } });
    const secureSetting = await SystemSetting.findOne({ where: { key: 'smtp_secure' } });

    if (hostSetting && hostSetting.value && userSetting && userSetting.value && passSetting && passSetting.value) {
      const host = JSON.parse(hostSetting.value);
      const port = portSetting ? parseInt(JSON.parse(portSetting.value)) : 587;
      const user = JSON.parse(userSetting.value);
      const pass = JSON.parse(passSetting.value);
      const secure = secureSetting ? JSON.parse(secureSetting.value) === true || JSON.parse(secureSetting.value) === 'true' : false;

      if (host && user && pass) {
        return nodemailer.createTransport({
          host,
          port,
          secure,
          auth: {
            user,
            pass,
          },
        });
      }
    }
  } catch (error) {
    console.error('Error fetching SMTP settings from DB, falling back to local sendmail:', error);
  }

  return nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail',
  });
};

export const sendApplicationNotification = async (userData: any) => {
  try {
    const mailOptions = {
      from: '"AFERA Application" <noreply@aferainnov.africa>',
      to: ['ceo@armfa.info', 'assistant@armfa.info', 'mettoalex@gmail.com'],
      subject: `New Student Application: ${userData.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #1e3a8a;">New Student Application Received</h2>
          <p>A new student has registered through the AFERA INNOV ACADEMY portal.</p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #111827;">Applicant Details:</h3>
            <p><strong>Name:</strong> ${userData.name}</p>
            <p><strong>Email:</strong> ${userData.email}</p>
            <p><strong>Program of Interest:</strong> ${userData.program}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p>Please log in to the admin dashboard to review this application.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #6b7280;">
            This is an automated notification from AFERA INNOV ACADEMY.<br />
            Associated with <a href="https://www.armfa.info">www.armfa.info</a>
          </p>
        </div>
      `,
    };

    const transporter = await getTransporter();
    await transporter.sendMail(mailOptions);
    console.log(`Notification email sent to ceo@armfa.info for ${userData.email}`);
  } catch (error) {
    console.error('Error sending application notification:', error);
  }
};

export const sendContactNotification = async (contactData: any) => {
  try {
    const mailOptions = {
      from: '"AFERA Contact" <noreply@aferainnov.africa>',
      to: ['ceo@armfa.info', 'assistant@armfa.info', 'mettoalex@gmail.com'],
      subject: `New Inquiry: ${contactData.subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #1e3a8a;">New Website Inquiry Received</h2>
          <p>You have received a new message via the AFERA INNOV ACADEMY contact form.</p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #111827;">Inquiry Details:</h3>
            <p><strong>From:</strong> ${contactData.first_name} ${contactData.last_name} (${contactData.email})</p>
            <p><strong>Subject:</strong> ${contactData.subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; font-style: italic; color: #374151; background: #fff; padding: 10px; border: 1px solid #e5e7eb; border-radius: 4px;">${contactData.message}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p>Please log in to the admin dashboard to manage your inbox.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #6b7280;">
            This is an automated notification from AFERA INNOV ACADEMY.<br />
            Associated with <a href="https://www.armfa.info">www.armfa.info</a>
          </p>
        </div>
      `,
    };

    const transporter = await getTransporter();
    await transporter.sendMail(mailOptions);
    console.log(`Contact notification email sent to ceo@armfa.info from ${contactData.email}`);
  } catch (error) {
    console.error('Error sending contact notification:', error);
  }
};



export const sendAdmissionStatusUpdate = async (studentData: any, status: string, programName: string) => {
  try {
    const isApproved = status === 'enrolled';
    const subject = isApproved ? 'Congratulations! Admission Approved' : 'Application Status Update';
    
    const mailOptions = {
      from: '"AFERA INNOV ACADEMY" <admissions@aferainnov.africa>',
      to: studentData.email,
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: ${isApproved ? '#059669' : '#dc2626'};">${subject}</h2>
          <p>Dear ${studentData.first_name} ${studentData.last_name},</p>
          
          <p>We have completed the review of your application for the <strong>${programName}</strong> at AFERA INNOV ACADEMY.</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 5px solid ${isApproved ? '#059669' : '#dc2626'};">
            <h3 style="margin-top: 0; color: #111827;">Decision:</h3>
            <p style="font-size: 18px; font-weight: bold; color: ${isApproved ? '#059669' : '#dc2626'};">
              ${isApproved ? 'ADMISSION APPROVED' : 'APPLICATION UNSUCCESSFUL'}
            </p>
            <p><strong>Program:</strong> ${programName}</p>
          </div>
          
          ${isApproved ? `
            <p>We are delighted to welcome you to our community. You can now log in to your dashboard to view your units, download materials, and access your invoice.</p>
            <div style="margin: 30px 0;">
              <a href="https://aferainnov.africa/login" style="background-color: #f59e0b; color: #1e3a8a; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Access Student Dashboard</a>
            </div>
          ` : `
            <p>Thank you for your interest in our programs. While we are unable to offer you admission at this time, we encourage you to apply for future sessions as we expand our intake capacity.</p>
          `}
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #6b7280;">
            This is an official communication from the Admissions Office, AFERA INNOV ACADEMY.<br />
            Associated with the African Road Maintenance Funds Association (ARMFA).
          </p>
        </div>
      `,
    };

    const transporter = await getTransporter();
    await transporter.sendMail(mailOptions);
    console.log(`Admission update email sent to ${studentData.email} (Status: ${status})`);
  } catch (error) {
    console.error('Error sending admission update notification:', error);
  }
};

export const sendAccountCreatedNotification = async (userData: any, pass: string) => {
  try {
    const mailOptions = {
      from: '"AFERA INNOV ACADEMY" <admissions@aferainnov.africa>',
      to: userData.email,
      subject: 'Your AFERA INNOV ACADEMY Account Details',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #1e3a8a;">Welcome to AFERA INNOV ACADEMY</h2>
          <p>Dear ${userData.first_name} ${userData.last_name || ''},</p>
          
          <p>An institutional account has been successfully created for you on the AFERA Innov Platform. Below are your login credentials and activation instructions:</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #e5e7eb;">
            <h3 style="margin-top: 0; color: #111827; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Your Credentials:</h3>
            <p><strong>Login Email:</strong> <span style="font-family: monospace; font-size: 14px;">${userData.email}</span></p>
            <p><strong>Temporary Password:</strong> <span style="font-family: monospace; font-size: 14px; background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${pass}</span></p>
            <p><strong>Assigned Role:</strong> ${userData.role || 'Student'}</p>
          </div>

          <h3 style="color: #1e3a8a;">Activation & Setup Instructions:</h3>
          <ol style="line-height: 1.6; color: #374151;">
            <li>Click the access portal button below or navigate to <a href="https://aferainnov.africa/login">https://aferainnov.africa/login</a>.</li>
            <li>Log in using your email address and the temporary password provided above.</li>
            <li>If you are logging in for the first time as a student, you will be prompted to complete the <strong>Onboarding Profile Wizard</strong> to finalize your academic record.</li>
            <li>We highly recommend changing your password to a secure personal one immediately under your <strong>Profile Settings</strong> after logging in.</li>
          </ol>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="https://aferainnov.africa/login" style="background-color: #f59e0b; color: #1e3a8a; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">Access Student Portal</a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #6b7280;">
            This is an official communication from AFERA INNOV ACADEMY.<br />
            For any queries or academic support, please reply to this email or contact us at <a href="mailto:info@aferainnov.africa">info@aferainnov.africa</a>.
          </p>
        </div>
      `,
    };

    const transporter = await getTransporter();
    await transporter.sendMail(mailOptions);
    console.log(`Account creation email sent successfully to ${userData.email}`);
  } catch (error) {
    console.error('Error sending account creation email:', error);
  }
};

export const sendRegistrationConfirmationNotification = async (studentData: any) => {
  try {
    const transporter = await getTransporter();
    const mailOptions = {
      from: '"AFERA INNOV ACADEMY" <admissions@aferainnov.africa>',
      to: studentData.email,
      subject: 'AFERA INNOV ACADEMY - Application Received',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #1e3a8a;">Thank You for Your Application</h2>
          <p>Dear ${studentData.first_name} ${studentData.last_name || ''},</p>
          
          <p>We have successfully received your application for enrollment at AFERA INNOV ACADEMY. Our admissions registry team is currently reviewing your credentials.</p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #eee;">
            <p><strong>Selected Program:</strong> ${studentData.program || 'Academic Program'}</p>
            <p><strong>Status:</strong> Pending Administrative Review</p>
          </div>
          
          <p>Once your application has been verified and approved, you will receive another email detailing your onboarding instructions and official credentials. You can access your applicant workspace using the link below:</p>
          
          <div style="margin: 25px 0; text-align: center;">
            <a href="https://aferainnov.africa/login" style="background-color: #f59e0b; color: #1e3a8a; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Access Applicant Portal</a>
          </div>
          
          <p>If you did not submit this application, please ignore this email.</p>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 11px; color: #6b7280;">
            This is an official communication from AFERA INNOV ACADEMY admissions office.<br />
            For questions or support, contact us at <a href="mailto:info@aferainnov.africa">info@aferainnov.africa</a>.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Registration confirmation email sent to ${studentData.email}`);
  } catch (error) {
    console.error('Error sending registration confirmation email:', error);
  }
};

