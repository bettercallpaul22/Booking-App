import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import TestComponent from '../components/TestComponent'
import LaunchScreen from '../components/LaunchScreen'
import MainPage from '../pages/Main/MainPage'
import HomePage from '../pages/Home/HomePage'
import AppointmentsPage from '../pages/Appointments/AppointmentsPage'
import UsersPage from '../pages/Users/UsersPage'
import ServicesPage from '../pages/Services/ServicesPage'
import BookingPage from '../pages/Booking/BookingPage'
import NotFoundPage from '../pages/NotFound/NotFoundPage'

// Create the router with basic routes
const router = createBrowserRouter([
  { path: '/', element: <LaunchScreen /> },
  { path: '/main', element: <MainPage /> },
  { path: '/add-appointment', element: <HomePage /> },
  { path: '/appointments', element: <AppointmentsPage /> },
  { path: '/booking', element: <BookingPage /> },
  { path: '/users', element: <UsersPage /> },
  { path: '/services', element: <ServicesPage /> },
  { path: '*', element: <NotFoundPage /> },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
