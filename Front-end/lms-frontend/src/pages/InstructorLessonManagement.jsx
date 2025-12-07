import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Fab,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  PlayArrow as PlayIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  VideoLibrary as VideoIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const InstructorLessonManagement = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate API calls
        const lessonData = {
          id: lessonId,
          title: 'Introduction to React Hooks',
          description: 'Learn the fundamentals of React Hooks including useState, useEffect, and custom hooks.',
          content: 'This comprehensive lesson covers the basics of React Hooks and how they revolutionize functional components...',
          videoUrl: 'https://example.com/video/react-hooks.mp4',
          duration: 45,
          order: 1,
          isPublished: true,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-20'
        };

        const courseData = {
          id: courseId,
          title: 'Complete React Development Course',
          code: 'REACT-101',
          instructor: 'Dr. Sarah Johnson'
        };

        const quizzesData = [
          {
            id: 1,
            title: 'React Hooks Basics',
            questions: 10,
            timeLimit: 30,
            attempts: 45,
            avgScore: 87,
            isPublished: true,
            createdAt: '2024-01-16'
          },
          {
            id: 2,
            title: 'Advanced Hooks Concepts',
            questions: 15,
            timeLimit: 45,
            attempts: 32,
            avgScore: 78,
            isPublished: false,
            createdAt: '2024-01-18'
          }
        ];

        const assignmentsData = [
          {
            id: 1,
            title: 'Build a Todo App with Hooks',
            dueDate: '2024-02-01',
            submissions: 38,
            totalStudents: 45,
            avgGrade: 85
          },
          {
            id: 2,
            title: 'Custom Hook Implementation',
            dueDate: '2024-02-10',
            submissions: 25,
            totalStudents: 45,
            avgGrade: 92
          }
        ];

        const studentsData = [
          {
            id: 1,
            name: 'John Smith',
            email: 'john@example.com',
            progress: 85,
            lastAccess: '2024-01-22',
            quizScore: 90,
            completedAssignments: 2
          },
          {
            id: 2,
            name: 'Emma Wilson',
            email: 'emma@example.com',
            progress: 92,
            lastAccess: '2024-01-23',
            quizScore: 95,
            completedAssignments: 2
          },
          {
            id: 3,
            name: 'Michael Chen',
            email: 'michael@example.com',
            progress: 78,
            lastAccess: '2024-01-21',
            quizScore: 82,
            completedAssignments: 1
          }
        ];

        const analyticsData = {
          totalStudents: 45,
          completionRate: 78,
          avgTimeSpent: 42,
          quizPerformance: 87,
          videoWatchTime: 38
        };

        setLesson(lessonData);
        setCourse(courseData);
        setQuizzes(quizzesData);
        setAssignments(assignmentsData);
        setStudents(studentsData);
        setAnalytics(analyticsData);
        setEditFormData(lessonData);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, lessonId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditLesson = () => {
    setEditDialogOpen(true);
  };

  const handleSaveLesson = async () => {
    try {
     
      setLesson(editFormData);
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating lesson:', error);
    }
  };

  const handleDeleteLesson = async () => {
    try {
      
      setDeleteDialogOpen(false);
      navigate(`/instructor/courses/${courseId}`);
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'success';
    if (progress >= 70) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Paper
        elevation={3}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 4,
          mb: 4,
          borderRadius: 2
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              {lesson?.title}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {course?.title} ({course?.code})
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<TimeIcon />}
                label={`${lesson?.duration} minutes`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                icon={lesson?.isPublished ? <CheckCircleIcon /> : <CancelIcon />}
                label={lesson?.isPublished ? 'Published' : 'Draft'}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'right' }}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEditLesson}
                sx={{ mr: 1, mb: 1, bgcolor: 'rgba(255,255,255,0.2)' }}
              >
                Edit Lesson
              </Button>
              <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                sx={{ mb: 1, borderColor: 'white', color: 'white' }}
              >
                Delete
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Analytics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <SchoolIcon sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
            <Typography variant="h4" color="primary">
              {analytics.totalStudents}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total Students
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <TrendingUpIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
            <Typography variant="h4" color="success.main">
              {analytics.completionRate}%
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Completion Rate
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <TimeIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
            <Typography variant="h4" color="warning.main">
              {analytics.avgTimeSpent}m
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Avg Time Spent
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <QuizIcon sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
            <Typography variant="h4" color="secondary.main">
              {analytics.quizPerformance}%
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Quiz Performance
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <VideoIcon sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
            <Typography variant="h4" color="error.main">
              {analytics.videoWatchTime}m
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Video Watch Time
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<VideoIcon />} label="Lesson Content" />
          <Tab icon={<QuizIcon />} label="Quiz Management" />
          <Tab icon={<AssignmentIcon />} label="Assignments" />
          <Tab icon={<PeopleIcon />} label="Student Progress" />
        </Tabs>

        {/* Tab Panels */}
        <Box sx={{ p: 3 }}>
          {/* Lesson Content Tab */}
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Lesson Content
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Description
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {lesson?.description}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        Content
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {lesson?.content}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Video Content
                      </Typography>
                      <Box
                        sx={{
                          bgcolor: '#f5f5f5',
                          height: 200,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 1,
                          mb: 2
                        }}
                      >
                        <VideoIcon sx={{ fontSize: 60, color: '#757575' }} />
                      </Box>
                      <Button
                        variant="outlined"
                        startIcon={<PlayIcon />}
                        fullWidth
                        sx={{ mb: 1 }}
                      >
                        Preview Video
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        fullWidth
                      >
                        Edit Video
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Quiz Management Tab */}
          {tabValue === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Quiz Management
                </Typography>
                <Box>
                  <Button
                    variant="contained"
                    startIcon={<AnalyticsIcon />}
                    component={Link}
                    to={`/instructor/courses/${courseId}/lessons/${lessonId}/quiz-responses`}
                    sx={{ mr: 2, bgcolor: '#2196f3' }}
                  >
                    View Quiz Responses
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    color="primary"
                  >
                    Create Quiz
                  </Button>
                </Box>
              </Box>

              {quizzes.length > 0 ? (
                <Grid container spacing={3}>
                  {quizzes.map((quiz) => (
                    <Grid item xs={12} md={6} key={quiz.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                            <Typography variant="h6" component="h3">
                              {quiz.title}
                            </Typography>
                            <Chip
                              label={quiz.isPublished ? 'Published' : 'Draft'}
                              color={quiz.isPublished ? 'success' : 'default'}
                              size="small"
                            />
                          </Box>
                          <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="textSecondary">
                                Questions: {quiz.questions}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="textSecondary">
                                Time: {quiz.timeLimit}m
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="textSecondary">
                                Attempts: {quiz.attempts}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="textSecondary">
                                Avg Score: {quiz.avgScore}%
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                        <CardActions>
                          <Button size="small" startIcon={<EditIcon />}>
                            Edit
                          </Button>
                          <Button size="small" startIcon={<ViewIcon />}>
                            Preview
                          </Button>
                          <Button size="small" startIcon={<DeleteIcon />} color="error">
                            Delete
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Card sx={{ textAlign: 'center', p: 4 }}>
                  <QuizIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    No Quizzes Created Yet
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    Create your first quiz to assess student understanding of this lesson.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    size="large"
                  >
                    Create Your First Quiz
                  </Button>
                </Card>
              )}
            </Box>
          )}

          {/* Assignments Tab */}
          {tabValue === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Assignment Management
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  color="primary"
                >
                  Create Assignment
                </Button>
              </Box>

              <Grid container spacing={3}>
                {assignments.map((assignment) => (
                  <Grid item xs={12} md={6} key={assignment.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {assignment.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            Submissions: {assignment.submissions}/{assignment.totalStudents}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(assignment.submissions / assignment.totalStudents) * 100}
                            sx={{ mt: 1, mb: 1 }}
                          />
                          <Typography variant="body2" color="textSecondary">
                            Average Grade: {assignment.avgGrade}%
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button size="small" startIcon={<EditIcon />}>
                          Edit
                        </Button>
                        <Button size="small" startIcon={<ViewIcon />}>
                          View Submissions
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Student Progress Tab */}
          {tabValue === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Student Progress
              </Typography>
              <Grid container spacing={3}>
                {students.map((student) => (
                  <Grid item xs={12} md={6} lg={4} key={student.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ mr: 2, bgcolor: '#2196f3' }}>
                            {student.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" component="div">
                              {student.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {student.email}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Progress</Typography>
                            <Typography variant="body2">{student.progress}%</Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={student.progress}
                            color={getProgressColor(student.progress)}
                          />
                        </Box>

                        <Grid container spacing={1} sx={{ mb: 2 }}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="textSecondary">
                              Quiz Score: {student.quizScore}%
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="textSecondary">
                              Assignments: {student.completedAssignments}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Typography variant="body2" color="textSecondary">
                          Last Access: {new Date(student.lastAccess).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Edit Lesson Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Lesson</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Lesson Title"
            value={editFormData.title || ''}
            onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={editFormData.description || ''}
            onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Video URL"
            value={editFormData.videoUrl || ''}
            onChange={(e) => setEditFormData({...editFormData, videoUrl: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Duration (minutes)"
            type="number"
            value={editFormData.duration || ''}
            onChange={(e) => setEditFormData({...editFormData, duration: parseInt(e.target.value)})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Content"
            multiline
            rows={6}
            value={editFormData.content || ''}
            onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button onClick={handleSaveLesson} variant="contained" startIcon={<SaveIcon />}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Lesson</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. All quizzes, assignments, and student progress for this lesson will be permanently deleted.
          </Alert>
          <Typography>
            Are you sure you want to delete "{lesson?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeleteLesson} color="error" variant="contained">
            Delete Lesson
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InstructorLessonManagement;