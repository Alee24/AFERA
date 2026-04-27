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

    await transporter.sendMail(mailOptions);
    console.log(`Contact notification email sent via local sendmail to ceo@armfa.info from ${contactData.email}`);
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

    await transporter.sendMail(mailOptions);
    console.log(`Admission update email sent to ${studentData.email} (Status: ${status})`);
  } catch (error) {
    console.error('Error sending admission update notification:', error);
  }
};
