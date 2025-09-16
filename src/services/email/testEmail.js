// Client-side test for Web3Forms email service
// This can be used in your React app for testing

// Example usage in a React component:
/*
import React from 'react';
import { sendTestEmail, sendAppointmentConfirmation } from '../services/email';

const TestEmailComponent = () => {
  const handleTestEmail = async () => {
    console.log('Testing Web3Forms email service...');

    // Test basic email
    const testResult = await sendTestEmail('test@example.com');
    console.log('Test email result:', testResult);

    // Test appointment confirmation
    const appointmentResult = await sendAppointmentConfirmation({
      to: 'customer@example.com',
      customer_name: 'John Doe',
      appointment_date: '2025-09-15 10:00 AM',
      service: 'Counseling',
      customer_email: 'john@example.com',
      phone: '+1234567890'
    });
    console.log('Appointment confirmation result:', appointmentResult);
  };

  return (
    <button onClick={handleTestEmail}>
      Test Web3Forms Email Service
    </button>
  );
};

export default TestEmailComponent;
*/
