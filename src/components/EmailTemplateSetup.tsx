import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { setEmailTemplate, completeFirstTimeSetup } from '../features/settings/settingsSlice';

interface EmailTemplateSetupProps {
  open: boolean;
  onClose: () => void;
}

const EmailTemplateSetup: React.FC<EmailTemplateSetupProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [template, setTemplate] = useState(`Your appointment has been successfully scheduled!

Thank you for choosing our service!

Best regards,
Appointment Team`);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const CORRECT_PIN = '1234'; // In production, this should be configurable or stored securely

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPin(value);

    if (value && value !== CORRECT_PIN) {
      setPinError('Incorrect PIN');
    } else {
      setPinError('');
    }
  };

  const handleSave = () => {
    if (pin !== CORRECT_PIN) {
      setPinError('Please enter the correct PIN to save');
      return;
    }

    dispatch(setEmailTemplate(template));
    dispatch(completeFirstTimeSetup());
    onClose();
  };

  const isPinValid = pin === CORRECT_PIN;

  return (
    <Dialog
      open={open}
      onClose={() => {}} // Prevent closing without saving
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        {t("setup_email_template")}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t("setup_email_description")}
        </Typography>

        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Security Required:</strong> Please enter the PIN to save your email template.
          </Typography>
        </Alert>

        <TextField
          fullWidth
          type="password"
          label="Enter PIN"
          value={pin}
          onChange={handlePinChange}
          error={!!pinError}
          helperText={pinError}
          variant="outlined"
          sx={{ mb: 2 }}
          inputProps={{ maxLength: 4 }}
        />

        <TextField
          fullWidth
          multiline
          rows={12}
          label={t("email_template")}
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          size="large"
          disabled={!isPinValid}
        >
          {t("save_template")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailTemplateSetup;
