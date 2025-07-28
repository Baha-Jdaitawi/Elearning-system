import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  CircularProgress,
  Chip,
  Fade,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Quiz as QuizIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Timer as TimerIcon,
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
  PlayArrow as StartIcon,
  Assignment as SubmitIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkedIcon,
  Lightbulb as HintIcon,
  Warning as WarningIcon,
  Refresh as RetryIcon,
  PauseCircle as PauseIcon,
  PlayCircle as PlayCircleIcon
} from '@mui/icons-material';

const QuizTaking = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [timeStarted, setTimeStarted] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Set());
  const [showHints, setShowHints] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  useEffect(() => {
    fetchQuizData();
  }, [lessonId]);

  // Timer effect
  useEffect(() => {
    if (quizStarted && timeRemaining > 0 && !results && !isPaused) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [quizStarted, timeRemaining, results, isPaused]);

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching quiz data for lesson:', lessonId);
      
      
      const response = await fetch(`http://localhost:3006/api/quizzes/lesson/${lessonId}?forStudent=true`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('lms_token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Quiz API Response Status:', response.status);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          console.error('❌ Failed to parse error response as JSON:', jsonError);
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        
        if (response.status === 401) {
          setError('Please log in to access this quiz.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }
        
        if (response.status === 403) {
          setError('You must be enrolled in this course to access quizzes. Please enroll first.');
          return;
        }
        
        if (response.status === 404) {
          setError('No quizzes found for this lesson.');
          return;
        }
        
        throw new Error(errorData.message || `Failed to load quiz: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Quiz data received:', data);
      
      if (data.success) {
        setLesson({ title: data.data.lessonTitle || 'Quiz' });
        setQuizzes(data.data.quizzes || []);
        setTimeRemaining(1800); // 30 minutes default
        
        console.log('📝 Loaded quizzes:', data.data.quizzes?.length || 0);
      } else {
        throw new Error(data.message || 'Failed to load quiz data');
      }
    } catch (error) {
      console.error('❌ Error fetching quiz data:', error);
      setError(error.message || 'Failed to load quiz. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    console.log('🚀 Starting quiz with', quizzes.length, 'questions');
    setQuizStarted(true);
    setTimeStarted(Date.now());
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    console.log('⏸️ Quiz', isPaused ? 'resumed' : 'paused');
  };

  const handleAnswerChange = (quizId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [quizId]: answer
    }));
    console.log('✏️ Answer updated for quiz', quizId, ':', answer);
  };

  const toggleBookmark = (quizId) => {
    setBookmarkedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(quizId)) {
        newSet.delete(quizId);
        console.log('🔖 Removed bookmark from quiz', quizId);
      } else {
        newSet.add(quizId);
        console.log('🔖 Added bookmark to quiz', quizId);
      }
      return newSet;
    });
  };

  const goToQuestion = (index) => {
    setCurrentQuizIndex(index);
    console.log('🔄 Navigated to question', index + 1);
  };

  const handleNext = () => {
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setShowSubmitDialog(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const unansweredQuestions = quizzes.filter(quiz => !answers[quiz.id]);
    
    if (unansweredQuestions.length > 0 && timeRemaining > 0) {
      setShowSubmitDialog(true);
      return;
    }

    setSubmitting(true);
    setError(null);
    
    console.log('📤 Submitting quiz answers:', answers);
    
    try {
      
      const response = await fetch(`http://localhost:3006/api/quizzes/lesson/${lessonId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('lms_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers })
      });

      console.log('📡 Submit Response Status:', response.status);

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error(' Failed to parse submit response as JSON:', jsonError);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        throw new Error(data.message || `Failed to submit quiz: ${response.status}`);
      }

      if (data.success) {
        console.log(' Quiz submitted successfully:', data.data);
        setResults(data.data);
        setShowSubmitDialog(false);
      } else {
        throw new Error(data.message || 'Quiz submission failed');
      }
    } catch (error) {
      console.error(' Error submitting quiz:', error);
      setError(error.message || 'Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'info';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Excellent work! You clearly understand the concepts!';
    if (score >= 80) return 'Great job! Strong understanding demonstrated!';
    if (score >= 70) return 'Good work! Review some concepts for improvement!';
    if (score >= 60) return 'Fair performance. Consider reviewing the material!';
    return 'Keep learning! Review the material and try again!';
  };

  const parseQuizOptions = (optionsString) => {
    try {
      if (Array.isArray(optionsString)) {
        return optionsString;
      }
      return JSON.parse(optionsString || '[]');
    } catch (parseError) {
      console.warn(' Failed to parse quiz options:', optionsString, parseError);
      return [];
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => Object.keys(answers).length;
  const getProgressPercentage = () => (getAnsweredCount() / quizzes.length) * 100;

  // Loading State
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2 }}>Loading quiz...</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Preparing your learning assessment
        </Typography>
      </Container>
    );
  }

  // Error State
  if (error && !results) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Quiz Access Error</Typography>
          {error}
        </Alert>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button 
            variant="outlined"
            onClick={() => window.location.reload()}
            startIcon={<RetryIcon />}
          >
            Try Again
          </Button>
          <Button 
            variant="contained" 
            onClick={() => navigate(`/courses/${courseId}/lessons/${lessonId}`)}
            startIcon={<BackIcon />}
          >
            Back to Lesson
          </Button>
        </Box>
      </Container>
    );
  }

  // No Quiz State
  if (quizzes.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <QuizIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 2 }}>
            No Quiz Available
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            There are no quizzes for this lesson yet. Check back later!
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate(`/courses/${courseId}/lessons/${lessonId}`)}
            startIcon={<BackIcon />}
          >
            Back to Lesson
          </Button>
        </Paper>
      </Container>
    );
  }

  // Results Screen
  if (results) {
    const timeSpent = Math.round((Date.now() - timeStarted) / 1000 / 60);
    
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Fade in>
          <Paper sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{ 
                width: 120, 
                height: 120, 
                borderRadius: '50%',
                backgroundColor: `${getScoreColor(results.score)}.light`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 3
              }}>
                <Typography variant="h3" color={`${getScoreColor(results.score)}.main`} sx={{ fontWeight: 'bold' }}>
                  {results.score}%
                </Typography>
              </Box>
              
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                Quiz Complete!
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                {getScoreMessage(results.score)}
              </Typography>
            </Box>

            {/* Score Breakdown */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                    {results.earnedPoints}/{results.totalPoints}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Points Earned
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h5" color="secondary" sx={{ fontWeight: 'bold' }}>
                    {results.totalQuestions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Questions
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h5" color="success.main" sx={{ fontWeight: 'bold' }}>
                    {timeSpent}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Minutes
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Results Details */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Review Your Answers
            </Typography>
            
            {results.results && results.results.map((result, index) => (
              <Card key={result.quizId} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    {result.isCorrect ? (
                      <CheckIcon sx={{ color: 'success.main', mr: 2, mt: 0.5 }} />
                    ) : (
                      <CancelIcon sx={{ color: 'error.main', mr: 2, mt: 0.5 }} />
                    )}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
                        {index + 1}. {result.question}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Your answer: <strong>{result.userAnswer}</strong>
                      </Typography>
                      {!result.isCorrect && (
                        <Typography variant="body2" color="success.main">
                          Correct answer: <strong>{result.correctAnswer}</strong>
                        </Typography>
                      )}
                    </Box>
                    <Chip 
                      label={`${result.points}/${result.maxPoints} pts`}
                      color={result.isCorrect ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/courses/${courseId}/lessons/${lessonId}`)}
                startIcon={<BackIcon />}
              >
                Back to Lesson
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate(`/courses/${courseId}`)}
              >
                Continue Course
              </Button>
              {results.score < 70 && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => window.location.reload()}
                  startIcon={<RetryIcon />}
                >
                  Retake Quiz
                </Button>
              )}
            </Box>
          </Paper>
        </Fade>
      </Container>
    );
  }

  // Quiz Start Screen
  if (!quizStarted) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <QuizIcon sx={{ fontSize: 100, color: 'primary.main', mb: 3 }} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
            Ready to Start Quiz?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            {lesson?.title}
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            <Grid item xs={4}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {quizzes.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Questions
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="secondary">
                  {timeRemaining ? Math.round(timeRemaining / 60) : 30}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Minutes
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="success.main">
                  {quizzes.reduce((sum, q) => sum + (q.points || 0), 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Points
                </Typography>
              </Card>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mb: 4, textAlign: 'left' }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Instructions:</strong>
            </Typography>
            <Typography variant="body2">
              • You have {timeRemaining ? Math.round(timeRemaining / 60) : 30} minutes to complete {quizzes.length} questions
            </Typography>
            <Typography variant="body2">
              • You can navigate between questions using the progress bar
            </Typography>
            <Typography variant="body2">
              • Make sure to answer all questions before submitting
            </Typography>
            <Typography variant="body2">
              • The quiz will auto-submit when time runs out
            </Typography>
          </Alert>

          <Button
            variant="contained"
            size="large"
            startIcon={<StartIcon />}
            onClick={startQuiz}
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
          >
            Start Quiz
          </Button>
        </Paper>
      </Container>
    );
  }

  // Quiz Taking Interface
  const currentQuiz = quizzes[currentQuizIndex];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Submit Dialog */}
      <Dialog open={showSubmitDialog} onClose={() => setShowSubmitDialog(false)}>
        <DialogTitle>Submit Quiz?</DialogTitle>
        <DialogContent>
          <Typography>
            {getAnsweredCount() === quizzes.length 
              ? 'You have answered all questions. Ready to submit?'
              : `You have ${quizzes.length - getAnsweredCount()} unanswered questions. Submit anyway?`
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header with Timer and Progress */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <QuizIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {lesson?.title} - Quiz
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Question {currentQuizIndex + 1} of {quizzes.length}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <TimerIcon sx={{ mr: 1, color: timeRemaining < 300 ? 'error.main' : 'text.secondary' }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: timeRemaining < 300 ? 'error.main' : 'text.primary',
                    fontWeight: 'bold'
                  }}
                >
                  {timeRemaining ? formatTime(timeRemaining) : '--:--'}
                </Typography>
                <IconButton size="small" onClick={togglePause} sx={{ ml: 1 }}>
                  {isPaused ? <PlayCircleIcon /> : <PauseIcon />}
                </IconButton>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={getProgressPercentage()} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'right' }}>
              <Chip 
                label={`${getAnsweredCount()}/${quizzes.length} Answered`}
                color={getAnsweredCount() === quizzes.length ? 'success' : 'default'}
                sx={{ mr: 1 }}
              />
              <Chip 
                label={`${quizzes.reduce((sum, q) => sum + (q.points || 0), 0)} Points`}
                color="primary"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        {/* Question Navigation Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Questions
            </Typography>
            <Stepper orientation="vertical" nonLinear activeStep={currentQuizIndex}>
              {quizzes.map((quiz, index) => (
                <Step key={quiz.id} completed={!!answers[quiz.id]}>
                  <StepButton 
                    onClick={() => goToQuestion(index)}
                    sx={{ textAlign: 'left' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <Typography variant="body2">
                        Q{index + 1}
                      </Typography>
                      {answers[quiz.id] && (
                        <CheckIcon sx={{ color: 'success.main', fontSize: 18 }} />
                      )}
                      {bookmarkedQuestions.has(quiz.id) && (
                        <BookmarkedIcon sx={{ color: 'warning.main', fontSize: 18 }} />
                      )}
                    </Box>
                  </StepButton>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>

        {/* Current Question */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 4, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Question {currentQuizIndex + 1}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title={bookmarkedQuestions.has(currentQuiz.id) ? "Remove bookmark" : "Bookmark question"}>
                  <IconButton onClick={() => toggleBookmark(currentQuiz.id)}>
                    {bookmarkedQuestions.has(currentQuiz.id) ? (
                      <BookmarkedIcon color="warning" />
                    ) : (
                      <BookmarkIcon />
                    )}
                  </IconButton>
                </Tooltip>
                <Chip 
                  label={`${currentQuiz.points} point${currentQuiz.points !== 1 ? 's' : ''}`}
                  color="primary"
                />
              </Box>
            </Box>

            <Typography variant="h6" sx={{ mb: 4, lineHeight: 1.6 }}>
              {currentQuiz.question}
            </Typography>

            {/* Multiple Choice */}
            {currentQuiz.quiz_type === 'multiple_choice' && (
              <RadioGroup
                value={answers[currentQuiz.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuiz.id, e.target.value)}
              >
                {parseQuizOptions(currentQuiz.options).map((option, index) => (
                  <Card key={index} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
                    <FormControlLabel
                      value={option}
                      control={<Radio sx={{ ml: 2 }} />}
                      label={
                        <Typography variant="body1" sx={{ py: 2, pr: 2 }}>
                          {option}
                        </Typography>
                      }
                      sx={{ 
                        margin: 0, 
                        width: '100%',
                        '&:hover': { backgroundColor: 'action.hover' }
                      }}
                    />
                  </Card>
                ))}
              </RadioGroup>
            )}

            {/* True/False */}
            {currentQuiz.quiz_type === 'true_false' && (
              <RadioGroup
                value={answers[currentQuiz.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuiz.id, e.target.value)}
              >
                <Card sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
                  <FormControlLabel 
                    value="true" 
                    control={<Radio sx={{ ml: 2 }} />} 
                    label={<Typography variant="body1" sx={{ py: 2, pr: 2 }}>True</Typography>}
                    sx={{ 
                      margin: 0, 
                      width: '100%',
                      '&:hover': { backgroundColor: 'action.hover' }
                    }}
                  />
                </Card>
                <Card sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
                  <FormControlLabel 
                    value="false" 
                    control={<Radio sx={{ ml: 2 }} />} 
                    label={<Typography variant="body1" sx={{ py: 2, pr: 2 }}>False</Typography>}
                    sx={{ 
                      margin: 0, 
                      width: '100%',
                      '&:hover': { backgroundColor: 'action.hover' }
                    }}
                  />
                </Card>
              </RadioGroup>
            )}

            {/* Text Answer */}
            {currentQuiz.quiz_type === 'text' && (
              <Card sx={{ p: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Type your answer here..."
                  value={answers[currentQuiz.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuiz.id, e.target.value)}
                  variant="outlined"
                />
              </Card>
            )}

            {/* Hint */}
            {currentQuiz.hint && (
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<HintIcon />}
                  onClick={() => setShowHints(!showHints)}
                  size="small"
                >
                  {showHints ? 'Hide Hint' : 'Show Hint'}
                </Button>
                {showHints && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <strong>Hint:</strong> {currentQuiz.hint}
                  </Alert>
                )}
              </Box>
            )}
          </Paper>

          {/* Navigation */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentQuizIndex === 0}
                startIcon={<BackIcon />}
              >
                Previous
              </Button>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {getAnsweredCount() === quizzes.length ? (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => setShowSubmitDialog(true)}
                    disabled={submitting}
                    size="large"
                    startIcon={submitting ? <CircularProgress size={20} /> : <SubmitIcon />}
                    sx={{ px: 4 }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Quiz'}
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Answer all questions to submit ({getAnsweredCount()}/{quizzes.length} completed)
                  </Typography>
                )}
              </Box>

              <Button
                variant="outlined"
                onClick={handleNext}
                disabled={currentQuizIndex === quizzes.length - 1}
                endIcon={<NextIcon />}
              >
                Next
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default QuizTaking;