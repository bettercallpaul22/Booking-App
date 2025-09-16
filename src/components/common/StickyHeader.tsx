import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Chip,
  InputAdornment,
  TextField,
  IconButton,
  Box,
  Paper,
  Stack
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  Description as AllIcon,
  Schedule as PendingIcon,
  CheckCircle as CompletedIcon,
  Cancel as CancelledIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import type { RootState } from '../../store';
import { setFilter } from '../../features/appointments/appointmentsSlice';

type FilterKey = 'all' | 'scheduled' | 'completed' | 'cancelled';

interface StickyHeaderProps {
  title?: string;
  totalCount?: number;
  filteredCount?: number;
  showSearch?: boolean;
  onSearch?: (searchTerm: string) => void;
  searchPlaceholder?: string;
}

const StickyHeader: React.FC<StickyHeaderProps> = ({
  title = "Appointments",
  totalCount = 0,
  filteredCount,
  showSearch = false,
  onSearch,
  searchPlaceholder = "Search appointments..."
}) => {
  const dispatch = useDispatch();
  const currentFilter = useSelector((state: RootState) => state.appointments.filter);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filterButtons: { key: FilterKey; label: string; icon: React.ReactElement }[] = [
    {
      key: 'all',
      label: 'All',
      icon: <AllIcon />
    },
    {
      key: 'scheduled',
      label: 'Pending',
      icon: <PendingIcon />
    },
    {
      key: 'completed',
      label: 'Completed',
      icon: <CompletedIcon />
    },
    {
      key: 'cancelled',
      label: 'Cancelled',
      icon: <CancelledIcon />
    }
  ];

  const handleFilterClick = (filterKey: FilterKey) => {
    dispatch(setFilter(filterKey));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  const displayCount = filteredCount !== undefined ? filteredCount : totalCount;

  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{
        backgroundColor: '#f8fafc',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      }}
    >
      <Toolbar sx={{ flexDirection: 'column', alignItems: 'stretch', py: 2 }}>
        {/* Header Title Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarIcon color="primary" />
            <Typography variant="h5" component="h1" fontWeight="bold">
              {title}
            </Typography>
            <Chip
              label={displayCount}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>

          {/* Search Section */}
          {showSearch && (
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ minWidth: 250 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={clearSearch}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Box>

        {/* Filter Buttons Section */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            flexWrap: 'wrap',
            px: 1,
            py: 1,
            '& > *': {
              margin: '4px !important',
            }
          }}
        >
          {filterButtons.map((button) => (
            <Button
              key={button.key}
              variant={currentFilter === button.key ? 'contained' : 'outlined'}
              size="small"
              onClick={() => handleFilterClick(button.key)}
              startIcon={button.icon}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: currentFilter === button.key ? 600 : 500,
                px: 2,
                py: 1,
                minWidth: 'auto',
                // Fixed: Use 'background' instead of 'backgroundColor' for gradients
                background: currentFilter === button.key
                  ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                  : 'rgba(255, 255, 255, 0.8)',
                border: currentFilter === button.key
                  ? 'none'
                  : '2px solid #e2e8f0',
                color: currentFilter === button.key
                  ? 'white'
                  : 'text.primary',
                boxShadow: currentFilter === button.key
                  ? '0 4px 12px rgba(99, 102, 241, 0.3)'
                  : '0 2px 8px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: currentFilter === button.key
                    ? '0 6px 16px rgba(99, 102, 241, 0.4)'
                    : '0 4px 12px rgba(0, 0, 0, 0.15)',
                  // Fixed: Use 'background' instead of 'backgroundColor' for gradients
                  background: currentFilter === button.key
                    ? 'linear-gradient(135deg, #5a5fcf 0%, #7c3aed 100%)'
                    : 'rgba(255, 255, 255, 0.9)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {button.label}
            </Button>
          ))}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default StickyHeader;