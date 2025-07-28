import { Container, Typography, Button, Box, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon, ArrowBack as BackIcon } from '@mui/icons-material';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Card sx={{ 
        textAlign: 'center', 
        p: 6,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 4
      }}>
        <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', mb: 2 }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          Page Not Found
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
          The page you're looking for doesn't exist.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{ 
              backgroundColor: 'white',
              color: '#667eea',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
          >
            Go Home
          </Button>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={() => navigate(-1)}
            sx={{ 
              borderColor: 'white',
              color: 'white',
              '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Go Back
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default NotFound;