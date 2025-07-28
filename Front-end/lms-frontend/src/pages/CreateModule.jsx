import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  Grid,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { apiGet, apiPost } from '../services/api';

const CreateModule = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    position: 1,
    is_published: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const response = await apiGet(`/courses/${courseId}`);
      if (response.success) {
        setCourse(response.data);
      }
      
      // Fetch existing modules to set correct position
      const modulesResponse = await apiGet(`/modules/course/${courseId}`);
      if (modulesResponse.success) {
        const modules = modulesResponse.data.modules || [];
        // Set position to be after the last module
        const nextPosition = modules.length + 1;
        setFormData(prev => ({ ...prev, position: nextPosition }));
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      setError('Failed to load course data');
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Module title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
     
      const moduleData = {
        ...formData,
        course_id: parseInt(courseId)
      };
      const response = await apiPost(`/modules`, moduleData);
      
      if (response.success) {
        setSuccess(true);
        // Redirect after a short delay
        setTimeout(() => {
          navigate(`/instructor/courses/${courseId}/manage`);
        }, 1500);
      } else {
        setError(response.message || 'Failed to create module');
      }
    } catch (error) {
      console.error('Error creating module:', error);
      setError(error.message || 'Failed to create module');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndAddLesson = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Module title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      
      const moduleData = {
        ...formData,
        course_id: parseInt(courseId)
      };
      const response = await apiPost(`/modules`, moduleData);
      
      if (response.success) {
        // Redirect to create lesson for this module
        navigate(`/courses/${courseId}/modules/${response.data.id}/lessons/create`);
      } else {
        setError(response.message || 'Failed to create module');
      }
    } catch (error) {
      console.error('Error creating module:', error);
      setError(error.message || 'Failed to create module');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          Module created successfully! Redirecting...
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton 
          onClick={() => navigate(`/instructor/courses/${courseId}/manage`)} 
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Create New Module
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {course?.title || 'Loading course...'}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Main Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Module Details
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                name="title"
                label="Module Title"
                value={formData.title}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                placeholder="e.g., Introduction to React Hooks"
              />

              <TextField
                fullWidth
                name="description"
                label="Module Description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                sx={{ mb: 3 }}
                placeholder="Describe what students will learn in this module..."
              />

              <TextField
                fullWidth
                name="position"
                label="Module Position"
                type="number"
                value={formData.position}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                inputProps={{ min: 1 }}
                helperText={`This will be module #${formData.position} in the course`}
              />

              <FormControlLabel
                control={
                  <Switch
                    name="is_published"
                    checked={formData.is_published}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Publish module immediately"
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading}
                  sx={{ minWidth: 120 }}
                >
                  {loading ? 'Saving...' : 'Save Module'}
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleSaveAndAddLesson}
                  disabled={loading}
                >
                  Save & Add Lesson
                </Button>

                <Button
                  variant="text"
                  onClick={() => navigate(`/instructor/courses/${courseId}/manage`)}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Module Guidelines
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Choose a clear, descriptive title
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Write a brief description of what students will learn
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Modules help organize your course into logical sections
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • You can add lessons to this module after creating it
              </Typography>
            </CardContent>
          </Card>

          {course && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Course Information
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Course: {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Level: {course.level}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {course.category}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateModule;