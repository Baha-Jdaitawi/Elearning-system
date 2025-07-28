import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { register, getGoogleAuthUrl } from '../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await register(formData);
      
      if (response.success) {
        loginUser(response.data.user, response.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = getGoogleAuthUrl();
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      display: 'flex',
      alignItems: 'center',
      py: 4
    }}>
      <Container maxWidth="sm">
        <Paper 
          elevation={0}
          sx={{ 
            p: 4,
            border: '1px solid #e5e5e5',
            borderRadius: 2
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold',
                color: '#1a1a1a',
                mb: 1
              }}
            >
              Join LearnHub
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              Start your learning journey today
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Google Signup Button */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignup}
            sx={{
              mb: 3,
              py: 1.5,
              borderColor: '#d1d5db',
              color: '#374151',
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': {
                borderColor: '#9ca3af',
                backgroundColor: '#f9fafb'
              }
            }}
          >
            Sign up with Google
          </Button>

          {/* Divider */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography sx={{ px: 2, color: '#666', fontSize: '0.875rem' }}>
              Or
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          {/* Register Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              variant="outlined"
            />

            <TextField
              fullWidth
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              variant="outlined"
            />

            <TextField
              fullWidth
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              variant="outlined"
              helperText="Must be at least 6 characters with uppercase, lowercase, and number"
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>I want to</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="I want to"
              >
                <MenuItem value="student">Learn (Student)</MenuItem>
                <MenuItem value="instructor">Teach (Instructor)</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                backgroundColor: '#0056d3',
                fontSize: '1rem',
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#004bb8'
                }
              }}
            >
              {loading ? 'Creating account...' : 'Join for Free'}
            </Button>
          </form>

          {/* Links */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                style={{ 
                  color: '#0056d3', 
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>

          {/* Terms */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="caption" sx={{ color: '#999' }}>
              By signing up, you agree to our{' '}
              <Link to="/terms" style={{ color: '#0056d3' }}>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" style={{ color: '#0056d3' }}>
                Privacy Policy
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
