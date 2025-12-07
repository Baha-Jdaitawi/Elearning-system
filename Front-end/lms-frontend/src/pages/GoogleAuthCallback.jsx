import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Container, CircularProgress, Typography, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginUser } = useAuth();
  const [error, setError] = useState('');
  const hasProcessed = useRef(false); 

  useEffect(() => {
  
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleCallback = async () => {
      
      const token = searchParams.get('token');
      const errorParam = searchParams.get('error');

      
      if (errorParam) {
        setError(decodeURIComponent(errorParam));
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        return;
      }

     
      if (!token) {
        setError('No authentication token received');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        return;
      }

      try {
       
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));

     
        localStorage.setItem('lms_token', token);

       
        const user = {
          id: payload.id || payload.userId,
          email: payload.email,
          name: payload.name,
          role: payload.role || 'student',
          avatar: payload.avatar || payload.picture
        };

        // Store user in localStorage
        localStorage.setItem('lms_user', JSON.stringify(user));

        // Update auth context
        loginUser(user, token);

        // Redirect to dashboard
        navigate('/dashboard');
      } catch (err) {
        console.error('Error processing Google auth:', err);
        setError('Failed to process authentication. Please try again.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]); 

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            textAlign: 'center',
            p: 4,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          {error ? (
            <>
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
              <Typography variant="body2" color="text.secondary">
                Redirecting to login page...
              </Typography>
            </>
          ) : (
            <>
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Completing Google Sign-In
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Please wait while we set up your account...
              </Typography>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default GoogleAuthCallback;