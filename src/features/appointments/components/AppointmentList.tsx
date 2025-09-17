import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { removeAppointment, updateAppointmentStatus } from '../appointmentsSlice';
import type { RootState } from '../../../store';
import type { Appointment } from '../types';
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Button,
  Stack,
  Divider,
  Container,
  useTheme,
  alpha,
  Modal,
  Fade,
  Backdrop
} from '@mui/material';
import {
  Favorite as HeartIcon,
  ChildCare as BabyIcon,
  Church as CrossIcon,
  Chat as MessageCircleIcon,
  Description as FileTextIcon,
  CalendarToday as CalendarIcon,
  AccessTime as ClockIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  CheckCircle as CheckIcon,
  Cancel as XIcon,
  Refresh as RotateCcwIcon,
  Delete as Trash2Icon,
  Warning as WarningIcon
} from '@mui/icons-material';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import RememberMeIcon from '@mui/icons-material/RememberMe';

import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

type Props = {
  items: Appointment[];
};

export default function AppointmentList({ items }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const currentFilter = useSelector((state: RootState) => state.appointments.filter);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    appointment: Appointment | null;
  }>({ open: false, appointment: null });

  const filteredItems = items
    .filter(item => {
      if (currentFilter === 'all') return true;
      return item.status === currentFilter;
    })
    .sort((a, b) => {
      // Sort by start date in descending order (newest first)
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateB.getTime() - dateA.getTime();
    });

  const getServiceIcon = (service: string) => {
    const iconProps = { fontSize: 'small' as const, sx: { color: theme.palette.primary.main } };

    switch (service.toLowerCase()) {
      case 'wedding':
        return <HeartIcon {...iconProps} />;
      case 'baptism':
        return <BabyIcon {...iconProps} />;
      case 'funeral':
        return <CrossIcon {...iconProps} />;
      case 'counseling':
        return <MessageCircleIcon {...iconProps} />;
      default:
        return <FileTextIcon {...iconProps} />;
    }
  };

  const getTranslatedServiceName = (service: string) => {
    const serviceKey = service.toLowerCase();
    return t(serviceKey) || service.charAt(0).toUpperCase() + service.slice(1);
  };

  const getTranslatedStatus = (status: string) => {
    const statusKey = status.toLowerCase();
    return t(statusKey) || status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusChipColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDateTime = (startDate: string, endDate: string, time: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDate = new Date(time);
    const dateStr = `${start.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })} - ${end.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })}`;
    const timeStr = timeDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return { date: dateStr, time: timeStr };
  };

  const handleDelete = (appointment: Appointment) => {
    setDeleteModal({ open: true, appointment });
  };

  const confirmDelete = () => {
    if (deleteModal.appointment) {
      dispatch(removeAppointment(deleteModal.appointment.id));
      setDeleteModal({ open: false, appointment: null });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ open: false, appointment: null });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#fafafa',
        py: 3
      }}
    >
      <Container maxWidth="lg">
        {filteredItems.length === 0 ? (
          <Paper
            elevation={2}
            sx={{
              p: 6,
              textAlign: 'center',
              backgroundColor: 'white'
            }}
          >
            <CalendarIcon 
              sx={{ 
                fontSize: 64, 
                color: theme.palette.grey[400],
                mb: 2 
              }} 
            />
            <Typography variant="h5" gutterBottom color="text.secondary">
              {t("no_appointments_found")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {currentFilter === 'all'
                ? t("appointments_will_appear")
                : t("no_filtered_appointments", { filter: currentFilter })}
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {filteredItems.map((appointment) => {
              const { date, time } = formatDateTime(appointment.startDate, appointment.endDate, appointment.time);
              return (
                <Paper
                  key={appointment.id}
                  elevation={3}
                  sx={{
                    p: 3,
                    backgroundColor: '#e8e8e8',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      elevation: 6,
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[8]
                    }
                  }}
                >
                  {/* Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          backgroundColor: alpha(theme.palette.primary.main, 0.1)
                        }}
                      >
                        {getServiceIcon(appointment.service)}
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {appointment.customerName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {getTranslatedServiceName(appointment.service)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Chip
                      label={getTranslatedStatus(appointment.status)}
                      color={getStatusChipColor(appointment.status) as any}
                      variant="filled"
                      size="small"
                      sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                    />
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Details */}
                  <Box sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={4} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {date}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ClockIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {time}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <RememberMeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {t("id_label")}: {appointment.idNumber}
                        </Typography>
                      </Box>
                      {appointment.profession && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BusinessCenterIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {appointment.profession}
                          </Typography>
                        </Box>
                      )}
                      {appointment.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           <LocalPhoneIcon sx={{ color: 'gray' }} fontSize='small' />

                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {appointment.phone}
                          </Typography>
                        </Box>
                      )}
                      {appointment.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           <EmailIcon sx={{ color: 'gray' }} fontSize='small' />
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                             {appointment.email}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {appointment.status === 'scheduled' && (
                        <>
                          <Button
                            onClick={() => dispatch(updateAppointmentStatus({ id: appointment.id, status: 'completed' }))}
                            color="success"
                            variant="outlined"
                            size="small"
                            startIcon={<CheckIcon />}
                          >
                            {t("complete")}
                          </Button>
                          <Button
                            onClick={() => dispatch(updateAppointmentStatus({ id: appointment.id, status: 'cancelled' }))}
                            color="error"
                            variant="outlined"
                            size="small"
                            startIcon={<XIcon />}
                          >
                            {t("cancel")}
                          </Button>
                        </>
                      )}
                      {(appointment.status === 'completed' || appointment.status === 'cancelled') && (
                        <Button
                          onClick={() => dispatch(updateAppointmentStatus({ id: appointment.id, status: 'scheduled' }))}
                          color="primary"
                          variant="outlined"
                          size="small"
                          startIcon={<RotateCcwIcon />}
                        >
                          {t("reset")}
                        </Button>
                      )}
                    </Box>

                    <IconButton
                      onClick={() => handleDelete(appointment)}
                      color="error"
                      size="small"
                      sx={{
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.error.main, 0.1)
                        }
                      }}
                    >
                      <Trash2Icon />
                    </IconButton>
                  </Box>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModal.open}
        onClose={cancelDelete}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
        }}
      >
        <Fade in={deleteModal.open}>
          <Paper
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 450 },
              maxWidth: 500,
              borderRadius: 3,
              p: 4,
              outline: 'none',
              boxShadow: theme.shadows[24]
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}
              >
                <WarningIcon
                  sx={{
                    fontSize: 40,
                    color: theme.palette.error.main
                  }}
                />
              </Box>
              
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                {t("delete_appointment")}
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {t("sure_delete")}
              </Typography>
            </Box>

            {deleteModal.appointment && (
              <Paper
                elevation={1}
                sx={{
                  p: 2.5,
                  backgroundColor: alpha(theme.palette.error.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                  borderRadius: 2,
                  mb: 3
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                  <Box
                    sx={{
                      p: 0.75,
                      borderRadius: 1,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1)
                    }}
                  >
                    {getServiceIcon(deleteModal.appointment.service)}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {deleteModal.appointment.customerName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getTranslatedServiceName(deleteModal.appointment.service)}
                    </Typography>
                  </Box>
                  <Chip
                    label={getTranslatedStatus(deleteModal.appointment.status)}
                    color={getStatusChipColor(deleteModal.appointment.status) as any}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatDateTime(deleteModal.appointment.startDate, deleteModal.appointment.endDate, deleteModal.appointment.time).date}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ClockIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatDateTime(deleteModal.appointment.startDate, deleteModal.appointment.endDate, deleteModal.appointment.time).time}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                onClick={cancelDelete}
                variant="outlined"
                color="inherit"
                size="large"
                sx={{
                  minWidth: 120,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                {t("cancel")}
              </Button>
              <Button
                onClick={confirmDelete}
                variant="contained"
                color="error"
                size="large"
                startIcon={<Trash2Icon />}
                sx={{
                  minWidth: 120,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: theme.shadows[4],
                  '&:hover': {
                    boxShadow: theme.shadows[8]
                  }
                }}
              >
                {t("delete")}
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Modal>
    </Box>
  );
}
