# Email Service

This email service uses Web3Forms to send emails directly from your React application without needing a backend server. It provides functions for sending appointment-related emails with pre-formatted templates.

## Setup

1. **Create Web3Forms Account**: Go to [Web3Forms](https://web3forms.com/) and create a free account

2. **Get your Access Key**: In your Web3Forms dashboard:
   - Copy your access key from the dashboard
   - No additional setup required - Web3Forms handles everything

3. **Configure environment variables** in your `.env` file:
   ```env
   REACT_APP_WEB3FORMS_ACCESS_KEY=your-access-key-here
   ```

   Or initialize Web3Forms at runtime:
   ```typescript
   import { initializeWeb3Forms } from '../services/email';
   initializeWeb3Forms('your-access-key');
   ```

## Email Templates

Web3Forms uses pre-formatted email templates built into the service functions. No additional template setup is required.

### 1. Generic Email Template
Emails are sent with custom subject and message content.

### 2. Appointment Confirmation
```
Subject: Appointment Confirmed - [appointment_date]

Dear [customer_name],

Your appointment has been successfully scheduled!

Appointment Details:
- Service: [service]
- Date & Time: [appointment_date]
- Email: [customer_email]
- Phone: [phone]

Thank you for choosing our service!

Best regards,
Appointment Team
```

### 3. Appointment Reminder
```
Subject: Appointment Reminder - [appointment_date]

Dear [customer_name],

This is a friendly reminder about your upcoming appointment.

Appointment Details:
- Service: [service]
- Date & Time: [appointment_date]
- Email: [customer_email]
- Phone: [phone]

We look forward to seeing you!

Best regards,
Appointment Team
```

### 4. Test Email
Simple test message to verify the service is working.

## Usage

### Import the service:
```typescript
import { sendEmail, sendAppointmentConfirmation, sendAppointmentReminder } from '../services/email';
```

### Send a generic email:
```typescript
const success = await sendEmail({
  to: 'user@example.com',
  subject: 'Hello',
  message: 'This is a test message'
});
```

### Send appointment confirmation:
```typescript
const success = await sendAppointmentConfirmation({
  to: 'customer@example.com',
  customer_name: 'John Doe',
  appointment_date: '2025-09-15 10:00 AM',
  service: 'Counseling',
  customer_email: 'john@example.com',
  phone: '+1234567890'
});
```

### Send appointment reminder:
```typescript
const success = await sendAppointmentReminder({
  to: 'customer@example.com',
  customer_name: 'John Doe',
  appointment_date: '2025-09-15 10:00 AM',
  service: 'Counseling'
});
```

## Functions

- `sendEmail(emailData: EmailData)`: Send a generic email
- `sendAppointmentConfirmation(emailData: AppointmentEmailData)`: Send appointment confirmation
- `sendAppointmentReminder(emailData: AppointmentEmailData)`: Send appointment reminder
- `sendTestEmail(to: string)`: Send a test email
- `initializeWeb3Forms(accessKey)`: Initialize Web3Forms with runtime configuration

## Types

```typescript
interface EmailData {
  to: string;
  subject: string;
  message?: string;
  [key: string]: any;
}

interface AppointmentEmailData {
  to: string;
  customer_name: string;
  appointment_date: string;
  service: string;
  customer_email?: string;
  phone?: string;
}
```

## Integration with Your App

You can call these functions directly from your React components:

```typescript
// In your appointment booking component
const handleAppointmentSubmit = async (formData) => {
  // Save appointment to state/store
  dispatch(addAppointment(formData));

  // Send confirmation email
  const emailSent = await sendAppointmentConfirmation({
    to: formData.email,
    customer_name: formData.name,
    appointment_date: formData.datetime,
    service: formData.service,
    customer_email: formData.email,
    phone: formData.phone
  });

  if (emailSent) {
    alert('Appointment booked and confirmation email sent!');
  }
};
```

## Testing

Test the email service in your React app:

```typescript
// Test function
const testEmailService = async () => {
  const success = await sendTestEmail('test@example.com');
  console.log('Email sent:', success);
};
```

## Security Notes

- Your Web3Forms Access Key is safe to use in client-side code
- Web3Forms handles the email sending securely on their servers
- Be mindful of Web3Forms free tier limits (250 emails/month)
- Consider upgrading to a paid plan for production use
- Validate email addresses before sending
- Web3Forms provides spam protection and email validation
