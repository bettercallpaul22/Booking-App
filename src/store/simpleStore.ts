import { configureStore, combineReducers } from '@reduxjs/toolkit';
import appointmentsReducer from '../features/appointments/appointmentsSlice';

const rootReducer = combineReducers({
  appointments: appointmentsReducer,
});

export const simpleStore = configureStore({
  reducer: rootReducer,
});

export type SimpleRootState = ReturnType<typeof simpleStore.getState>;
export type SimpleAppDispatch = typeof simpleStore.dispatch;
