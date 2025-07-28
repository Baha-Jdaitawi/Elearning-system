import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Container,
  Chip,
  Avatar,
  LinearProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { apiGet } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user's enrollments
        const response = await apiGet('/enrollments/my?limit=6');
        if (response.success && response.data && response.data.enrollments) {
          setEnrollments(response.data.enrollments);
        }
      } catch (error) {
        console.log('Dashboard error:', error);
        
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            color: '#1a1a1a',
            mb: 1
          }}
        >
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1" sx={{ color: '#666' }}>
          Continue your learning journey
        </Typography>
      </Box>

      {/* My Courses */}
      <Box>
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            fontWeight: 'bold',
            color: '#1a1a1a',
            mb: 3
          }}
        >
          My Courses
        </Typography>
        
        {loading ? (
          <Typography sx={{ color: '#666' }}>
            Loading your courses...
          </Typography>
        ) : enrollments.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center', backgroundColor: '#f8f9fa' }}>
            <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
              No courses enrolled yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>
              Start learning today by enrolling in a course
            </Typography>
            <Link 
              to="/courses" 
              style={{ 
                color: '#0056d3', 
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Browse Courses
            </Link>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {enrollments.map((enrollment) => (
              <Grid item xs={12} sm={6} md={4} key={enrollment.id}>
                <Card 
                  component={Link}
                  to={`/courses/${enrollment.course_id}`}
                  sx={{ 
                    textDecoration: 'none',
                    height: '100%',
                    transition: 'box-shadow 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                
                  <Box
                    sx={{
                      height: 120,
                      backgroundColor: '#f0f4ff',
                      position: 'relative'
                    }}
                  />
                  
                  <CardContent sx={{ p: 2 }}>
                    <Typography 
                      variant="h6" 
                      component="h3"
                      sx={{ 
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: '#1a1a1a',
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.3
                      }}
                    >
                      {enrollment.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ width: 20, height: 20, mr: 1 }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#666',
                          fontSize: '0.875rem'
                        }}
                      >
                        {enrollment.instructor_name}
                      </Typography>
                    </Box>

                    {/* Progress */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          Progress
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {Math.round(enrollment.progress)}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={enrollment.progress} 
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: '#f0f0f0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#0056d3',
                            borderRadius: 3
                          }
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Chip 
                        label={enrollment.level} 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#f8f9fa',
                          color: '#666',
                          fontSize: '0.75rem',
                          height: 24,
                          textTransform: 'capitalize'
                        }} 
                      />
                      {enrollment.completed && (
                        <Chip 
                          label="Completed" 
                          size="small" 
                          sx={{ 
                            backgroundColor: '#e8f5e8',
                            color: '#2e7d32',
                            fontSize: '0.75rem',
                            height: 24
                          }} 
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;