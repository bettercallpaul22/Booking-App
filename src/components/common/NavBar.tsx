import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box,
  IconButton,
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  EventNote as EventNoteIcon,
  People as PeopleIcon,
  Church as ChurchIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import SettingsModal from '../SettingsModal';

const NavBar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const getActiveValue = () => {
    switch (location.pathname) {
      case '/add-appointment':
        return 0;
      case '/appointments':
        return 1;
      case '/users':
        return 2;
      case '/services':
        return 3;
      default:
        return 0;
    }
  };

  const handleNavigation = (_event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/add-appointment');
        break;
      case 1:
        navigate('/appointments');
        break;
      case 2:
        navigate('/users');
        break;
      case 3:
        navigate('/services');
        break;
      default:
        break;
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          top: 'auto',
          bottom: 0,
          backgroundColor: 'white',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1 }}>
          <BottomNavigation
            value={getActiveValue()}
            onChange={handleNavigation}
            showLabels
            sx={{
              backgroundColor: 'transparent',
              flex: 1,
              '& .MuiBottomNavigationAction-root': {
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'primary.main',
                },
                '&.Mui-selected::after': {
                  display: 'none',
                },
                '&.Mui-selected::before': {
                  display: 'none',
                },
                minWidth: 'auto',
                padding: '6px 12px',
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                backgroundColor: 'transparent',
              },
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.75rem',
                fontWeight: 500,
                marginTop: '4px',
              },
            }}
          >
            <BottomNavigationAction
              label={t("add")}
              icon={<AddIcon />}
              sx={{
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.75rem',
                },
              }}
            />
            <BottomNavigationAction
              label={t("appointments")}
              icon={<EventNoteIcon />}
              sx={{
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.75rem',
                },
              }}
            />
            {/* <BottomNavigationAction
              label="Users"
              icon={<PeopleIcon />}
              sx={{
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.75rem',
                },
              }}
            />
            <BottomNavigationAction
              label="Services"
              icon={<ChurchIcon />}
              sx={{
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.75rem',
                },
              }}
            /> */}
          </BottomNavigation>

          <IconButton
            onClick={() => setSettingsOpen(true)}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Box>
      </AppBar>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
};

export default NavBar;
