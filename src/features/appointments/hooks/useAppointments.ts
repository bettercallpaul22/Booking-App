import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../../store'
import { addAppointment } from '../appointmentsSlice'
import type { CreateAppointmentInput } from '../types'

export function useAppointments() {
  const dispatch = useDispatch()
  const items = useSelector((state: RootState) => state.appointments.items)

  async function create(input: CreateAppointmentInput) {
    dispatch(addAppointment(input))
  }

  return { items, create }
}
