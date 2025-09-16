import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Appointment, CreateAppointmentInput } from './types';
// import type { Appointment, CreateAppointmentInput } from '../types';

interface AppointmentsState {
  items: Appointment[];
  filter: 'all' | 'scheduled' | 'completed' | 'cancelled';
}

const initialState: AppointmentsState = {
  items: [],
  filter: 'all',
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    addAppointment: (state, action: PayloadAction<CreateAppointmentInput>) => {
      // Use current time for the appointment
      const autoTime = new Date().toISOString();

      const newAppointment: Appointment = {
        id: Date.now().toString(),
        customerName: action.payload.customerName,
        service: action.payload.service,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
        time: autoTime,
        profession: action.payload.profession,
        idNumber: action.payload.idNumber,
        email: action.payload.email,
        phone: action.payload.phone,
        notes: action.payload.notes,
        status: 'scheduled',
      };
      state.items.push(newAppointment);
    },
    removeAppointment: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item: Appointment) => item.id !== action.payload);
    },
    setFilter: (state, action: PayloadAction<'all' | 'scheduled' | 'completed' | 'cancelled'>) => {
      state.filter = action.payload;
    },
    updateAppointmentStatus: (state, action: PayloadAction<{ id: string; status: 'scheduled' | 'completed' | 'cancelled' }>) => {
      const appointment = state.items.find(item => item.id === action.payload.id);
      if (appointment) {
        appointment.status = action.payload.status;
      }
    },
  },
});

export const { addAppointment, removeAppointment, setFilter, updateAppointmentStatus } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
