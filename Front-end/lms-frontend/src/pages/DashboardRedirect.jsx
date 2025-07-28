import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') navigate('/admin/users');
      else if (user.role === 'instructor') navigate('/instructor/dashboard');
      else if (user.role === 'student') navigate('/courses');
      else navigate('/');
    }
  }, [user, loading, navigate]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress />
    </Box>
  );
};

export default DashboardRedirect;