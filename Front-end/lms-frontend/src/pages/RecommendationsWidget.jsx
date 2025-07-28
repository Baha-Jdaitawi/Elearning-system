// pages/RecommendationsWidget.jsx
import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Avatar,
  Paper,
  LinearProgress,
  Rating
} from '@mui/material';
import {
  AutoAwesome,
  Refresh,
  TrendingUp,
  Group,
  Category,
  AccessTime,
  Star,
  PlayArrow,
  School,
  Person,
  ArrowForward,
  BookmarkBorder
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../services/api';

function RecommendationsWidget({ 
  maxRecommendations = 6, 
  showTitle = true,
  variant = 'default' // 'default', 'compact', 'sidebar'
}) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
  }, [maxRecommendations]);

  const fetchRecommendations = async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);
      
      setError(null);
      
      const response = await apiGet('/recommendations', {
        limit: maxRecommendations,
        refresh: refresh
      });
      
      if (response.success) {
        setRecommendations(response.data.recommendations);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchRecommendations(true);
  };

  const handleCourseClick = async (course) => {
    // Track interaction
    try {
      await apiPost('/recommendations/track', {
        courseId: course.id,
        interactionType: 'view',
        metadata: {
          source: 'recommendations_widget',
          recommendation_reason: course.recommendation_reason
        }
      });
    } catch (error) {
      console.error('Failed to track interaction:', error);
    }

    // Navigate to course
    navigate(`/courses/${course.id}`);
  };

  const handleEnroll = async (course, event) => {
    event.stopPropagation();
    
    try {
      // Track enrollment intention
      await apiPost('/recommendations/track', {
        courseId: course.id,
        interactionType: 'enroll',
        metadata: {
          source: 'recommendations_widget'
        }
      });

      // Navigate to course enrollment
      navigate(`/courses/${course.id}/enroll`);
    } catch (error) {
      console.error('Failed to track enrollment:', error);
      navigate(`/courses/${course.id}`);
    }
  };

  const getRecommendationIcon = (reason) => {
    switch (reason) {
      case 'similar_users':
        return <Group sx={{ fontSize: 16 }} />;
      case 'category_match':
        return <Category sx={{ fontSize: 16 }} />;
      case 'trending':
        return <TrendingUp sx={{ fontSize: 16 }} />;
      default:
        return <AutoAwesome sx={{ fontSize: 16 }} />;
    }
  };

  const getRecommendationText = (reason) => {
    switch (reason) {
      case 'similar_users':
        return 'Popular with similar learners';
      case 'category_match':
        return 'Based on your interests';
      case 'trending':
        return 'Trending this week';
      case 'ai_generated':
        return 'AI recommended';
      default:
        return 'Recommended for you';
    }
  };

  // Compact variant for sidebar
  if (variant === 'compact') {
    return (
      <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {showTitle && (
          <Box sx={{ 
            p: 2, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoAwesome />
              Recommended for you
            </Typography>
          </Box>
        )}
        
        <Box sx={{ p: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={30} />
            </Box>
          ) : recommendations.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              Complete more courses to get recommendations
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recommendations.slice(0, 3).map((course) => (
                <Box
                  key={course.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': { 
                      borderColor: 'primary.main',
                      transform: 'translateY(-1px)',
                      boxShadow: 2
                    }
                  }}
                  onClick={() => handleCourseClick(course)}
                >
                  <Avatar 
                    sx={{ 
                      width: 50, 
                      height: 50,
                      bgcolor: 'primary.main',
                      fontSize: '1.2rem'
                    }}
                  >
                    {course.title.charAt(0)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 600,
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {course.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Person sx={{ fontSize: 12, mr: 0.5 }} />
                      {course.instructor_name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Chip
                        size="small"
                        icon={getRecommendationIcon(course.recommendation_reason)}
                        label={getRecommendationText(course.recommendation_reason)}
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
              
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/recommendations')}
                endIcon={<ArrowForward />}
                sx={{ mt: 1 }}
              >
                View All
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    );
  }

  // Loading state
  if (loading && !refreshing) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
          <CircularProgress size={50} />
        </Box>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={() => fetchRecommendations()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  // Main variant (full page)
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {showTitle && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Recommended for you
            </Typography>
            <IconButton 
              onClick={handleRefresh} 
              disabled={refreshing}
              sx={{ 
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              {refreshing ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
            </IconButton>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Courses picked just for you based on your learning history and preferences
          </Typography>
        </Box>
      )}

      {recommendations.length === 0 ? (
        <Paper elevation={1} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <AutoAwesome sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
            No recommendations yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Complete a few courses and we'll suggest personalized recommendations!
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/courses')}
            sx={{ mt: 2 }}
          >
            Browse All Courses
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {recommendations.map((course) => (
            <Grid item xs={12} sm={6} lg={4} key={course.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handleCourseClick(course)}
              >
                {/* Course Image or Placeholder */}
                <Box sx={{ position: 'relative', height: 180, bgcolor: 'grey.100' }}>
                  {course.thumbnail ? (
                    <CardMedia
                      component="img"
                      height="180"
                      image={course.thumbnail}
                      alt={course.title}
                      sx={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white'
                      }}
                    >
                      <School sx={{ fontSize: 60 }} />
                    </Box>
                  )}
                  
                  {/* Recommendation Badge */}
                  <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                    <Chip
                      size="small"
                      icon={getRecommendationIcon(course.recommendation_reason)}
                      label={getRecommendationText(course.recommendation_reason)}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(10px)',
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>

                  {/* Bookmark Icon */}
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(255,255,255,0.9)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle bookmark functionality
                    }}
                  >
                    <BookmarkBorder sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>
                
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* Course Title */}
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      lineHeight: 1.3,
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: '2.6em'
                    }}
                  >
                    {course.title}
                  </Typography>

                  {/* Instructor */}
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}
                  >
                    <Person sx={{ fontSize: 16 }} />
                    {course.instructor_name}
                  </Typography>

                  {/* Course Stats */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Star sx={{ fontSize: 16, color: '#ffa726' }} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        4.{Math.floor(Math.random() * 4) + 5}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      ({course.enrollment_count || Math.floor(Math.random() * 1000) + 100} enrolled)
                    </Typography>
                  </Box>

                  {/* Category & Duration */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    {course.category_name && (
                      <Chip
                        size="small"
                        label={course.category_name}
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {course.duration_weeks || 1} weeks
                      </Typography>
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      size="medium"
                      startIcon={<PlayArrow />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCourseClick(course);
                      }}
                      sx={{ 
                        flexGrow: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      View Course
                    </Button>
                    <Button
                      variant="outlined"
                      size="medium"
                      onClick={(e) => handleEnroll(course, e)}
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        minWidth: 'auto',
                        px: 2
                      }}
                    >
                      {course.price > 0 ? `$${course.price}` : 'Free'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Load More */}
      {recommendations.length >= maxRecommendations && (
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/recommendations')}
            endIcon={<ArrowForward />}
            sx={{ 
              borderRadius: 3,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            View All Recommendations
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default RecommendationsWidget;