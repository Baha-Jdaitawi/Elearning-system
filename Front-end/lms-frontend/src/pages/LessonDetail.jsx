import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Quiz,
  Assignment,
  CheckCircle,
  ArrowBack,
  ArrowForward,
  MenuBook,
  AccessTime,
  Download,
  VideoLibrary,
  EmojiEvents,
  Article
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { apiGet, apiPost } from '../services/api';

function LessonDetail() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [adjacentLessons, setAdjacentLessons] = useState({ previous: null, next: null });
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingComplete, setMarkingComplete] = useState(false);
  
  
  const [lessonProgress, setLessonProgress] = useState(null);
  const [courseProgress, setCourseProgress] = useState(null);
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    fetchLessonData();
    setStartTime(Date.now());
  }, [lessonId]);

  const fetchLessonData = async () => {
    try {
      setLoading(true);
      setError(null);

    
      const lessonResponse = await apiGet(`/lessons/${lessonId}`);
      if (lessonResponse.success) {
        setLesson(lessonResponse.data);
        
      
        if (lessonResponse.data.userProgress) {
          setLessonProgress(lessonResponse.data.userProgress);
        }
        
       
        const courseResponse = await apiGet(`/courses/${courseId}`);
        if (courseResponse.success) {
          setCourse(courseResponse.data);
        }
      }

     
      try {
        const quizzesResponse = await apiGet(`/quizzes/lesson/${lessonId}?forStudent=true`);
        if (quizzesResponse.success) {
          setQuizzes(quizzesResponse.data.quizzes || quizzesResponse.data || []);
        }
      } catch (quizError) {
        console.error('Error fetching quizzes:', quizError);
        setQuizzes([]);
      }

     
      try {
        const assignmentsResponse = await apiGet(`/assignments/lesson/${lessonId}`);
        if (assignmentsResponse.success) {
          setAssignments(assignmentsResponse.data || []);
        }
      } catch (assignmentError) {
        console.error('Error fetching assignments:', assignmentError);
        setAssignments([]);
      }

      // Fetch adjacent lessons for navigation
      try {
        const adjacentResponse = await apiGet(`/lessons/${lessonId}/adjacent`);
        if (adjacentResponse.success) {
          setAdjacentLessons(adjacentResponse.data);
        }
      } catch (adjacentError) {
        console.error('Error fetching adjacent lessons:', adjacentError);
      }

  
      if (user?.role === 'student') {
        try {
          const progressResponse = await apiGet(`/enrollments/course/${courseId}/progress`);
          if (progressResponse.success) {
            setProgress(progressResponse.data.progress || 0);
          }
        } catch (progressError) {
          console.error('Error fetching progress:', progressError);
        }
      }

    } catch (error) {
      console.error('Error fetching lesson data:', error);
      setError('Failed to load lesson. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  const markAsComplete = async () => {
    try {
      setMarkingComplete(true);
      
  
      const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
      
      const response = await apiPost(`/lessons/${lessonId}/complete`, {
        timeSpent: timeSpent
      });
      
      if (response.success) {
        const { 
          lessonProgress: newLessonProgress, 
          courseProgress: newCourseProgress, 
          certificateGenerated: certGenerated 
        } = response.data;
        
        // Update lesson progress
        setLessonProgress(newLessonProgress);
        
        // Update course progress
        if (newCourseProgress) {
          setCourseProgress(newCourseProgress);
          setProgress(newCourseProgress.percentage);
        }
        
        // Handle certificate generation
        if (certGenerated) {
          setShowCertificateDialog(true);
          setSuccessMessage('🎓 Congratulations! Course completed and certificate generated!');
        } else {
          setSuccessMessage(`✅ Lesson completed! Course progress: ${newCourseProgress?.percentage || 0}%`);
        }
        
        // Refresh lesson data to update completion status
        fetchLessonData();
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      setError('Failed to mark lesson as complete. Please try again.');
    } finally {
      setMarkingComplete(false);
    }
  };

  // Download certificate function
  const downloadCertificate = async () => {
    try {
      const response = await fetch(`http://localhost:3003/api/certificates/download/${user.id}/${courseId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('lms_token')}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `Certificate_${course?.title?.replace(/\s+/g, '_') || 'Course'}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to download certificate');
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
      setError('Failed to download certificate. Please try again.');
    }
  };

  const navigateToQuiz = () => {
    try {
      navigate(`/courses/${courseId}/lessons/${lessonId}/quiz`);
    } catch (navError) {
      console.error('❌ Navigation error:', navError);
      alert('Error navigating to quiz. Please try again.');
    }
  };

  const navigateToAssignment = (assignmentId) => {
    try {
      navigate(`/courses/${courseId}/assignments/${assignmentId}`);
    } catch (navError) {
      console.error(' Assignment navigation error:', navError);
      alert('Error navigating to assignment. Please try again.');
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error || !lesson) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Lesson not found'}
        </Alert>
        <Button 
          variant="outlined" 
          onClick={() => navigate(`/courses/${courseId}`)}
          startIcon={<ArrowBack />}
        >
          Back to Course
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with navigation */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          onClick={() => navigate(`/courses/${courseId}`)}
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Back to {course?.title || 'Course'}
        </Button>
        
        {user?.role === 'student' && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Course Progress
              </Typography>
              {courseProgress?.completed && (
                <Chip 
                  icon={<EmojiEvents />} 
                  label="Course Completed!" 
                  color="success" 
                  size="small"
                />
              )}
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                {Math.round(progress)}% Complete
              </Typography>
              {courseProgress && (
                <Typography variant="body2" color="text.secondary">
                  {courseProgress.completedLessons}/{courseProgress.totalLessons} lessons
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
            {/* Lesson Header */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4" component="h1">
                  {lesson.title}
                </Typography>
                {lessonProgress?.completed && (
                  <Chip 
                    icon={<CheckCircle />} 
                    label="Completed" 
                    color="success" 
                    sx={{ ml: 2 }}
                  />
                )}
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip 
                  icon={<AccessTime />} 
                  label={formatDuration(lesson.duration || lesson.video_duration || 1800)} 
                  variant="outlined" 
                />
                <Chip 
                  icon={<MenuBook />} 
                  label={lesson.type || 'Lesson'} 
                  variant="outlined" 
                />
                {lesson.is_published ? (
                  <Chip icon={<CheckCircle />} label="Published" color="success" />
                ) : (
                  <Chip label="Draft" color="warning" />
                )}
                {lessonProgress?.time_spent > 0 && (
                  <Chip 
                    icon={<AccessTime />} 
                    label={`Studied: ${formatDuration(lessonProgress.time_spent)}`} 
                    variant="outlined" 
                    color="primary"
                  />
                )}
              </Box>

              {lesson.description && (
                <Typography variant="body1" color="text.secondary" paragraph>
                  {lesson.description}
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Lesson Content */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Lesson Content
              </Typography>
              
              {/* Video Content */}
              {lesson.video_url && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <VideoLibrary sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6">Video Lesson</Typography>
                      {lesson.video_duration && (
                        <Chip 
                          label={formatDuration(lesson.video_duration)} 
                          size="small" 
                          sx={{ ml: 2 }}
                        />
                      )}
                    </Box>
                    <Box sx={{
                      width: '100%',
                      height: '400px',
                      backgroundColor: '#000',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      {lesson.video_url.includes('youtube.com') || lesson.video_url.includes('youtu.be') ? (
                        <iframe
                          width="100%"
                          height="100%"
                          src={lesson.video_url.replace('watch?v=', 'embed/')}
                          title={lesson.title}
                          frameBorder="0"
                          allowFullScreen
                          style={{ borderRadius: 4 }}
                        />
                      ) : (
                        <video
                          width="100%"
                          height="100%"
                          controls
                          style={{ borderRadius: 4 }}
                        >
                          <source src={lesson.video_url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Text Content */}
              {lesson.content && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Lesson Notes
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.8
                      }}
                    >
                      {lesson.content}
                    </Typography>
                  </CardContent>
                </Card>
              )}

              {/* Downloadable Resources */}
              {lesson.materials && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Downloadable Resources
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                      href={lesson.materials}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download Materials
                    </Button>
                  </CardContent>
                </Card>
              )}
            </Box>

            {/* Complete Lesson Button */}
            {user?.role === 'student' && (
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                {lessonProgress?.completed ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <Chip 
                      icon={<CheckCircle />} 
                      label={`Completed on ${new Date(lessonProgress.completed_at).toLocaleDateString()}`}
                      color="success" 
                      variant="outlined"
                    />
                    {courseProgress?.completed && (
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Article />}
                        onClick={() => setShowCertificateDialog(true)}
                      >
                        View Certificate
                      </Button>
                    )}
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={markAsComplete}
                    disabled={markingComplete}
                    startIcon={markingComplete ? <CircularProgress size={20} /> : <CheckCircle />}
                    sx={{ minWidth: 200 }}
                  >
                    {markingComplete ? 'Marking Complete...' : 'Mark as Complete'}
                  </Button>
                )}
              </Box>
            )}
          </Paper>

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              disabled={!adjacentLessons.previous}
              onClick={() => adjacentLessons.previous && 
                navigate(`/courses/${courseId}/lessons/${adjacentLessons.previous.id}`)}
            >
              Previous: {adjacentLessons.previous?.title || 'None'}
            </Button>
            
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              disabled={!adjacentLessons.next}
              onClick={() => adjacentLessons.next && 
                navigate(`/courses/${courseId}/lessons/${adjacentLessons.next.id}`)}
            >
              Next: {adjacentLessons.next?.title || 'None'}
            </Button>
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Quizzes Section */}
          {quizzes.length > 0 && (
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Quiz sx={{ mr: 1 }} />
                Quizzes ({quizzes.length})
              </Typography>
              <List>
                {quizzes.map((quiz) => (
                  <ListItem key={quiz.id} disablePadding>
                    <ListItemButton 
                      onClick={() => navigateToQuiz()}
                      sx={{ 
                        borderRadius: 1, 
                        mb: 1,
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          color: 'primary.contrastText'
                        }
                      }}
                    >
                      <ListItemIcon>
                        <Quiz color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={quiz.question || `Quiz ${quiz.id}`}
                        secondary={`${quiz.points || 1} point${(quiz.points || 1) !== 1 ? 's' : ''}`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}

          {/* Assignments Section */}
          {assignments.length > 0 && (
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Assignment sx={{ mr: 1 }} />
                Assignments ({assignments.length})
              </Typography>
              <List>
                {assignments.map((assignment) => (
                  <ListItem key={assignment.id} disablePadding>
                    <ListItemButton 
                      onClick={() => navigateToAssignment(assignment.id)}
                      sx={{ borderRadius: 1, mb: 1 }}
                    >
                      <ListItemIcon>
                        <Assignment color="secondary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={assignment.title}
                        secondary={assignment.due_date ? `Due: ${new Date(assignment.due_date).toLocaleDateString()}` : 'No due date'}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}

          {/* Lesson Info */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Lesson Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Duration
              </Typography>
              <Typography variant="body1">
                {formatDuration(lesson.duration || lesson.video_duration || 1800)}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Type
              </Typography>
              <Typography variant="body1">
                {lesson.type || 'Standard Lesson'}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Position
              </Typography>
              <Typography variant="body1">
                Lesson {lesson.position || 1}
              </Typography>
            </Box>
            {lessonProgress && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Typography variant="body1">
                  {lessonProgress.completed ? ' Completed' : ' In Progress'}
                </Typography>
              </Box>
            )}
            {lesson.created_at && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body1">
                  {new Date(lesson.created_at).toLocaleDateString()}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Certificate Generation Dialog */}
      <Dialog 
        open={showCertificateDialog} 
        onClose={() => setShowCertificateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          <EmojiEvents sx={{ fontSize: 60, color: 'gold', mb: 2 }} />
          <Typography variant="h4" component="div">
            🎓 Congratulations!
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            You've completed the course!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Your certificate has been generated and is ready for download.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Course: <strong>{course?.title}</strong>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<Download />}
            onClick={() => {
              downloadCertificate();
              setShowCertificateDialog(false);
            }}
            sx={{ mr: 2 }}
          >
            Download Certificate
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => setShowCertificateDialog(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccessMessage('')} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default LessonDetail;