import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Container,
  Button,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
  CardMedia
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  People as PeopleIcon,
  Book as BookIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';
import { apiGet, apiDelete } from '../services/api';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    publishedCourses: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchInstructorData();
  }, []);

  const fetchInstructorData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current user from auth context or localStorage
      const token = localStorage.getItem('lms_token');
      const userData = JSON.parse(localStorage.getItem('lms_user') || '{}');
      
      console.log('Current user data:', userData); // Debug log
      
      if (!token || !userData.id) {
        setError('Please log in again');
        return;
      }
      
     
      let response = null;
      
      try {
        
        console.log('Trying API endpoint:', `/courses/instructor/${userData.id}`);
        response = await apiGet(`/courses/instructor/${userData.id}`);
        console.log('First attempt response:', response);
      } catch (error1) {
        console.log('First attempt failed:', error1);
        
        try {
          
          console.log('Trying general courses endpoint with instructor filter');
          response = await apiGet('/courses', { instructor_id: userData.id });
          console.log('Second attempt response:', response);
        } catch (error2) {
          console.log('Second attempt failed:', error2);
          
          try {
            
            console.log('Trying to get all courses and filter');
            response = await apiGet('/courses');
            console.log('Third attempt response:', response);
            
            if (response && response.success) {
              
              const allCourses = response.data.courses || response.data || [];
              const instructorCourses = allCourses.filter(course => 
                course.instructor_id === userData.id || 
                course.instructor_id === parseInt(userData.id)
              );
              
              response.data = {
                courses: instructorCourses,
                stats: {
                  totalCourses: instructorCourses.length,
                  totalStudents: instructorCourses.reduce((sum, course) => sum + (course.enrollment_count || 0), 0),
                  publishedCourses: instructorCourses.filter(course => course.is_published).length
                }
              };
              console.log('Filtered instructor courses:', instructorCourses);
            }
          } catch (error3) {
            console.log('All attempts failed:', error3);
            throw error3;
          }
        }
      }
      
      if (response && response.success) {
        const courses = response.data.courses || response.data || [];
        const stats = response.data.stats || {};
        
        console.log('Final courses found:', courses); // Debug log
        console.log('Final stats found:', stats); // Debug log
        
        setCourses(courses);
        setStats({
          totalCourses: stats.totalCourses || courses.length,
          totalStudents: stats.totalStudents || 0,
          publishedCourses: stats.publishedCourses || courses.filter(c => c.is_published).length
        });
      } else {
        console.error('API response not successful:', response); // Debug log
        setError(response?.message || 'Failed to fetch instructor data');
      }
    } catch (error) {
      console.error('Error fetching instructor data:', error);
      setError('Failed to load instructor dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, course) => {
    setAnchorEl(event.currentTarget);
    setSelectedCourse(course);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCourse(null);
  };

  const handleViewCourse = () => {
    if (selectedCourse) {
      navigate(`/courses/${selectedCourse.id}`);
    }
    handleMenuClose();
  };

  const handleEditCourse = () => {
    if (selectedCourse) {
      navigate(`/courses/${selectedCourse.id}/edit`);
    }
    handleMenuClose();
  };

  const handleManageCourse = () => {
    if (selectedCourse) {
      navigate(`/instructor/courses/${selectedCourse.id}/manage`);
    }
    handleMenuClose();
  };

  const handleDeleteCourse = async () => {
    if (selectedCourse && window.confirm('Are you sure you want to delete this course?')) {
      try {
        const response = await apiDelete(`/courses/${selectedCourse.id}`);
        if (response.success) {
          setCourses(courses.filter(course => course.id !== selectedCourse.id));
          setStats(prev => ({
            ...prev,
            totalCourses: prev.totalCourses - 1,
            publishedCourses: selectedCourse.is_published ? prev.publishedCourses - 1 : prev.publishedCourses
          }));
        }
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
    handleMenuClose();
  };

  const handleViewStudents = () => {
    if (selectedCourse) {
      navigate(`/instructor/courses/${selectedCourse.id}/students`);
    }
    handleMenuClose();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Instructor Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={fetchInstructorData}
            sx={{
              textTransform: 'none',
              borderColor: '#0056d3',
              color: '#0056d3'
            }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/courses/create')}
            sx={{
              backgroundColor: '#0056d3',
              '&:hover': { backgroundColor: '#004bb8' },
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            Create Course
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', backgroundColor: '#f8f9fa' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ backgroundColor: '#0056d3', mr: 2 }}>
                  <BookIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats?.totalCourses || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Courses
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', backgroundColor: '#f8f9fa' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ backgroundColor: '#28a745', mr: 2 }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats?.totalStudents || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Students
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', backgroundColor: '#f8f9fa' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ backgroundColor: '#17a2b8', mr: 2 }}>
                  <VisibilityIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats?.publishedCourses || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Published Courses
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Courses Section */}
      <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
        Your Courses
      </Typography>

      {courses.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No courses yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Click the "Create Course" button above to start teaching!
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} md={6} lg={4} key={course.id}>
              <Card sx={{ 
                height: '100%', 
                '&:hover': { boxShadow: 6 },
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Course Image */}
                <CardMedia
                  component="img"
                  height="160"
                  image={course.image_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDMwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjMDA1NmQzIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iODAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj5Db3Vyc2UgSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='}
                  alt={course.title}
                  sx={{ objectFit: 'cover' }}
                />
                
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                      {course.title}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, course)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {course.description?.substring(0, 100)}...
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Chip
                      label={course.is_published ? 'Published' : 'Draft'}
                      color={course.is_published ? 'success' : 'warning'}
                      size="small"
                    />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0056d3' }}>
                      ${course.price}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {course.enrollment_count || 0} students
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.level}
                    </Typography>
                  </Box>

                  {/* Instructor Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<PlayIcon />}
                      onClick={() => navigate(`/courses/${course.id}`)}
                      sx={{
                        backgroundColor: '#0056d3',
                        '&:hover': { backgroundColor: '#004bb8' },
                        textTransform: 'none',
                        flex: 1
                      }}
                    >
                      View Course
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<SettingsIcon />}
                      onClick={() => handleManageCourse()}
                      sx={{
                        textTransform: 'none',
                        borderColor: '#0056d3',
                        color: '#0056d3'
                      }}
                    >
                      Manage
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewCourse}>
          <VisibilityIcon sx={{ mr: 1 }} />
          View Course
        </MenuItem>
        <MenuItem onClick={handleEditCourse}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Course
        </MenuItem>
        <MenuItem onClick={handleViewStudents}>
          <PeopleIcon sx={{ mr: 1 }} />
          View Students
        </MenuItem>
        <MenuItem onClick={handleManageCourse}>
          <SettingsIcon sx={{ mr: 1 }} />
          Manage Content
        </MenuItem>
        <MenuItem onClick={handleDeleteCourse} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Course
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default InstructorDashboard;