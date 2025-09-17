import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  emailTemplate: string;
  pinCode: string;
  isFirstTimeSetup: boolean;
}

const initialState: SettingsState = {
  emailTemplate: `Dear {customer_name},

Your appointment has been successfully scheduled!

Appointment Details:
- Service: {service}
- Date & Time: {appointment_date}
- Email: {customer_email}
- Phone: {phone}

Thank you for choosing our service!

Best regards,
Appointment Team`,
  pinCode: '1234', // Default PIN
  isFirstTimeSetup: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setEmailTemplate: (state, action: PayloadAction<string>) => {
      state.emailTemplate = action.payload;
    },
    setPinCode: (state, action: PayloadAction<string>) => {
      state.pinCode = action.payload;
    },
    completeFirstTimeSetup: (state) => {
      state.isFirstTimeSetup = false;
    },
    updateEmailTemplate: (state, action: PayloadAction<string>) => {
      state.emailTemplate = action.payload;
    },
  },
});

export const { setEmailTemplate, setPinCode, completeFirstTimeSetup, updateEmailTemplate } = settingsSlice.actions;
export default settingsSlice.reducer;
