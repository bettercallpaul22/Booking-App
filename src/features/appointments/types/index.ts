// Domain types for appointments
export type AppointmentId = string

export interface Appointment {
  id: AppointmentId
  customerName: string
  service: string
  startDate: string // ISO string for start date
  endDate: string // ISO string for end date
  time: string // ISO string for time (applied to start date)
  profession?: string
  idNumber: string
  email?: string
  phone?: string
  notes?: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

export interface CreateAppointmentInput {
  customerName: string
  service: string
  startDate: string
  endDate: string
  profession?: string
  idNumber: string
  email?: string
  phone?: string
  notes?: string
}
