import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAppointment } from "../../features/appointments/appointmentsSlice";
import type { RootState } from "../../store";
import NavBar from "../../components/common/NavBar";
import "./HomePage.css";
import { sendAppointmentConfirmation } from "../../services/email/emailService";
import { CalendarMonth as CalendarMonthIcon } from "@mui/icons-material";
import dayjs, { Dayjs } from "dayjs";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { TimePicker } from "@mui/x-date-pickers";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Badge, TextField, Box, alpha } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EventNoteIcon from '@mui/icons-material/EventNote'
import EmailIcon from '@mui/icons-material/Email';;

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const existingAppointments = useSelector(
    (state: RootState) => (state.appointments as any).items || []
  );
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs().add(1, 'day'));
  const [time, setTime] = React.useState<Dayjs | null>(dayjs());
  const [port, setPort] = React.useState<string>("port1");

  const handlePortChange = (event:any) => {
    setPort(event.target.value);
  };


  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    profession: "",
    idNumber: "",
    service: "",
  });

  const handleUserInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  const [successOpen, setSuccessOpen] = useState(false);
  const [lastCreated, setLastCreated] = useState<{ customerName: string; startDate: string; endDate: string; time: string } | null>(null);
  const [appointmentDetailsOpen, setAppointmentDetailsOpen] = useState(false);
  const [selectedDateAppointments, setSelectedDateAppointments] = useState<any[]>([]);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !time) {
      alert("Please select a date range and time.");
      return;
    }
    const startDateStr = startDate.toISOString();
    const endDateStr = endDate.toISOString();
    const timeStr = time.toISOString();

    // Check for date conflict - check if any date in the range has appointments at the same time
    const isConflict = existingAppointments.some((appt: any) => {
      if (appt.startDate && appt.endDate && appt.time) {
        const apptStart = dayjs(appt.startDate);
        const apptEnd = dayjs(appt.endDate);
        const apptTime = dayjs(appt.time);
        const selectedStart = dayjs(startDateStr);
        const selectedEnd = dayjs(endDateStr);
        const selectedTime = dayjs(timeStr);

        // Check if date ranges overlap and times match
        const datesOverlap = selectedStart.isBefore(apptEnd) && selectedEnd.isAfter(apptStart);
        const timesMatch = selectedTime.format("HH:mm") === apptTime.format("HH:mm");

        return datesOverlap && timesMatch;
      }
      return false;
    });

    if (isConflict) {
      alert("There is a conflict with existing appointments in the selected date range and time. Please choose a different time or date range.");
      return;
    }

    setIsEmailSending(true);
    setEmailError(null);

    try {
      // Send email first
      const emailSent = await sendAppointmentConfirmation({
        to: userInfo.email,
        customer_name: userInfo.name,
        appointment_date: `${dayjs(startDate).format("dddd, MMMM D, YYYY")} to ${dayjs(endDate).format("dddd, MMMM D, YYYY")} at ${dayjs(timeStr).format("h:mm A")}`,
        service: port,
        customer_email: userInfo.email,
        phone: userInfo.phone,
      });

      if (!emailSent) {
        throw new Error("Failed to send confirmation email");
      }

      // Only save to Redux store after successful email
      dispatch(
        addAppointment({
          customerName: userInfo.name,
          service: port,
          startDate: startDateStr,
          endDate: endDateStr,
          profession: userInfo.profession || undefined,
          idNumber: userInfo.idNumber,
          email: userInfo.email || undefined,
          phone: userInfo.phone || undefined,
          notes: undefined,
        })
      );

      // Save info for modal and show it
      setLastCreated({ customerName: userInfo.name, startDate: startDateStr, endDate: endDateStr, time: timeStr });
      setSuccessOpen(true);

      // Reset form
      setUserInfo({
        name: "",
        email: "",
        phone: "",
        profession: "",
        idNumber: "",
        service: "",
      });
      setPort("port1");
      setStartDate(dayjs());
      setEndDate(dayjs().add(1, 'day'));
      setTime(dayjs());
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      setEmailError("Failed to send confirmation email. Please try again.");
    } finally {
      setIsEmailSending(false);
    }
  };

  // Build a set of dates (YYYY-MM-DD) that already have appointments
  const highlightedDates = React.useMemo(() => {
    const dates = new Set<string>();
    (existingAppointments as any[]).forEach((appt: any) => {
      if (appt?.startDate && appt?.endDate) {
        // Add all dates in the range
        let current = dayjs(appt.startDate);
        const end = dayjs(appt.endDate);
        while (current.isBefore(end) || current.isSame(end, 'day')) {
          dates.add(current.format("YYYY-MM-DD"));
          current = current.add(1, 'day');
        }
      }
    });
    return dates;
  }, [existingAppointments]);

  // Function to disable past dates only (allow multiple appointments on same date)
  const shouldDisableDate = (date: Dayjs) => {
    const isPastDate = date.isBefore(dayjs(), 'day');
    return isPastDate;
  };

  const CustomDay = (props: any) => {
    const { day, ...otherProps } = props;
    const hasAppointment = highlightedDates.has(day.format("YYYY-MM-DD"));

    return (
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        badgeContent={hasAppointment ? <CheckCircle sx={{ fontSize: 14, color: '#2e7d32' }} /> : null}
      >
        <PickersDay
          {...otherProps}
          day={day}
          disableMargin
          sx={{
            position: "relative",
          }}
        />
      </Badge>
    );
  };

  return (
    <>
      <div className="home-page">
        <Box className="header" sx={{ textAlign: 'center', py: 3 }}>
          <Box className="appointment-icon" sx={{ mb: 2 }}>
            <EventNoteIcon sx={{ fontSize: 48, color: '#c5e317ff' }} />
          </Box>
          <Typography variant="h3" component="h1" sx={{ mb: 1, fontWeight: 700, color: '#1976d2' }}>
            Schedule Appointment
          </Typography>
          {/* <Typography variant="h3" sx={{ color: '#666', fontSize: '1.1rem' }}>
            Book your service with us
          </Typography> */}
        </Box>

        <Box component="form" onSubmit={handleSubmit} className="appointment-form" sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
          <Box className="form-section" sx={{ mb: 4 }}>
            <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 600, color: '#1976d2' }}>
              Personal Information
            </Typography>

            <TextField
              fullWidth
              required
              label="Full Name"
              name="name"
              value={userInfo.name}
              onChange={handleUserInfoChange}
              placeholder="Enter your full name"
              sx={{ mb: 2 }}
              variant="outlined"
            />

            <TextField
              fullWidth
              type="email"
              label="Email Address (optional)"
              name="email"
              value={userInfo.email}
              onChange={handleUserInfoChange}
              placeholder="Enter your email"
              sx={{ mb: 2 }}
              variant="outlined"
            />

            <TextField
              fullWidth
              type="tel"
              label="Phone Number (optional)"
              name="phone"
              value={userInfo.phone}
              onChange={handleUserInfoChange}
              placeholder="Enter your phone number"
              sx={{ mb: 2 }}
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Profession"
              name="profession"
              value={userInfo.profession}
              onChange={handleUserInfoChange}
              placeholder="Enter your profession (optional)"
              sx={{ mb: 2 }}
              variant="outlined"
            />

            <TextField
              fullWidth
              required
              label="ID Number"
              name="idNumber"
              value={userInfo.idNumber}
              onChange={handleUserInfoChange}
              placeholder="Enter your ID number"
              sx={{ mb: 3 }}
              variant="outlined"
            />

            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend" sx={{ mb: 1, fontWeight: 500 }}>Port</FormLabel>
              <RadioGroup
                name="controlled-radio-buttons-group"
                value={port}
                onChange={handlePortChange}
                sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}
              >
                <FormControlLabel value="port1" control={<Radio />} label="Port 1" />
                <FormControlLabel value="port2" control={<Radio />} label="Port 2" />
              </RadioGroup>
            </FormControl>

          </Box>

          <Box className="form-section" sx={{ mb: 4 }}>
            {/* <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 600, color: '#1976d2' }}>
              Appointment Details
            </Typography> */}

            <Box className="datetime-group" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                From - To *
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection:"column" }}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    shouldDisableDate={shouldDisableDate}
                    slots={{
                      day: CustomDay,
                    }}
                    sx={{ flex: 1 }}
                  />
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    shouldDisableDate={shouldDisableDate}
                    slots={{
                      day: CustomDay,
                    }}
                    sx={{ flex: 1 }}
                  />
                </Box>
                {/* <TimePicker
                  label="Select Time"
                  value={time}
                  onChange={(newValue) => setTime(newValue)}
                /> */}
              </LocalizationProvider>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isEmailSending}
              startIcon={isEmailSending ? null : <EmailIcon sx={{ color: '#ffd700' }} />}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
                '&:disabled': {
                  backgroundColor: '#ccc',
                },
              }}
            >
              {isEmailSending ? 'Sending Email...' : 'Send Email'}
            </Button>
          </Box>

          {emailError && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#ffebee', borderRadius: 1, border: '1px solid #f44336' }}>
              <Typography variant="body2" color="error">
                {emailError}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Success Modal */}
        <Dialog
          open={successOpen}
          onClose={() => setSuccessOpen(false)}
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 1,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Email Sent</DialogTitle>
          {/* <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {lastCreated
                ? `${lastCreated.customerName}, your appointment is set from ${dayjs(lastCreated.startDate).format("dddd, MMM D, YYYY")} to ${dayjs(lastCreated.endDate).format("dddd, MMM D, YYYY")} at ${dayjs(lastCreated.time).format("h:mm A")}.`
                : "Your appointment was created successfully."}
            </Typography>
          </DialogContent> */}
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => setSuccessOpen(false)}
            >
              Return
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setSuccessOpen(false);
                navigate("/appointments");
              }}
            >
              View Bookings
            </Button>
          </DialogActions>
        </Dialog>

        {/* Appointment Details Modal */}
        <Dialog
          open={appointmentDetailsOpen}
          onClose={() => setAppointmentDetailsOpen(false)}
          fullWidth
          maxWidth="md"
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 1,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>
            Appointments for {startDate ? dayjs(startDate).format("dddd, MMM D, YYYY") : ""}
          </DialogTitle>
          <DialogContent>
            {selectedDateAppointments.length > 0 ? (
              selectedDateAppointments.map((appointment, index) => (
                <div key={appointment.id} style={{ marginBottom: "16px", padding: "16px", border: "1px solid #e0e0e0", borderRadius: "8px" }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Appointment {index + 1}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Customer:</strong> {appointment.customerName}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Port:</strong> {appointment.service}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Time:</strong> {dayjs(appointment.time).format("h:mm A")}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>ID Number:</strong> {appointment.idNumber}
                  </Typography>
                  {appointment.profession && (
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Profession:</strong> {appointment.profession}
                    </Typography>
                  )}
                  {appointment.notes && (
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Notes:</strong> {appointment.notes}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ color: appointment.status === 'completed' ? 'green' : appointment.status === 'cancelled' ? 'red' : 'orange' }}>
                    <strong>Status:</strong> {appointment.status}
                  </Typography>
                </div>
              ))
            ) : (
              <Typography variant="body1">No appointments found for this date.</Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => setAppointmentDetailsOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setAppointmentDetailsOpen(false);
                navigate("/appointments");
              }}
            >
              View All Appointments
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <NavBar />
    </>
  );
};

export default HomePage;
