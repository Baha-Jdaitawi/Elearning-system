import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Divider,
  FormControlLabel,
  Switch,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { apiGet, apiPost } from '../services/api';

const CreateAssignment = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    due_date: '',
    max_points: 100,
    is_published: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchData();
    setDefaultDueDate();
  }, [courseId, lessonId]);

  const setDefaultDueDate = () => {
    // Set default due date to 1 week from now
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const defaultDate = nextWeek.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, due_date: defaultDate }));
  };

  const fetchData = async () => {
    try {
      // Fetch lesson details
      const lessonResponse = await apiGet(`/lessons/${lessonId}`);
      if (lessonResponse.success) {
        setLesson(lessonResponse.data);
      }

      // Fetch course details
      const courseResponse = await apiGet(`/courses/${courseId}`);
      if (courseResponse.success) {
        setCourse(courseResponse.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load lesson data');
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

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Assignment title is required');
      return false;
    }
    
    if (!formData.description.trim()) {
      setError('Assignment description is required');
      return false;
    }

    if (!formData.instructions.trim()) {
      setError('Assignment instructions are required');
      return false;
    }

    if (!formData.due_date) {
      setError('Due date is required');
      return false;
    }

    // Check if due date is in the past
    const dueDate = new Date(formData.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dueDate < today) {
      setError('Due date cannot be in the past');
      return false;
    }

    if (formData.max_points < 1 || formData.max_points > 1000) {
      setError('Max points must be between 1 and 1000');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
    
      const assignmentData = {
        title: formData.title,
        description: formData.description,
        instructions: formData.instructions,
        due_date: formData.due_date,
        max_points: parseInt(formData.max_points),
        is_published: formData.is_published
      };

      const response = await apiPost(`/assignments/lesson/${lessonId}`, assignmentData);
      
      if (response.success) {
        setSuccess(true);
        // Redirect after a short delay
        setTimeout(() => {
          navigate(`/courses/${courseId}/lessons/${lessonId}`);
        }, 1500);
      } else {
        setError(response.message || 'Failed to create assignment');
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      setError(error.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          Assignment created successfully! Redirecting...
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton 
          onClick={() => navigate(`/courses/${courseId}/lessons/${lessonId}`)} 
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Create New Assignment
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {lesson?.title || 'Loading lesson...'}
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
              Assignment Details
            </Typography>

            <form onSubmit={handleSubmit}>
            
              <TextField
                fullWidth
                name="title"
                label="Assignment Title"
                value={formData.title}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                placeholder="e.g., Build a React Todo App"
              />

              <TextField
                fullWidth
                name="description"
                label="Assignment Description"
                value={formData.description}
                onChange={handleChange}
                required
                multiline
                rows={3}
                sx={{ mb: 3 }}
                placeholder="Brief description of what students need to accomplish..."
              />

              <Divider sx={{ my: 3 }} />

              {/* Instructions */}
              <Typography variant="h6" sx={{ mb: 2 }}>
                Instructions
              </Typography>

              <TextField
                fullWidth
                name="instructions"
                label="Detailed Instructions"
                value={formData.instructions}
                onChange={handleChange}
                required
                multiline
                rows={8}
                sx={{ mb: 3 }}
                placeholder="Provide step-by-step instructions for students. Include:
• What they need to build/create
• Technical requirements
• Submission format
• Grading criteria
• Any resources they can use
• Examples or templates if applicable"
                helperText="Be specific about requirements, deliverables, and expectations"
              />

              <Divider sx={{ my: 3 }} />

              {/* Assignment Settings */}
              <Typography variant="h6" sx={{ mb: 2 }}>
                Assignment Settings
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="due_date"
                    label="Due Date"
                    type="date"
                    value={formData.due_date}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ shrink: true }}
                    helperText="Students can submit until 11:59 PM on this date"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="max_points"
                    label="Maximum Points"
                    type="number"
                    value={formData.max_points}
                    onChange={handleChange}
                    required
                    inputProps={{ min: 1, max: 1000 }}
                    helperText="Total points this assignment is worth"
                  />
                </Grid>
              </Grid>

              {/* Publishing Options */}
              <FormControlLabel
                control={
                  <Switch
                    name="is_published"
                    checked={formData.is_published}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Publish assignment immediately"
                sx={{ mb: 3 }}
              />

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading}
                  sx={{ minWidth: 120 }}
                >
                  {loading ? 'Creating...' : 'Create Assignment'}
                </Button>

                <Button
                  variant="text"
                  onClick={() => navigate(`/courses/${courseId}/lessons/${lessonId}`)}
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
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon sx={{ mr: 1 }} />
                Assignment Guidelines
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Provide clear, specific instructions
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Include examples or templates when helpful
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Set realistic deadlines
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Specify submission requirements
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Include grading criteria
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarIcon sx={{ mr: 1 }} />
                Due Date Tips
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Give students adequate time to complete
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Consider complexity when setting deadlines
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Account for weekends and holidays
              </Typography>
            </CardContent>
          </Card>

          {lesson && course && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Assignment Info
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Course: {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Lesson: {lesson.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Due: {formData.due_date ? new Date(formData.due_date).toLocaleDateString() : 'Not set'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Points: {formData.max_points}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateAssignment;