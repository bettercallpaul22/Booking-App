// Web3Forms configuration
const WEB3FORMS_ACCESS_KEY = import.meta.env?.VITE_WEB3FORMS_ACCESS_KEY || 'cee5918b-af67-4275-b462-5bd46228c1ba';

// Types for email data
export interface EmailData {
  to: string;
  subject: string;
  message?: string;
  [key: string]: any;
}

export interface AppointmentEmailData {
  to: string;
  customer_name: string;
  appointment_date: string;
  service: string;
  customer_email?: string;
  phone?: string;
}

// Send generic email using Web3Forms
export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    const { to, subject, message, ...otherParams } = emailData;

    const formData = new FormData();
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('message', message || '');
    formData.append('from_name', 'Appointment App');

    // Add any additional parameters
    Object.keys(otherParams).forEach(key => {
      formData.append(key, String(otherParams[key]));
    });

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      console.log('Email sent successfully:', result.message);
      return true;
    } else {
      console.error('Error sending email:', result.message);
      return false;
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Send appointment confirmation email
export const sendAppointmentConfirmation = async (
  emailData: AppointmentEmailData
): Promise<boolean> => {
  try {
    const message = `
Dear ${emailData.customer_name},

Your appointment has been successfully scheduled!

Appointment Details:
- Service: ${emailData.service}
- Date & Time: ${emailData.appointment_date}
- Email: ${emailData.customer_email || 'Not provided'}
- Phone: ${emailData.phone || 'Not provided'}

Thank you for choosing our service!

Best regards,
Appointment Team
    `.trim();

    const formData = new FormData();
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    formData.append('to', emailData.to);
    formData.append('subject', `Appointment Confirmed - ${emailData.appointment_date}`);
    formData.append('message', message);
    formData.append('from_name', 'Appointment App');

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      console.log('Appointment confirmation email sent:', result.message);
      return true;
    } else {
      console.error('Error sending appointment confirmation:', result.message);
      return false;
    }
  } catch (error) {
    console.error('Error sending appointment confirmation:', error);
    return false;
  }
};

// Send appointment reminder email
export const sendAppointmentReminder = async (
  emailData: AppointmentEmailData
): Promise<boolean> => {
  try {
    const message = `
Dear ${emailData.customer_name},

This is a friendly reminder about your upcoming appointment.

Appointment Details:
- Service: ${emailData.service}
- Date & Time: ${emailData.appointment_date}
- Email: ${emailData.customer_email || 'Not provided'}
- Phone: ${emailData.phone || 'Not provided'}

We look forward to seeing you!

Best regards,
Appointment Team
    `.trim();

    const formData = new FormData();
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    formData.append('to', emailData.to);
    formData.append('subject', `Appointment Reminder - ${emailData.appointment_date}`);
    formData.append('message', message);
    formData.append('from_name', 'Appointment App');

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      console.log('Appointment reminder email sent:', result.message);
      return true;
    } else {
      console.error('Error sending appointment reminder:', result.message);
      return false;
    }
  } catch (error) {
    console.error('Error sending appointment reminder:', error);
    return false;
  }
};

// Test email function
export const sendTestEmail = async (to: string): Promise<boolean> => {
  try {
    const message = 'This is a test email to verify the email service is working.';

    const formData = new FormData();
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    formData.append('to', to);
    formData.append('subject', 'Test Email from Appointment App');
    formData.append('message', message);
    formData.append('from_name', 'Appointment App');

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      console.log('Test email sent:', result.message);
      return true;
    } else {
      console.error('Error sending test email:', result.message);
      return false;
    }
  } catch (error) {
    console.error('Error sending test email:', error);
    return false;
  }
};

// Initialize function to set up Web3Forms with runtime configuration
export const initializeWeb3Forms = (accessKey: string) => {
  // Store the access key globally for runtime configuration
  (globalThis as any).WEB3FORMS_ACCESS_KEY = accessKey;
};

export default {
  sendEmail,
  sendAppointmentConfirmation,
  sendAppointmentReminder,
  sendTestEmail,
  initializeWeb3Forms,
};
