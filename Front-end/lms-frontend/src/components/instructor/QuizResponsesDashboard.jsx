import React, { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Quiz as QuizIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const QuizResponsesDashboard = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentResponses, setStudentResponses] = useState([]);
  const [filterCorrect, setFilterCorrect] = useState('');
  const [searchStudent, setSearchStudent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);

  useEffect(() => {
    fetchStudentResponses();
  }, [lessonId]);

  const fetchStudentResponses = async () => {
    try {
      const token = localStorage.getItem('lms_token');
      const response = await fetch(`http://localhost:3006/api/submissions/lesson/${lessonId}/quiz-responses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStudentResponses(data.data || []);
      } else {
        console.log('Quiz responses endpoint might not exist yet - using sample data');
       ]
        setStudentResponses([
          {
            id: 1,
            student_name: 'John Doe',
            quiz_id: 1,
            question: 'What is React?',
            student_answer: 'A JavaScript library for building user interfaces',
            correct_answer: 'A JavaScript library for building user interfaces',
            is_correct: true,
            points_earned: 1,
            points_possible: 1,
            submitted_at: new Date().toISOString()
          },
          {
            id: 2,
            student_name: 'Jane Smith',
            quiz_id: 1,
            question: 'What is React?',
            student_answer: 'A programming language',
            correct_answer: 'A JavaScript library for building user interfaces',
            is_correct: false,
            points_earned: 0,
            points_possible: 1,
            submitted_at: new Date().toISOString()
          },
          {
            id: 3,
            student_name: 'Mike Johnson',
            quiz_id: 1,
            question: 'What is JSX?',
            student_answer: 'JavaScript XML syntax extension',
            correct_answer: 'JavaScript XML syntax extension',
            is_correct: true,
            points_earned: 1,
            points_possible: 1,
            submitted_at: new Date().toISOString()
          },
          {
            id: 4,
            student_name: 'Sarah Wilson',
            quiz_id: 1,
            question: 'What is JSX?',
            student_answer: 'A new programming language',
            correct_answer: 'JavaScript XML syntax extension',
            is_correct: false,
            points_earned: 0,
            points_possible: 1,
            submitted_at: new Date().toISOString()
          },
          {
            id: 5,
            student_name: 'David Brown',
            quiz_id: 1,
            question: 'What are React Hooks?',
            student_answer: 'Functions that let you use state in functional components',
            correct_answer: 'Functions that let you use state in functional components',
            is_correct: true,
            points_earned: 1,
            points_possible: 1,
            submitted_at: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching student responses:', err);
      setError('Error loading student responses');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (response) => {
    setSelectedResponse(response);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedResponse(null);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const calculateAverageScore = () => {
    if (studentResponses.length === 0) return 0;
    const totalScore = studentResponses.reduce((sum, response) => sum + (response.points_earned || 0), 0);
    const totalPossible = studentResponses.reduce((sum, response) => sum + (response.points_possible || 1), 0);
    return ((totalScore / totalPossible) * 100).toFixed(1);
  };

  const getCompletionRate = () => {
    // Calculate based on unique students vs total enrolled
    const uniqueStudents = [...new Set(studentResponses.map(r => r.student_name))];
    const totalEnrolled = 50; // This should come from your API
    return ((uniqueStudents.length / totalEnrolled) * 100).toFixed(1);
  };

  const filteredResponses = studentResponses.filter(response => {
    const matchesCorrect = filterCorrect === '' || response.is_correct.toString() === filterCorrect;
    const matchesStudent = response.student_name.toLowerCase().includes(searchStudent.toLowerCase());
    return matchesCorrect && matchesStudent;
  });

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading quiz responses...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
          color: 'white',
          p: 4,
          mb: 4,
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton
            onClick={() => navigate(`/instructor/courses/${courseId}/lessons/${lessonId}`)}
            sx={{ color: 'white', mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Quiz Responses Dashboard
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Course: {courseId} | Lesson: {lessonId}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <PeopleIcon sx={{ fontSize: 48, color: '#2196f3', mb: 2 }} />
            <Typography variant="h3" color="primary" gutterBottom>
              {studentResponses.length}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Total Responses
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <TrendingUpIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
            <Typography variant="h3" color="success.main" gutterBottom>
              {calculateAverageScore()}%
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Average Score
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <QuizIcon sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
            <Typography variant="h3" color="warning.main" gutterBottom>
              {getCompletionRate()}%
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Completion Rate
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Controls */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filter Responses
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filter by Correctness</InputLabel>
              <Select
                value={filterCorrect}
                onChange={(e) => setFilterCorrect(e.target.value)}
                label="Filter by Correctness"
              >
                <MenuItem value="">All Responses</MenuItem>
                <MenuItem value="true">Correct Answers Only</MenuItem>
                <MenuItem value="false">Incorrect Answers Only</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Search by student name"
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              placeholder="Enter student name..."
            />
          </Grid>
        </Grid>
      </Paper>

     
      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">
            Student Quiz Responses ({filteredResponses.length} results)
          </Typography>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell><strong>Student</strong></TableCell>
                <TableCell><strong>Question</strong></TableCell>
                <TableCell><strong>Student Answer</strong></TableCell>
                <TableCell align="center"><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Score</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredResponses.map((response, index) => (
                <TableRow 
                  key={response.id} 
                  sx={{ 
                    bgcolor: index % 2 === 0 ? '#fafafa' : 'white',
                    '&:hover': { bgcolor: '#f0f0f0' }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: '#2196f3' }}>
                        {response.student_name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {response.student_name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(response.submitted_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}
                    >
                      {response.question}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}
                    >
                      {response.student_answer}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      icon={response.is_correct ? <CheckCircleIcon /> : <CancelIcon />}
                      label={response.is_correct ? 'Correct' : 'Incorrect'}
                      color={response.is_correct ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`${response.points_earned}/${response.points_possible || 1}`}
                      color={getScoreColor((response.points_earned / (response.points_possible || 1)) * 100)}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton
                        onClick={() => handleViewDetails(response)}
                        color="primary"
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {filteredResponses.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">
              No quiz responses found matching your criteria.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Response Details Modal */}
      <Dialog open={showModal} onClose={closeModal} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Response Details
            <IconButton onClick={closeModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedResponse && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Student Information
                  </Typography>
                  <Typography><strong>Name:</strong> {selectedResponse.student_name}</Typography>
                  <Typography><strong>Submitted:</strong> {new Date(selectedResponse.submitted_at).toLocaleString()}</Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Question
                  </Typography>
                  <Typography variant="body1">{selectedResponse.question}</Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    bgcolor: selectedResponse.is_correct ? '#e8f5e8' : '#ffebee',
                    borderColor: selectedResponse.is_correct ? '#4caf50' : '#f44336'
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Student Answer
                  </Typography>
                  <Typography variant="body1">{selectedResponse.student_answer}</Typography>
                  <Chip
                    icon={selectedResponse.is_correct ? <CheckCircleIcon /> : <CancelIcon />}
                    label={selectedResponse.is_correct ? 'Correct' : 'Incorrect'}
                    color={selectedResponse.is_correct ? 'success' : 'error'}
                    sx={{ mt: 1 }}
                  />
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 2, bgcolor: '#e3f2fd' }}>
                  <Typography variant="h6" gutterBottom>
                    Correct Answer
                  </Typography>
                  <Typography variant="body1">{selectedResponse.correct_answer}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Score:</strong> {selectedResponse.points_earned}/{selectedResponse.points_possible || 1} points
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QuizResponsesDashboard;