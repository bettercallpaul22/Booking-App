import NavBar from '../../components/common/NavBar'
import AppointmentForm from '../../features/appointments/components/AppointmentForm'
import { useAppointments } from '../../features/appointments/hooks/useAppointments'

export default function BookingPage() {
  const { create } = useAppointments()

  return (
    <>
      <NavBar />
      <main style={{ padding: 24 }}>
        <h1>Book an Appointment</h1>
        <AppointmentForm onSubmit={async (input) => { await create(input) }} />
      </main>
    </>
  )
}