import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Chip,
  Avatar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  PlayCircleOutline as PlayIcon,
  Assignment as AssignmentIcon,
  Quiz as QuizIcon,
  CheckCircle as CheckIcon,
  Edit as EditIcon,
  Settings as SettingsIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { apiGet, apiPost } from '../services/api';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        
        const courseResponse = await apiGet(`/courses/${id}`);
        if (courseResponse.success) {
          setCourse(courseResponse.data);
        }

        
        if (isAuthenticated && user && courseResponse.data && user.id !== courseResponse.data.instructor_id) {
          try {
            const enrollmentResponse = await apiGet(`/enrollments/course/${id}/status`);
            if (enrollmentResponse.success && enrollmentResponse.data.isEnrolled) {
              setEnrollmentData(enrollmentResponse.data.enrollment);
              
              
              const modulesResponse = await apiGet(`/modules/course/${id}?includeLessons=true`);
              if (modulesResponse.success) {
                
                const modulesWithContent = await Promise.all(
                  modulesResponse.data.modules.map(async (module) => {
                    const lessonsWithContent = await Promise.all(
                      module.lessons.map(async (lesson) => {
                        try {
                          // Get assignments for this lesson
                          const assignmentsResponse = await apiGet(`/assignments/lesson/${lesson.id}`);
                          const assignments = assignmentsResponse.success ? assignmentsResponse.data.assignments : [];

                          // Get quizzes for this lesson  
                          const quizzesResponse = await apiGet(`/quizzes/lesson/${lesson.id}?forStudent=true`);
                          const quizzes = quizzesResponse.success ? quizzesResponse.data.quizzes : [];

                          return {
                            ...lesson,
                            assignments,
                            quizzes
                          };
                        } catch {
                          return {
                            ...lesson,
                            assignments: [],
                            quizzes: []
                          };
                        }
                      })
                    );

                    return {
                      ...module,
                      lessons: lessonsWithContent
                    };
                  })
                );

                setModules(modulesWithContent);
              }
            }
          } catch {
            
          }
        }

       
        if (isAuthenticated && user && courseResponse.data && user.id === courseResponse.data.instructor_id) {
          try {
            const modulesResponse = await apiGet(`/modules/course/${id}?includeLessons=true`);
            if (modulesResponse.success) {
              setModules(modulesResponse.data.modules || []);
            }
          } catch {
          
          }
        }
      } catch {
        // Handle error
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, isAuthenticated, user]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    try {
      const response = await apiPost('/enrollments', { course_id: parseInt(id) });
      if (response.success) {
        setMessage('Successfully enrolled! Refreshing course content...');
        // Refresh the page to load course content
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      setMessage(error.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  const handleLessonClick = (lessonId) => {
    navigate(`/courses/${id}/lessons/${lessonId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography>Loading course...</Typography>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography>Course not found</Typography>
      </Container>
    );
  }

  const isEnrolled = enrollmentData !== null;
  const isInstructor = user && user.id === course.instructor_id;

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Course Header */}
      <Card sx={{ mb: 3 }}>
        <Box
          sx={{
            height: 200,
            backgroundImage: course.image_url ? `url(${course.image_url})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}
        />
        
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
            {course.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ width: 40, height: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6">{course.instructor_name}</Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Instructor
              </Typography>
            </Box>
            {isInstructor && (
              <Chip 
                label="Your Course" 
                color="primary" 
                sx={{ ml: 2 }}
              />
            )}
          </Box>

          <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
            {course.description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Chip label={course.level} sx={{ textTransform: 'capitalize' }} />
            <Chip label={course.category_name} variant="outlined" />
            <Chip label={`$${course.price}`} color="success" variant="outlined" />
            {isEnrolled && (
              <Chip 
                label="Enrolled" 
                color="success" 
                icon={<CheckIcon />}
              />
            )}
          </Box>

          {/* Progress Bar for Enrolled Students */}
          {isEnrolled && !isInstructor && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Your Progress
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {Math.round(enrollmentData.progress)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={enrollmentData.progress} 
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#f0f0f0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#0056d3',
                    borderRadius: 4
                  }
                }}
              />
            </Box>
          )}

          {message && (
            <Alert severity="info" sx={{ mb: 3 }}>
              {message}
            </Alert>
          )}

        
          {isInstructor ? (
           
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/courses/${id}/edit`)}
                sx={{ 
                  backgroundColor: '#0056d3',
                  '&:hover': { backgroundColor: '#004bb8' }
                }}
              >
                Edit Course
              </Button>
              <Button
                variant="outlined"
                startIcon={<SettingsIcon />}
                onClick={() => navigate(`/instructor/courses/${id}/manage`)}
                sx={{ 
                  borderColor: '#0056d3',
                  color: '#0056d3'
                }}
              >
                Manage Content
              </Button>
              <Button
                variant="outlined"
                startIcon={<PeopleIcon />}
                onClick={() => navigate(`/instructor/courses/${id}/students`)}
                sx={{ 
                  borderColor: '#28a745',
                  color: '#28a745'
                }}
              >
                View Students
              </Button>
            </Box>
          ) : !isEnrolled ? (
            // Student View - Not Enrolled
            <Button
              variant="contained"
              size="large"
              onClick={handleEnroll}
              disabled={enrolling}
              sx={{ 
                px: 4,
                backgroundColor: '#0056d3',
                '&:hover': { backgroundColor: '#004bb8' }
              }}
            >
              {enrolling ? 'Enrolling...' : 'Enroll Now'}
            </Button>
          ) : (
            // Student View - Enrolled
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/dashboard')}
              sx={{ px: 4 }}
            >
              Go to Dashboard
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Course Content */}
      {((isEnrolled && !isInstructor) || isInstructor) && modules.length > 0 && (
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              {isInstructor ? 'Course Content (Instructor Preview)' : 'Course Content'}
            </Typography>

            {modules.map((module, moduleIndex) => (
              <Accordion key={module.id} defaultExpanded={moduleIndex === 0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {module.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {module.lessons?.length || 0} lessons
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {module.description && (
                    <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                      {module.description}
                    </Typography>
                  )}
                  
                  <List sx={{ pl: 0 }}>
                    {module.lessons?.map((lesson) => (
                      <div key={lesson.id}>
                        {/* Lesson Item */}
                        <ListItem 
                          button 
                          onClick={() => handleLessonClick(lesson.id)}
                          sx={{ 
                            pl: 0,
                            '&:hover': { backgroundColor: '#f8f9fa' },
                            borderRadius: 1
                          }}
                        >
                          <ListItemIcon>
                            <PlayIcon sx={{ color: '#0056d3' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={lesson.title}
                            secondary={lesson.video_duration ? `${Math.floor(lesson.video_duration / 60)} min` : 'Reading'}
                          />
                        </ListItem>

                        {/* Assignments */}
                        {lesson.assignments?.map((assignment) => (
                          <ListItem key={`assignment-${assignment.id}`} sx={{ pl: 4 }}>
                            <ListItemIcon>
                              <AssignmentIcon sx={{ color: '#ff9800' }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={assignment.title}
                              secondary={`Assignment${assignment.due_date ? ` • Due: ${new Date(assignment.due_date).toLocaleDateString()}` : ''}`}
                            />
                          </ListItem>
                        ))}

                        {/* Quizzes */}
                        {lesson.quizzes?.map((quiz) => (
                          <ListItem key={`quiz-${quiz.id}`} sx={{ pl: 4 }}>
                            <ListItemIcon>
                              <QuizIcon sx={{ color: '#4caf50' }} />
                            </ListItemIcon>
                            <ListItemText
                              primary="Quiz"
                              secondary={`${quiz.points} point${quiz.points !== 1 ? 's' : ''}`}
                            />
                          </ListItem>
                        ))}

                        <Divider sx={{ my: 1 }} />
                      </div>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      )}

      {/* What You'll Learn Section for Non-Enrolled Users */}
      {!isEnrolled && !isInstructor && course.what_you_will_learn && (
        <Card sx={{ mt: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              What You'll Learn
            </Typography>
            <List>
              {course.what_you_will_learn.map((item, index) => (
                <ListItem key={index} sx={{ pl: 0 }}>
                  <ListItemIcon>
                    <CheckIcon sx={{ color: '#28a745' }} />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

    
      {!isEnrolled && !isInstructor && course.requirements && (
        <Card sx={{ mt: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              Requirements
            </Typography>
            <List>
              {course.requirements.map((item, index) => (
                <ListItem key={index} sx={{ pl: 0 }}>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default CourseDetail;