import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import i18n from '../config/i18n';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Fade,
  useTheme,
  alpha
} from '@mui/material';
import {
  AdminPanelSettingsOutlined,
  ArrowForwardOutlined,
  BookOnlineOutlined,
  EventAvailableOutlined
} from '@mui/icons-material';
import EmailTemplateSetup from './EmailTemplateSetup';
import type { RootState } from '../store';

const LaunchScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [language, setLanguage] = useState(i18n.language || "en");
  const [showSetup, setShowSetup] = useState(false);

  const settings = useSelector((state: RootState) => state.settings);

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  const handleEnterApp = () => {
    if (settings.isFirstTimeSetup) {
      setShowSetup(true);
    } else {
      navigate('/add-appointment');
    }
  };

  const handleSetupComplete = () => {
    setShowSetup(false);
    navigate('/add-appointment');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={1000}>
          <Paper
            elevation={24}
            sx={{
              p: { xs: 4, sm: 6 },
              textAlign: 'center',
              borderRadius: 4,
              background: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Decorative elements */}
            <Box
              sx={{
                position: 'absolute',
                top: -20,
                left: -20,
                width: 100,
                height: 100,
                background: `linear-gradient(45deg, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.secondary.light, 0.1)})`,
                borderRadius: '50%',
                filter: 'blur(20px)'
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                right: -30,
                width: 120,
                height: 120,
                background: `linear-gradient(-45deg, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.secondary.light, 0.1)})`,
                borderRadius: '50%',
                filter: 'blur(25px)'
              }}
            />

            {/* Logo and Icon */}
            <Box
              sx={{
                mb: 3,
                position: 'relative'
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  mb: 2,
                  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`
                }}
              >
                <BookOnlineOutlined
                  sx={{
                    fontSize: 48,
                    color: 'white'
                  }}
                />
              </Box>
            </Box>

            {/* Language Switch */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, gap: 1 }}>
              <Button
                variant={language === "en" ? "contained" : "outlined"}
                onClick={() => handleLanguageChange("en")}
                size="small"
                sx={{ textTransform: 'none' }}
              >
                {t("english")}
              </Button>
              <Button
                variant={language === "el" ? "contained" : "outlined"}
                onClick={() => handleLanguageChange("el")}
                size="small"
                sx={{ textTransform: 'none' }}
              >
                {t("greek")}
              </Button>
            </Box>

            {/* Main Title */}
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 1,
                background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: { xs: '2.5rem', sm: '3rem' }
              }}
            >
              {t("guest_booking")}
            </Typography>

            {/* Tagline */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <EventAvailableOutlined 
                sx={{ 
                  mr: 1, 
                  color: theme.palette.text.secondary,
                  fontSize: '1.2rem'
                }} 
              />
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 400,
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                {t("managing_appointments")}
              </Typography>
            </Box>

            {/* Features */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 4,
                gap: 1,
                flexWrap: 'wrap'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AdminPanelSettingsOutlined sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  {t("admin_panel")}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                •
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                {t("schedule_management")}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                •
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                {t("guest_services")}
              </Typography>
            </Box>

            {/* Enter App Button */}
            <Button
              variant="contained"
              size="large"
              onClick={handleEnterApp}
              endIcon={<ArrowForwardOutlined />}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                }
              }}
            >
              {t("enter_app")}
            </Button>

            {/* Version Info */}
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 3,
                color: alpha(theme.palette.text.secondary, 0.6),
                fontSize: '0.75rem'
              }}
            >
              {t("version")} 1.0 • {t("built_by")}
            </Typography>
          </Paper>
        </Fade>
      </Container>

      {/* Email Template Setup Dialog */}
      <EmailTemplateSetup
        open={showSetup}
        onClose={handleSetupComplete}
      />
    </Box>
  );
};

export default LaunchScreen;
