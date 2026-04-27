import nodemailer from 'nodemailer';

// Use local sendmail on the VPS for zero-config email sending
const transporter = nodemailer.createTransport({
  sendmail: true,
  newline: 'unix',
  path: '/usr/sbin/sendmail',
});

export const sendApplicationNotification = async (userData: any) => {
  try {
    const mailOptions = {
      from: '"AFERA Application" <noreply@aferainnov.africa>',
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

    await transporter.sendMail(mailOptions);
    console.log(`Notification email sent via local sendmail to ceo@armfa.info for ${userData.email}`);
  } catch (error) {
    console.error('Error sending application notification:', error);
  }
};

export const sendContactNotification = async (contactData: any) => {
  try {
    const mailOptions = {
      from: '"AFERA Contact" <noreply@aferainnov.africa>',
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

    await transporter.sendMail(mailOptions);
    console.log(`Contact notification email sent via local sendmail to ceo@armfa.info from ${contactData.email}`);
  } catch (error) {
    console.error('Error sending contact notification:', error);
  }
};


