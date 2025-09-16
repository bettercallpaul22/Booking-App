import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import type { Appointment } from '../../features/appointments/types';
import NavBar from '../../components/common/NavBar';
import AppointmentList from '../../features/appointments/components/AppointmentList';
import StickyHeader from '../../components/common/StickyHeader';

export default function AppointmentsPage() {
  const items = useSelector((state: RootState) => state.appointments.items);

  // Sort appointments: newly created first (by time), then by start date descending
  const sortedItems = [...items].sort((a: Appointment, b: Appointment) => {
    // First, sort by creation time (newest first)
    const timeA = new Date(a.time).getTime();
    const timeB = new Date(b.time).getTime();

    if (timeA !== timeB) {
      return timeB - timeA; // Newest first
    }

    // If creation times are the same, sort by start date (most recent first)
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();

    return dateB - dateA; // Most recent date first
  });

  return (
    <>
      <NavBar />
      <main style={{  backgroundColor: '#121212', color: '#ffffff', minHeight: '100vh', paddingBottom: '80px' }}>
        {/* <h1>Appointments</h1> */}
        <StickyHeader/>
        <AppointmentList items={sortedItems} />
      </main>
    </>
  );
}
