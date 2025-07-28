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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  VideoLibrary as VideoIcon,
  Article as ArticleIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import { apiGet, apiPost } from '../services/api';

const CreateLesson = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [module, setModule] = useState(null);
  const [modules, setModules] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    video_url: '',
    type: 'video',
    duration: 1800, // 30 minutes default
    position: 1,
    module_id: moduleId || '',
    is_published: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, [courseId, moduleId]);

  const fetchData = async () => {
    try {
      // Fetch course details
      const courseResponse = await apiGet(`/courses/${courseId}`);
      if (courseResponse.success) {
        setCourse(courseResponse.data);
      }

      // Fetch modules for this course
      const modulesResponse = await apiGet(`/modules/course/${courseId}`);
      if (modulesResponse.success) {
        setModules(modulesResponse.data.modules || []);
      }

      // If moduleId is provided, fetch specific module and set position
      if (moduleId) {
        const moduleResponse = await apiGet(`/modules/${moduleId}`);
        if (moduleResponse.success) {
          setModule(moduleResponse.data);
          setFormData(prev => ({ ...prev, module_id: moduleId }));
        }
        
       
        const lessonsResponse = await apiGet(`/lessons/module/${moduleId}`);
        if (lessonsResponse.success) {
          const lessons = lessonsResponse.data.lessons || [];
          const nextPosition = lessons.length + 1;
          setFormData(prev => ({ ...prev, position: nextPosition }));
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const handleDurationChange = (e) => {
    const minutes = parseInt(e.target.value) || 0;
    setFormData(prev => ({
      ...prev,
      duration: minutes * 60 // Convert to seconds
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Lesson title is required');
      return false;
    }
    
    if (!formData.module_id) {
      setError('Please select a module');
      return false;
    }

    if (formData.type === 'video' && !formData.video_url.trim()) {
      setError('Video URL is required for video lessons');
      return false;
    }

    if (formData.type === 'text' && !formData.content.trim()) {
      setError('Content is required for text lessons');
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
      
      const lessonData = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        video_url: formData.video_url,
        type: formData.type,
        duration: formData.duration,
        position: formData.position,
        module_id: parseInt(formData.module_id),
        is_published: formData.is_published
      };

      const response = await apiPost(`/lessons`, lessonData);
      
      if (response.success) {
        setSuccess(true);
       
        setTimeout(() => {
          navigate(`/instructor/courses/${courseId}/manage`);
        }, 1500);
      } else {
        setError(response.message || 'Failed to create lesson');
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
      setError(error.message || 'Failed to create lesson');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          Lesson created successfully! Redirecting...
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
            Create New Lesson
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {course?.title || 'Loading course...'}
            {module && ` • ${module.title}`}
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
              Lesson Details
            </Typography>

            <form onSubmit={handleSubmit}>
              {/* Basic Info */}
              <TextField
                fullWidth
                name="title"
                label="Lesson Title"
                value={formData.title}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                placeholder="e.g., Introduction to useState Hook"
              />

              <TextField
                fullWidth
                name="description"
                label="Lesson Description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                sx={{ mb: 3 }}
                placeholder="Brief description of what students will learn..."
              />

              {/* Module Selection */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Module</InputLabel>
                <Select
                  name="module_id"
                  value={formData.module_id}
                  onChange={handleChange}
                  label="Module"
                  required
                >
                  {modules.map((mod) => (
                    <MenuItem key={mod.id} value={mod.id}>
                      {mod.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Lesson Type */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Lesson Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Lesson Type"
                >
                  <MenuItem value="video">Video Lesson</MenuItem>
                  <MenuItem value="text">Text/Reading</MenuItem>
                  <MenuItem value="mixed">Video + Text</MenuItem>
                </Select>
              </FormControl>

              {/* Duration and Position */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Duration (minutes)"
                    type="number"
                    value={Math.round(formData.duration / 60)}
                    onChange={handleDurationChange}
                    inputProps={{ min: 1, max: 300 }}
                    helperText="Estimated time for students to complete this lesson"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="position"
                    label="Lesson Position"
                    type="number"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    inputProps={{ min: 1 }}
                    helperText={`This will be lesson #${formData.position} in the module`}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Content based on type */}
              {(formData.type === 'video' || formData.type === 'mixed') && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <VideoIcon sx={{ mr: 1 }} />
                    Video Content
                  </Typography>
                  <TextField
                    fullWidth
                    name="video_url"
                    label="Video URL"
                    value={formData.video_url}
                    onChange={handleChange}
                    placeholder="https://youtube.com/watch?v=... or direct video URL"
                    helperText="YouTube, Vimeo, or direct video file URLs are supported"
                    sx={{ mb: 2 }}
                  />
                </Box>
              )}

              {(formData.type === 'text' || formData.type === 'mixed') && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <ArticleIcon sx={{ mr: 1 }} />
                    Text Content
                  </Typography>
                  <TextField
                    fullWidth
                    name="content"
                    label="Lesson Content"
                    value={formData.content}
                    onChange={handleChange}
                    multiline
                    rows={8}
                    placeholder="Write your lesson content here. You can include explanations, examples, and instructions..."
                    helperText="This will be displayed as the main text content of the lesson"
                  />
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

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
                label="Publish lesson immediately"
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
                  {loading ? 'Creating...' : 'Create Lesson'}
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
                Lesson Guidelines
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Use clear, descriptive titles
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Video lessons should be 10-30 minutes long
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Include both video and text for better learning
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Test your video URLs before publishing
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
                  Total Modules: {modules.length}
                </Typography>
                {module && (
                  <Typography variant="body2" color="text.secondary">
                    Selected Module: {module.title}
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateLesson;