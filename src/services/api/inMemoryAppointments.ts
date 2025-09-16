import type { Appointment, AppointmentId, CreateAppointmentInput } from '../../features/appointments/types'

// Simple in-memory store for demo/dev
let store: Appointment[] = []

export const appointmentsApi = {
  list(): Promise<Appointment[]> {
    return Promise.resolve([...store])
  },
  get(id: AppointmentId): Promise<Appointment | undefined> {
    return Promise.resolve(store.find(a => a.id === id))
  },
  create(input: CreateAppointmentInput): Promise<Appointment> {
    const appointment: Appointment = {
      id: crypto.randomUUID(),
      status: 'scheduled',
      time: new Date().toISOString(),
      ...input,
    }
    store.push(appointment)
    return Promise.resolve(appointment)
  },
  update(id: AppointmentId, patch: Partial<Omit<Appointment, 'id'>>): Promise<Appointment | undefined> {
    const idx = store.findIndex(a => a.id === id)
    if (idx === -1) return Promise.resolve(undefined)
    store[idx] = { ...store[idx], ...patch }
    return Promise.resolve(store[idx])
  },
  remove(id: AppointmentId): Promise<boolean> {
    const before = store.length
    store = store.filter(a => a.id !== id)
    return Promise.resolve(store.length < before)
  }
}
