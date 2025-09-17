import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../config/i18n";
import { useDispatch, useSelector } from "react-redux";
import { addAppointment } from "../../features/appointments/appointmentsSlice";
import type { RootState } from "../../store";
import { sendAppointmentConfirmation } from "../../services/email/emailService";
import NavBar from "../../components/common/NavBar";
import "./HomePage.css";
import dayjs, { Dayjs } from "dayjs";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Badge } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EventNoteIcon from '@mui/icons-material/EventNote';
import EmailIcon from '@mui/icons-material/Email';
import { Box, TextField } from "@mui/material";

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const existingAppointments = useSelector(
    (state: RootState) => (state.appointments as any).items || []
  );
  const emailTemplate = useSelector((state: RootState) => state.settings.emailTemplate);

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().add(1, 'day'));
  const [port, setPort] = useState<string>("Ουρανούπολη");

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    profession: "",
    idNumber: "",
    service: "",
  });

  const navigate = useNavigate();
  const [successOpen, setSuccessOpen] = useState(false);
  const [appointmentDetailsOpen, setAppointmentDetailsOpen] = useState(false);
  const [selectedDateAppointments, setSelectedDateAppointments] = useState<any[]>([]);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handlePortChange = (event: any) => {
    setPort(event.target.value);
  };

  const handleUserInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailSending(true);
    setEmailError(null);

    try {
      // Ensure dates are not null
      if (!startDate || !endDate) {
        setEmailError('Please select both start and end dates.');
        setIsEmailSending(false);
        return;
      }

      const appointmentData = {
        customerName: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        profession: userInfo.profession,
        idNumber: userInfo.idNumber,
        service: port,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        time: dayjs().toISOString(),
        status: 'pending' as const,
      };

      dispatch(addAppointment(appointmentData));

      if (userInfo.email) {
        await sendAppointmentConfirmation({
          to: userInfo.email,
          customer_name: userInfo.name,
          appointment_date: `${startDate.format("dddd, MMM D, YYYY")} to ${endDate.format("dddd, MMM D, YYYY")}`,
          service: port,
          customer_email: userInfo.email,
          phone: userInfo.phone,
        }, emailTemplate);
      }

      setSuccessOpen(true);
    } catch (error) {
      console.error('Error creating appointment:', error);
      setEmailError('Failed to send email. Please try again.');
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
            {t("schedule_appointment")}
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} className="appointment-form" sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
          <Box className="form-section" sx={{ mb: 4 }}>
            <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 600, color: '#1976d2' }}>
              {t("personal_information")}
            </Typography>

            <TextField
              fullWidth
              required
              label={t("full_name")}
              name="name"
              value={userInfo.name}
              onChange={handleUserInfoChange}
              placeholder={t("enter_full_name")}
              sx={{ mb: 2 }}
              variant="outlined"
            />

            <TextField
              fullWidth
              type="email"
              label={t("email_address")}
              name="email"
              value={userInfo.email}
              onChange={handleUserInfoChange}
              placeholder={t("enter_email")}
              sx={{ mb: 2 }}
              variant="outlined"
            />

            <TextField
              fullWidth
              type="tel"
              label={t("phone_number")}
              name="phone"
              value={userInfo.phone}
              onChange={handleUserInfoChange}
              placeholder={t("enter_phone")}
              sx={{ mb: 2 }}
              variant="outlined"
            />

            <TextField
              fullWidth
              label={t("profession")}
              name="profession"
              value={userInfo.profession}
              onChange={handleUserInfoChange}
              placeholder={t("enter_profession")}
              sx={{ mb: 2 }}
              variant="outlined"
            />

            <TextField
              fullWidth
              required
              label={t("id_number")}
              name="idNumber"
              value={userInfo.idNumber}
              onChange={handleUserInfoChange}
              placeholder={t("enter_id")}
              sx={{ mb: 3 }}
              variant="outlined"
            />

            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend" sx={{ mb: 1, fontWeight: 500 }}>{t("port")}</FormLabel>
              <RadioGroup
                name="controlled-radio-buttons-group"
                value={port}
                onChange={handlePortChange}
                sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}
              >
                <FormControlLabel value="Ουρανούπολη" control={<Radio />} label={t("ouranoupoli")} />
                <FormControlLabel value="Ιερισσός" control={<Radio />} label={t("ierissos")} />
              </RadioGroup>
            </FormControl>
          </Box>

          <Box className="form-section" sx={{ mb: 4 }}>
            <Box className="datetime-group" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                {t("from_to")} *
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: "column" }}>
                  <DatePicker
                    label={t("start_date")}
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    shouldDisableDate={shouldDisableDate}
                    slots={{
                      day: CustomDay,
                    }}
                    sx={{ flex: 1 }}
                  />
                  <DatePicker
                    label={t("end_date")}
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    shouldDisableDate={shouldDisableDate}
                    slots={{
                      day: CustomDay,
                    }}
                    sx={{ flex: 1 }}
                  />
                </Box>
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
              {isEmailSending ? t("sending_email") : t("send_email")}
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
          <DialogTitle sx={{ fontWeight: 700 }}>{t("email_sent")}</DialogTitle>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => setSuccessOpen(false)}
            >
              {t("return")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setSuccessOpen(false);
                navigate("/appointments");
              }}
            >
              {t("view_bookings")}
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
            {t("appointments_for")} {startDate ? dayjs(startDate).format("dddd, MMM D, YYYY") : ""}
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
              <Typography variant="body1">{t("no_appointments")}</Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => setAppointmentDetailsOpen(false)}
            >
              {t("close")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setAppointmentDetailsOpen(false);
                navigate("/appointments");
              }}
            >
              {t("view_all_appointments")}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <NavBar />
    </>
  );
};

export default HomePage;
