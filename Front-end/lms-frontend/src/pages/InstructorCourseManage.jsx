import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  IconButton,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  Divider,
  Grid
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  PlayCircleOutline as LessonIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  Folder as ModuleIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  BarChart as StatsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { apiGet } from '../services/api';

const InstructorCourseManage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const courseResponse = await apiGet(`/courses/${id}`);
      if (courseResponse.success) {
        setCourse(courseResponse.data);
      }

      // Fetch modules with lessons
      const modulesResponse = await apiGet(`/modules/course/${id}?includeLessons=true&includeUnpublished=true`);
      if (modulesResponse.success) {
        setModules(modulesResponse.data.modules || []);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
      setError('Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  
  const handleCreateModule = () => {
    navigate(`/courses/${id}/modules/create`);
  };

  const handleCreateLesson = () => {
    // If no modules exist, suggest creating a module first
    if (modules.length === 0) {
      if (window.confirm('You need to create a module first. Would you like to create one now?')) {
        navigate(`/courses/${id}/modules/create`);
      }
      return;
    }
    
  
    if (modules.length === 1) {
      navigate(`/courses/${id}/modules/${modules[0].id}/lessons/create`);
      return;
    }
    
    
    navigate(`/courses/${id}/modules/${modules[0].id}/lessons/create`);
  };

  const handleCreateQuiz = () => {
    
    const lessonsExist = modules.some(module => module.lessons && module.lessons.length > 0);
    
    if (!lessonsExist) {
      alert('Create some lessons first, then you can add quizzes to them.');
      return;
    }
    
   
    const firstModuleWithLessons = modules.find(module => module.lessons && module.lessons.length > 0);
    const firstLesson = firstModuleWithLessons.lessons[0];
    navigate(`/courses/${id}/lessons/${firstLesson.id}/quizzes/create`);
  };

  const handleCreateAssignment = () => {
  
    const lessonsExist = modules.some(module => module.lessons && module.lessons.length > 0);
    
    if (!lessonsExist) {
      alert('Create some lessons first, then you can add assignments to them.');
      return;
    }
    
    
    const firstModuleWithLessons = modules.find(module => module.lessons && module.lessons.length > 0);
    const firstLesson = firstModuleWithLessons.lessons[0];
    navigate(`/courses/${id}/lessons/${firstLesson.id}/assignments/create`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading course data...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Go Back</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton 
          onClick={() => navigate(-1)} 
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Manage Course Content
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {course?.title}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<ViewIcon />}
          onClick={() => navigate(`/courses/${id}`)}
          sx={{ mr: 2 }}
        >
          View Course
        </Button>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/courses/${id}/edit`)}
        >
          Edit Details
        </Button>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Content Structure" icon={<ModuleIcon />} />
          <Tab label="Course Statistics" icon={<StatsIcon />} />
          <Tab label="Settings" icon={<SettingsIcon />} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          {/* Quick Actions - FIXED */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateModule}
                  fullWidth
                  sx={{ py: 2 }}
                >
                  Add Module
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<LessonIcon />}
                  onClick={handleCreateLesson}
                  fullWidth
                  sx={{ py: 2 }}
                  disabled={modules.length === 0}
                >
                  Add Lesson
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<QuizIcon />}
                  onClick={handleCreateQuiz}
                  fullWidth
                  sx={{ py: 2 }}
                  disabled={!modules.some(m => m.lessons && m.lessons.length > 0)}
                >
                  Add Quiz
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<AssignmentIcon />}
                  onClick={handleCreateAssignment}
                  fullWidth
                  sx={{ py: 2 }}
                  disabled={!modules.some(m => m.lessons && m.lessons.length > 0)}
                >
                  Add Assignment
                </Button>
              </Grid>
            </Grid>
            
            {/* Helper text */}
            {modules.length === 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Start by creating a module to organize your course content.
              </Alert>
            )}
            
            {modules.length > 0 && !modules.some(m => m.lessons && m.lessons.length > 0) && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Add lessons to your modules to enable quizzes and assignments.
              </Alert>
            )}
          </Paper>

          {/* Course Structure */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Course Structure
            </Typography>
            
            {modules.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <ModuleIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  No modules created yet
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Start building your course by creating your first module.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateModule}
                  size="large"
                >
                  Create Your First Module
                </Button>
              </Box>
            ) : (
              <List>
                {modules.map((module, moduleIndex) => (
                  <Box key={module.id}>
                    <Card sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <ModuleIcon sx={{ mr: 2, color: 'primary.main' }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              Module {moduleIndex + 1}: {module.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {module.lesson_count || 0} lessons • {Math.floor((module.total_duration || 0) / 60)} minutes
                              {!module.is_published && (
                                <Typography component="span" color="warning.main" sx={{ ml: 1 }}>
                                  • Draft
                                </Typography>
                              )}
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => {
                              // TODO: Navigate to edit module page when created
                              alert('Edit Module functionality will be implemented soon!');
                            }}
                          >
                            Edit
                          </Button>
                        </Box>

                        {module.description && (
                          <Typography variant="body2" sx={{ mb: 2, ml: 4, color: 'text.secondary' }}>
                            {module.description}
                          </Typography>
                        )}

                        {module.lessons && module.lessons.length > 0 ? (
                          <Box sx={{ ml: 4 }}>
                            {module.lessons.map((lesson, lessonIndex) => (
                              <Box key={lesson.id} sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                                <LessonIcon sx={{ mr: 2, color: 'text.secondary' }} />
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body1">
                                    {lessonIndex + 1}. {lesson.title}
                                    {!lesson.is_published && (
                                      <Typography component="span" color="warning.main" sx={{ ml: 1, fontSize: '0.8rem' }}>
                                        (Draft)
                                      </Typography>
                                    )}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {lesson.video_duration ? `${Math.floor(lesson.video_duration / 60)} min` : 'Reading'}
                                    {lesson.quiz_count > 0 && ` • ${lesson.quiz_count} quiz${lesson.quiz_count > 1 ? 'zes' : ''}`}
                                    {lesson.assignment_count > 0 && ` • ${lesson.assignment_count} assignment${lesson.assignment_count > 1 ? 's' : ''}`}
                                  </Typography>
                                </Box>
                                <IconButton
                                  size="small"
                                  onClick={() => navigate(`/courses/${id}/lessons/${lesson.id}`)}
                                  title="View Lesson"
                                >
                                  <ViewIcon />
                                </IconButton>
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Box sx={{ ml: 4, py: 2, textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              No lessons in this module yet
                            </Typography>
                            <Button
                              size="small"
                              startIcon={<AddIcon />}
                              onClick={() => navigate(`/courses/${id}/modules/${module.id}/lessons/create`)}
                              sx={{ mt: 1 }}
                            >
                              Add First Lesson
                            </Button>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                    {moduleIndex < modules.length - 1 && <Divider sx={{ my: 2 }} />}
                  </Box>
                ))}
              </List>
            )}
          </Paper>
        </Box>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Course Statistics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {modules.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Modules
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="secondary">
                    {modules.reduce((acc, mod) => acc + (mod.lesson_count || 0), 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Lessons
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {Math.floor(modules.reduce((acc, mod) => acc + (mod.total_duration || 0), 0) / 60)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Minutes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {modules.filter(mod => mod.is_published).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Published Modules
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Course Settings
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Course settings functionality will be implemented here. This will include:
          </Alert>
          <Box sx={{ ml: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>• Course visibility settings</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>• Enrollment settings</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>• Grading policies</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>• Course completion requirements</Typography>
            <Typography variant="body2">• Certificate settings</Typography>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default InstructorCourseManage;