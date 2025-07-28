import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Fade,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Close as CloseIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  CloudUpload as UploadIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { apiGet, apiPut, apiUpload } from '../services/api';

const EditCourse = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    level: 'beginner',
    category_id: '',
    duration_weeks: '',
    what_you_will_learn: [''],
    requirements: [''],
    language: 'English',
    is_published: false
  });

  useEffect(() => {
    fetchCourseData();
    fetchCategories();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const response = await apiGet(`/courses/${id}`);
      if (response.success) {
        const course = response.data;
        setFormData({
          title: course.title || '',
          description: course.description || '',
          price: course.price?.toString() || '',
          level: course.level || 'beginner',
          category_id: course.category_id?.toString() || '',
          duration_weeks: course.duration_weeks?.toString() || '',
          what_you_will_learn: course.what_you_will_learn?.length ? course.what_you_will_learn : [''],
          requirements: course.requirements?.length ? course.requirements : [''],
          language: course.language || 'English',
          is_published: course.is_published || false
        });
        
        if (course.image_url) {
          setImagePreview(course.image_url);
        }
      } else {
        setError('Course not found');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      setError('Failed to load course data');
    } finally {
      setFetchLoading(false);
    }
  };

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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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

      // Update course
      const response = await apiPut(`/courses/${id}`, cleanedData);

      if (response.success) {
       
        if (imageFile) {
          const formData = new FormData();
          formData.append('image', imageFile);
          
          try {
            await apiUpload(`/courses/${id}/image`, formData);
          } catch (imageError) {
            console.error('Error uploading image:', imageError);
            
          }
        }

        setSuccess(true);
        setTimeout(() => {
          navigate(`/courses/${id}`);
        }, 2000);
      } else {
        setError(response.message || 'Failed to update course');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      setError('Failed to update course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
        <Fade in>
          <Card sx={{ 
            textAlign: 'center', 
            p: 6,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 4
          }}>
            <CheckIcon sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
              Course Updated Successfully! 🎉
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Redirecting to your course...
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
          Edit Course
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
          
         
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#0056d3' }}>
              Course Image
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                sx={{ textTransform: 'none' }}
              >
                Change Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {imageFile && (
                <Typography variant="body2" color="success.main">
                  ✓ {imageFile.name}
                </Typography>
              )}
            </Box>
            
            {imagePreview && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={imagePreview}
                  alt="Course preview"
                  style={{
                    width: '100%',
                    maxWidth: '300px',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0'
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Publication Status */}
          <FormControlLabel
            control={
              <Switch
                checked={formData.is_published}
                onChange={handleInputChange}
                name="is_published"
                color="primary"
              />
            }
            label={
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: formData.is_published ? '#28a745' : '#6c757d' }}>
                {formData.is_published ? '🟢 Published' : '🔴 Draft'}
              </Typography>
            }
            sx={{ mb: 3 }}
          />

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
              startIcon={<SaveIcon />}
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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Course'}
            </Button>
          </Box>

        </form>
      </Paper>
    </Container>
  );
};

export default EditCourse;