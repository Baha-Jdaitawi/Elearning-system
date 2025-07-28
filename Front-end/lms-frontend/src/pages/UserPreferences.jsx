// pages/UserPreferences.jsx
import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Autocomplete,
  Switch,
  FormControlLabel,
  Divider,
  Avatar
} from '@mui/material';
import {
  Psychology,
  School,
  AccessTime,
  Star,
  TrendingUp,
  Save,
  AutoAwesome,
  Category,
  Timeline,
  BookmarkBorder
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { apiGet, apiPut } from '../services/api';

const LEARNING_GOALS = [
  'Career Advancement',
  'Skill Development',
  'Personal Interest',
  'Academic Requirements',
  'Professional Certification',
  'Job Requirements',
  'Entrepreneurship',
  'Creative Projects'
];

const INTERESTS = [
  'Programming',
  'Data Science',
  'Design',
  'Marketing',
  'Business',
  'Photography',
  'Writing',
  'Music',
  'Languages',
  'Health & Fitness',
  'Finance',
  'Engineering',
  'Art',
  'Technology',
  'Science'
];

const PREFERRED_TOPICS = [
  'Web Development',
  'Mobile Development',
  'Machine Learning',
  'Artificial Intelligence',
  'Digital Marketing',
  'Project Management',
  'Leadership',
  'Communication',
  'Analytics',
  'Cloud Computing',
  'Cybersecurity',
  'UX/UI Design',
  'Data Analysis',
  'Social Media',
  'E-commerce'
];

function UserPreferences() {
  const { user } = useAuth(); 
  const [preferences, setPreferences] = useState({
    learning_goals: [],
    preferred_difficulty: 'intermediate',
    time_availability: 5,
    interests: [],
    preferred_topics: [],
    learning_style: 'mixed'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const response = await apiGet(`/recommendations/profile/${user.id}`); // 🔧 Use current user ID
      
      if (response.success && response.data) {
        const data = response.data;
        setPreferences({
          learning_goals: data.learning_goals || [],
          preferred_difficulty: data.preferred_difficulty || 'intermediate',
          time_availability: data.time_availability || 5,
          interests: data.interests || [],
          preferred_topics: data.preferred_topics || [],
          learning_style: data.learning_style || 'mixed'
        });
      }
    } catch (err) {
      console.error('Error fetching preferences:', err);
      
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const response = await apiPut('/recommendations/preferences', preferences);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChipToggle = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <CircularProgress size={50} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Psychology color="primary" sx={{ fontSize: 40 }} />
          Learning Preferences
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Help us personalize your learning experience with AI-powered recommendations
        </Typography>
      </Box>

      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Preferences saved successfully! Your recommendations will be updated.
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Learning Goals */}
        <Grid size={12}>
          <Card elevation={1} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Star color="primary" />
                Learning Goals
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                What do you want to achieve with your learning?
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {LEARNING_GOALS.map((goal) => (
                  <Chip
                    key={goal}
                    label={goal}
                    onClick={() => handleChipToggle('learning_goals', goal)}
                    variant={preferences.learning_goals.includes(goal) ? 'filled' : 'outlined'}
                    color={preferences.learning_goals.includes(goal) ? 'primary' : 'default'}
                    sx={{ 
                      borderRadius: 2,
                      '&:hover': { transform: 'translateY(-1px)' },
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Difficulty & Time */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={1} sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp color="primary" />
                Difficulty Level
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Preferred Difficulty</InputLabel>
                <Select
                  value={preferences.preferred_difficulty}
                  label="Preferred Difficulty"
                  onChange={(e) => handleChange('preferred_difficulty', e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime color="primary" />
                Time Availability
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                How many hours per week can you dedicate to learning?
              </Typography>
              
              <Box sx={{ px: 2 }}>
                <Slider
                  value={preferences.time_availability}
                  onChange={(e, value) => handleChange('time_availability', value)}
                  min={1}
                  max={40}
                  marks={[
                    { value: 1, label: '1h' },
                    { value: 10, label: '10h' },
                    { value: 20, label: '20h' },
                    { value: 40, label: '40h+' }
                  ]}
                  valueLabelDisplay="on"
                  valueLabelFormat={(value) => `${value}h/week`}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Learning Style */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={1} sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <School color="primary" />
                Learning Style
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                How do you prefer to learn?
              </Typography>
              
              <FormControl fullWidth>
                <InputLabel>Learning Style</InputLabel>
                <Select
                  value={preferences.learning_style}
                  label="Learning Style"
                  onChange={(e) => handleChange('learning_style', e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="visual">Visual (Videos, Diagrams)</MenuItem>
                  <MenuItem value="text">Reading (Articles, Documents)</MenuItem>
                  <MenuItem value="hands-on">Hands-on (Projects, Practice)</MenuItem>
                  <MenuItem value="mixed">Mixed (All formats)</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  💡 Tip: Mixed learning style gives you access to the most diverse content recommendations
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Interests */}
        <Grid size={12}>
          <Card elevation={1} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Category color="primary" />
                General Interests
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                What topics interest you most?
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {INTERESTS.map((interest) => (
                  <Chip
                    key={interest}
                    label={interest}
                    onClick={() => handleChipToggle('interests', interest)}
                    variant={preferences.interests.includes(interest) ? 'filled' : 'outlined'}
                    color={preferences.interests.includes(interest) ? 'secondary' : 'default'}
                    sx={{ 
                      borderRadius: 2,
                      '&:hover': { transform: 'translateY(-1px)' },
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Preferred Topics */}
        <Grid size={12}>
          <Card elevation={1} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <BookmarkBorder color="primary" />
                Preferred Course Topics
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Specific areas you'd like to focus on
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {PREFERRED_TOPICS.map((topic) => (
                  <Chip
                    key={topic}
                    label={topic}
                    onClick={() => handleChipToggle('preferred_topics', topic)}
                    variant={preferences.preferred_topics.includes(topic) ? 'filled' : 'outlined'}
                    color={preferences.preferred_topics.includes(topic) ? 'success' : 'default'}
                    sx={{ 
                      borderRadius: 2,
                      '&:hover': { transform: 'translateY(-1px)' },
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Save Button */}
        <Grid size={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSave}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                minWidth: 200
              }}
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </Box>
        </Grid>

        {/* AI Info */}
        <Grid size={12}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <AutoAwesome sx={{ fontSize: 30 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                AI-Powered Recommendations
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Your preferences help our AI understand your learning style and recommend courses that match your goals, 
              interests, and availability. The more specific you are, the better your recommendations will be!
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default UserPreferences;