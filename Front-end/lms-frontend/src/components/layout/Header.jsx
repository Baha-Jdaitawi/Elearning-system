import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  InputBase,
  alpha,
  styled,
  Container
} from '@mui/material';
import {
  Search as SearchIcon,
  AccountCircle,
  School,
  Dashboard,
  ExitToApp
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { logout } from '../../services/authService';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '30ch',
      '&:focus': {
        width: '40ch',
      },
    },
  },
}));

const Header = () => {
  const { user, isAuthenticated, logoutUser, isAdmin, isInstructor } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      logoutUser();
      navigate('/');
    } catch {
     
      logoutUser();
      navigate('/');
    }
    handleMenuClose();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleDashboard = () => {
    if (isAdmin()) {
      navigate('/admin/dashboard');
    } else if (isInstructor()) {
      navigate('/instructor/dashboard');
    } else {
      navigate('/dashboard');
    }
    handleMenuClose();
  };

  return (
    <AppBar position="sticky" sx={{ 
      backgroundColor: '#0056d3', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      width: '100vw',
      left: 0,
      right: 0
    }}>
      <Toolbar sx={{ 
        maxWidth: '1200px', 
        width: '100%',
        mx: 'auto',
        px: 3 
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
            <School sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              LearnHub
            </Typography>
          </Box>
        </Link>

 
        <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 3 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/courses"
            sx={{ mr: 2 }}
          >
            Courses
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/categories"
            sx={{ mr: 2 }}
          >
            Categories
          </Button>
        </Box>

        {/* Search Bar */}
        <Search sx={{ mr: 2, flexGrow: 1, maxWidth: 400 }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <form onSubmit={handleSearch}>
            <StyledInputBase
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </Search>

        <Box sx={{ flexGrow: 1 }} />

        {/* User Authentication */}
        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Dashboard Button */}
            <Button
              color="inherit"
              startIcon={<Dashboard />}
              onClick={handleDashboard}
              sx={{ mr: 1, display: { xs: 'none', sm: 'flex' } }}
            >
              Dashboard
            </Button>

            {/* User Avatar */}
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              {user?.avatar ? (
                <Avatar 
                  src={user.avatar} 
                  alt={user.name}
                  sx={{ width: 32, height: 32 }}
                />
              ) : (
                <AccountCircle />
              )}
            </IconButton>

            {/* User Menu */}
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleProfile}>
                <AccountCircle sx={{ mr: 2 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleDashboard}>
                <Dashboard sx={{ mr: 2 }} />
                Dashboard
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 2 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/login"
              variant="outlined"
              sx={{ 
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Login
            </Button>
            <Button 
              component={Link} 
              to="/register"
              variant="contained"
              sx={{ 
                backgroundColor: 'white',
                color: '#0056d3',
                '&:hover': {
                  backgroundColor: '#f0f0f0'
                }
              }}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;