import nodemailer from 'nodemailer';

export const sendApplicationNotification = async (userData: any) => {
  try {
    // Basic SMTP configuration - ideally these should be in .env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"AFERA Application Portal" <${process.env.SMTP_USER}>`,
      to: 'ceo@armfa.info',
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

    // Only attempt to send if SMTP credentials exist
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
      console.log(`Notification email sent to ceo@armfa.info for ${userData.email}`);
    } else {
      console.warn('SMTP credentials missing. Email notification skipped but application saved.');
    }
  } catch (error) {
    console.error('Error sending application notification:', error);
  }
};

export const sendContactNotification = async (contactData: any) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"AFERA Contact Portal" <${process.env.SMTP_USER}>`,
      to: 'ceo@armfa.info',
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

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
      console.log(`Contact notification email sent to ceo@armfa.info from ${contactData.email}`);
    }
  } catch (error) {
    console.error('Error sending contact notification:', error);
  }
};

