import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box
} from '@mui/material';
import {
  Add as AddIcon,
  EventNote as EventNoteIcon,
  People as PeopleIcon,
  Church as ChurchIcon
} from '@mui/icons-material';

const NavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
      <BottomNavigation
        value={getActiveValue()}
        onChange={handleNavigation}
        showLabels
        sx={{
          backgroundColor: 'transparent',
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
          label="Add"
          icon={<AddIcon />}
          sx={{
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.75rem',
            },
          }}
        />
        <BottomNavigationAction
          label="Appointments"
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
    </AppBar>
  );
};

export default NavBar;
