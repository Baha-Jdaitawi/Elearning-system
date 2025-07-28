import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
  Chip,
  Avatar
} from '@mui/material';
import { apiGet } from '../services/api';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesResponse = await apiGet('/courses/featured?limit=8');
        if (coursesResponse.success) {
          setFeaturedCourses(coursesResponse.data);
        }
      } catch {
        
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
     
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            color: '#1a1a1a',
            mb: 2,
            fontSize: { xs: '2rem', md: '2.75rem' }
          }}
        >
          Learn without limits
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#666',
            mb: 4,
            fontWeight: 'normal',
            maxWidth: 600
          }}
        >
          Start, switch, or advance your career with courses from industry experts.
        </Typography>
        <Button
          component={Link}
          to="/courses"
          variant="contained"
          size="large"
          sx={{
            backgroundColor: '#0056d3',
            px: 3,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          Explore courses
        </Button>
      </Box>

      {/* Featured Courses */}
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
          Popular courses
        </Typography>
        
        {loading ? (
          <Typography sx={{ color: '#666' }}>
            Loading courses...
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {featuredCourses.map((course) => (
              <Grid item xs={12} sm={6} md={3} key={course.id}>
                <Card 
                  component={Link}
                  to={`/courses/${course.id}`}
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
                  {/* Course Image Placeholder */}
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
                      {course.title}
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
                        {course.instructor_name}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Chip 
                        label={course.level} 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#f8f9fa',
                          color: '#666',
                          fontSize: '0.75rem',
                          height: 24,
                          textTransform: 'capitalize'
                        }} 
                      />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#1a1a1a',
                          fontWeight: 'bold'
                        }}
                      >
                        {course.price > 0 ? `$${course.price}` : 'Free'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Box sx={{ mt: 4 }}>
          <Button
            component={Link}
            to="/courses"
            variant="outlined"
            sx={{ 
              color: '#0056d3',
              borderColor: '#0056d3',
              fontWeight: 'bold'
            }}
          >
            View all courses
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;