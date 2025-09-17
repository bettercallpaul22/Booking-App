import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { updateEmailTemplate } from '../features/settings/settingsSlice';
import type { RootState } from '../store';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);

  const [activeStep, setActiveStep] = useState(0);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [template, setTemplate] = useState(settings.emailTemplate);

  const steps = [t('enter_pin'), t('edit_email_template')];

  const handlePinSubmit = () => {
    if (pin === settings.pinCode) {
      setPinError('');
      setActiveStep(1);
    } else {
      setPinError(t('invalid_pin'));
    }
  };

  const handleSave = () => {
    dispatch(updateEmailTemplate(template));
    onClose();
  };

  const handleClose = () => {
    setActiveStep(0);
    setPin('');
    setPinError('');
    setTemplate(settings.emailTemplate);
    onClose();
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t("pin_required")}
            </Typography>
            <TextField
              fullWidth
              type="password"
              label={t("enter_pin")}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              error={!!pinError}
              helperText={pinError}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handlePinSubmit();
                }
              }}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Available placeholders:</strong> {"{customer_name}, {service}, {appointment_date}, {customer_email}, {phone}"}
              </Typography>
            </Alert>

            <TextField
              fullWidth
              multiline
              rows={12}
              label={t("email_template")}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              variant="outlined"
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        {t("settings")}
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          {t("cancel")}
        </Button>
        {activeStep === 0 ? (
          <Button onClick={handlePinSubmit} variant="contained" color="primary">
            {t("enter_pin")}
          </Button>
        ) : (
          <Button onClick={handleSave} variant="contained" color="primary">
            {t("save_changes")}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SettingsModal;
