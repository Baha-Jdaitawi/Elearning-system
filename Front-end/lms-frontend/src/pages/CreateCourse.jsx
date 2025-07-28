import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  IconButton,
  Card,
  InputAdornment,
  Fade
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Close as CloseIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { apiGet, apiPost } from '../services/api';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [courseGradient, setCourseGradient] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    level: 'beginner',
    category_id: '',
    duration_weeks: '',
    what_you_will_learn: [''],
    requirements: [''],
    language: 'English'
  });

  // Generate random gradient backgrounds
  const generateRandomGradient = () => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
      'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      'linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)',
      'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  useEffect(() => {
    setCourseGradient(generateRandomGradient());
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiGet('/categories');
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (index, value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (index, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const cleanedData = {
        ...formData,
        price: parseFloat(formData.price),
        duration_weeks: parseInt(formData.duration_weeks),
        what_you_will_learn: formData.what_you_will_learn.filter(item => item.trim() !== ''),
        requirements: formData.requirements.filter(item => item.trim() !== '')
      };

      // Create course
      const response = await apiPost('/courses', cleanedData);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/courses/${response.data.id}`);
        }, 2000);
      } else {
        setError(response.message || 'Failed to create course');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      setError('Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
        <Fade in>
          <Card sx={{ 
            textAlign: 'center', 
            p: 6,
            background: courseGradient,
            color: 'white',
            borderRadius: 4
          }}>
            <CheckIcon sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
              Course Created Successfully! 🎉
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Redirecting to your new course...
            </Typography>
          </Card>
        </Fade>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton 
          onClick={() => navigate(-1)} 
          sx={{ 
            mr: 2,
            backgroundColor: '#f5f5f5',
            '&:hover': { backgroundColor: '#e0e0e0' }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 'bold',
          color: '#0056d3'
        }}>
          Create New Course
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Main Form */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <form onSubmit={handleSubmit}>
          
          {/* Course Thumbnail Preview */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#0056d3' }}>
              Course Thumbnail
            </Typography>
            <Box sx={{
              width: '100%',
              maxWidth: '300px',
              height: '200px',
              background: courseGradient,
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              textAlign: 'center',
              border: '2px solid #e0e0e0',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Typography sx={{ 
                fontSize: '3rem', 
                mb: 1,
                opacity: 0.9
              }}>
                🎓
              </Typography>
              <Typography sx={{ 
                fontSize: '1rem', 
                fontWeight: 'bold', 
                px: 2,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}>
                {formData.title || 'Your Course Title'}
              </Typography>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                opacity: 0.8,
                mt: 0.5
              }}>
                {formData.level && formData.level.charAt(0).toUpperCase() + formData.level.slice(1)} Level
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={() => setCourseGradient(generateRandomGradient())}
              sx={{ mt: 1, textTransform: 'none' }}
            >
              🎨 Generate New Design
            </Button>
          </Box>

          {/* Course Title */}
          <TextField
            name="title"
            label="Course Title"
            value={formData.title}
            onChange={handleInputChange}
            fullWidth
            required
            placeholder="e.g., Complete Web Development Bootcamp"
            sx={{ mb: 3 }}
          />

          {/* Full Description */}
          <TextField
            name="description"
            label="Course Description"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            required
            multiline
            rows={4}
            placeholder="Detailed description of what students will learn..."
            sx={{ mb: 3 }}
          />

          {/* Price */}
          <TextField
            name="price"
            label="Price (USD)"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            fullWidth
            required
            InputProps={{
              startAdornment: <InputAdornment position="start"><MoneyIcon color="primary" /></InputAdornment>,
            }}
            inputProps={{ min: 0, step: 0.01 }}
            sx={{ mb: 3 }}
          />

          {/* Duration */}
          <TextField
            name="duration_weeks"
            label="Duration (weeks)"
            type="number"
            value={formData.duration_weeks}
            onChange={handleInputChange}
            fullWidth
            required
            InputProps={{
              startAdornment: <InputAdornment position="start"><ScheduleIcon color="primary" /></InputAdornment>,
            }}
            inputProps={{ min: 1 }}
            sx={{ mb: 3 }}
          />

          {/* Level */}
          <FormControl fullWidth required sx={{ mb: 3 }}>
            <InputLabel>Difficulty Level</InputLabel>
            <Select
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              label="Difficulty Level"
            >
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>

          {/* Category */}
          <FormControl fullWidth required sx={{ mb: 3 }}>
            <InputLabel>Category</InputLabel>
            <Select
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              label="Category"
            >
              <MenuItem value="">
                <em>Select a category</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Language */}
          <TextField
            name="language"
            label="Course Language"
            value={formData.language}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 4 }}
          />

          {/* What You Will Learn */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#0056d3' }}>
            What Students Will Learn
          </Typography>
          {formData.what_you_will_learn.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
              <TextField
                value={item}
                onChange={(e) => handleArrayInputChange(index, e.target.value, 'what_you_will_learn')}
                fullWidth
                placeholder={`Learning outcome ${index + 1}`}
                required={index === 0}
                size="small"
              />
              {index > 0 && (
                <IconButton
                  onClick={() => removeArrayField(index, 'what_you_will_learn')}
                  sx={{ ml: 1, color: '#f44336' }}
                  size="small"
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() => addArrayField('what_you_will_learn')}
            variant="outlined"
            size="small"
            sx={{ mb: 4, textTransform: 'none' }}
          >
            Add Learning Outcome
          </Button>

          {/* Requirements */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#0056d3' }}>
            Course Requirements
          </Typography>
          {formData.requirements.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
              <TextField
                value={item}
                onChange={(e) => handleArrayInputChange(index, e.target.value, 'requirements')}
                fullWidth
                placeholder={`Requirement ${index + 1}`}
                required={index === 0}
                size="small"
              />
              {index > 0 && (
                <IconButton
                  onClick={() => removeArrayField(index, 'requirements')}
                  sx={{ ml: 1, color: '#f44336' }}
                  size="small"
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() => addArrayField('requirements')}
            variant="outlined"
            size="small"
            sx={{ mb: 4, textTransform: 'none' }}
          >
            Add Requirement
          </Button>

          {/* Submit Button */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              size="large"
              sx={{
                backgroundColor: '#0056d3',
                '&:hover': { backgroundColor: '#004bb8' },
                textTransform: 'none',
                px: 6,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 2
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Course'}
            </Button>
          </Box>

        </form>
      </Paper>
    </Container>
  );
};

export default CreateCourse;