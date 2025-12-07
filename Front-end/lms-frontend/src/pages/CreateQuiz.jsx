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
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Stack,
  LinearProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Quiz as QuizIcon,
  ContentCopy as CopyIcon,
  Preview as PreviewIcon,
  Settings as SettingsIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { apiGet, apiPost } from '../services/api';

const CreateQuiz = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  
 
  const [quizMetadata, setQuizMetadata] = useState({
    title: '',
    description: '',
    time_limit: 30,
    is_published: false
  });
  

  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: '',
      quiz_type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      points: 10
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, [courseId, lessonId]);

  const fetchData = async () => {
    try {
  
      const lessonResponse = await apiGet(`/lessons/${lessonId}`);
      if (lessonResponse.success) {
        setLesson(lessonResponse.data);
      }

   
      const courseResponse = await apiGet(`/courses/${courseId}`);
      if (courseResponse.success) {
        setCourse(courseResponse.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load lesson data');
    }
  };

  const handleMetadataChange = (e) => {
    const { name, value, checked, type } = e.target;
    setQuizMetadata(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError(null);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    const newOptions = [...newQuestions[questionIndex].options];
    newOptions[optionIndex] = value;
    newQuestions[questionIndex] = { ...newQuestions[questionIndex], options: newOptions };
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].options.length < 6) {
      newQuestions[questionIndex] = {
        ...newQuestions[questionIndex],
        options: [...newQuestions[questionIndex].options, '']
      };
      setQuestions(newQuestions);
    }
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].options.length > 2) {
      const newOptions = newQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
      const currentCorrect = newQuestions[questionIndex].correct_answer;
      const removedOption = newQuestions[questionIndex].options[optionIndex];
      
      newQuestions[questionIndex] = {
        ...newQuestions[questionIndex],
        options: newOptions,
        correct_answer: currentCorrect === removedOption ? '' : currentCorrect
      };
      setQuestions(newQuestions);
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      question: '',
      quiz_type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      points: 10
    };
    setQuestions([...questions, newQuestion]);
    setActiveStep(questions.length); 
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
      if (activeStep >= newQuestions.length) {
        setActiveStep(newQuestions.length - 1);
      }
    }
  };

  const duplicateQuestion = (index) => {
    const questionToDuplicate = { ...questions[index] };
    questionToDuplicate.id = questions.length + 1;
    questionToDuplicate.question = `${questionToDuplicate.question} (Copy)`;
    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, questionToDuplicate);
    setQuestions(newQuestions);
    setActiveStep(index + 1);
  };

  const validateQuestions = () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      
      if (!q.question.trim()) {
        setError(`Question ${i + 1}: Question text is required`);
        setActiveStep(i);
        return false;
      }

      if (q.quiz_type === 'multiple_choice') {
        const filledOptions = q.options.filter(opt => opt.trim());
        if (filledOptions.length < 2) {
          setError(`Question ${i + 1}: At least 2 options are required for multiple choice`);
          setActiveStep(i);
          return false;
        }
        if (!q.correct_answer.trim()) {
          setError(`Question ${i + 1}: Please select the correct answer`);
          setActiveStep(i);
          return false;
        }
      }

      if (q.quiz_type === 'true_false' && !q.correct_answer) {
        setError(`Question ${i + 1}: Please select the correct answer (True or False)`);
        setActiveStep(i);
        return false;
      }

      if (q.quiz_type === 'text' && !q.correct_answer.trim()) {
        setError(`Question ${i + 1}: Sample answer is required for text questions`);
        setActiveStep(i);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!quizMetadata.title.trim()) {
      setError('Quiz title is required');
      return;
    }
    
    if (!validateQuestions()) return;

    setLoading(true);
    setError(null);

    try {
     
      const quizzesData = questions.map(q => ({
        title: `${quizMetadata.title} - Q${q.id}`,
        description: quizMetadata.description,
        quiz_type: q.quiz_type,
        time_limit: quizMetadata.time_limit,
        points: q.points,
        question: q.question, 
        answer: q.correct_answer, 
        options: q.quiz_type === 'multiple_choice' ? JSON.stringify(q.options.filter(opt => opt.trim())) : null,
        lesson_id: parseInt(lessonId),
        is_published: quizMetadata.is_published
      }));

      const response = await apiPost(`/quizzes/lesson/${lessonId}/bulk`, {
        quizzes: quizzesData
      });
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/courses/${courseId}/lessons/${lessonId}`);
        }, 1500);
      } else {
        setError(response.message || 'Failed to create quiz');
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      setError(error.message || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  const getTotalPoints = () => {
    return questions.reduce((total, q) => total + (q.points || 0), 0);
  };

  const getCompletionPercentage = () => {
    const completedQuestions = questions.filter(q => 
      q.question.trim() && q.correct_answer.trim()
    ).length;
    return (completedQuestions / questions.length) * 100;
  };

  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <QuizIcon sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Quiz Created Successfully!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your quiz with {questions.length} questions has been added to the lesson.
          </Typography>
          <LinearProgress variant="determinate" value={100} sx={{ mb: 3, height: 8, borderRadius: 4 }} />
          <Typography variant="body2" color="text.secondary">
            Redirecting to lesson...
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                onClick={() => navigate(`/courses/${courseId}/lessons/${lessonId}`)} 
                sx={{ mr: 2, backgroundColor: '#f0f0f0' }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a73e8' }}>
                  Create Quiz
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {lesson?.title} • {course?.title}
                </Typography>
              </Box>
            </Box>
            
            <Stack direction="row" spacing={2}>
              <Chip 
                icon={<QuizIcon />}
                label={`${questions.length} Question${questions.length !== 1 ? 's' : ''}`}
                color="primary"
                variant="outlined"
              />
              <Chip 
                label={`${getTotalPoints()} Points Total`}
                color="secondary"
                variant="outlined"
              />
              <Chip 
                label={`${Math.round(getCompletionPercentage())}% Complete`}
                color={getCompletionPercentage() === 100 ? 'success' : 'warning'}
              />
            </Stack>
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={getCompletionPercentage()} 
            sx={{ mt: 2, height: 6, borderRadius: 3 }}
          />
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Left Panel - Quiz Settings */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: 'fit-content' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SettingsIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Quiz Settings
                </Typography>
              </Box>

              <TextField
                fullWidth
                name="title"
                label="Quiz Title"
                value={quizMetadata.title}
                onChange={handleMetadataChange}
                required
                sx={{ mb: 3 }}
                placeholder="e.g., Week 1 Knowledge Check"
                variant="outlined"
              />

              <TextField
                fullWidth
                name="description"
                label="Quiz Description"
                value={quizMetadata.description}
                onChange={handleMetadataChange}
                multiline
                rows={3}
                sx={{ mb: 3 }}
                placeholder="Brief description of what this quiz covers..."
              />

              <TextField
                fullWidth
                name="time_limit"
                label="Time Limit (minutes)"
                type="number"
                value={quizMetadata.time_limit}
                onChange={handleMetadataChange}
                inputProps={{ min: 1, max: 120 }}
                sx={{ mb: 3 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    name="is_published"
                    checked={quizMetadata.is_published}
                    onChange={handleMetadataChange}
                    color="primary"
                  />
                }
                label="Publish immediately after creation"
                sx={{ mb: 3 }}
              />

              <Divider sx={{ my: 3 }} />

              <Box sx={{ backgroundColor: '#f8f9fa', p: 2, borderRadius: 2, mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main', fontWeight: 'bold' }}>
                  Quiz Summary
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  • {questions.length} question{questions.length !== 1 ? 's' : ''}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  • {getTotalPoints()} total points
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • {quizMetadata.time_limit} minute time limit
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                onClick={handleSubmit}
                disabled={loading || !quizMetadata.title.trim() || getCompletionPercentage() < 100}
                sx={{ 
                  py: 1.5,
                  backgroundColor: '#1a73e8',
                  '&:hover': { backgroundColor: '#1557b0' },
                  borderRadius: 2
                }}
              >
                {loading ? 'Creating Quiz...' : 'Create Quiz'}
              </Button>

              <Button
                variant="text"
                fullWidth
                onClick={() => navigate(`/courses/${courseId}/lessons/${lessonId}`)}
                disabled={loading}
                sx={{ mt: 1 }}
              >
                Cancel
              </Button>
            </Paper>
          </Grid>

          {/* Right Panel - Questions */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Questions ({questions.length})
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addQuestion}
                  sx={{ borderRadius: 2 }}
                >
                  Add Question
                </Button>
              </Box>

              <Stepper activeStep={activeStep} orientation="vertical" sx={{ mt: 2 }}>
                {questions.map((question, index) => (
                  <Step key={question.id}>
                    <StepLabel 
                      onClick={() => setActiveStep(index)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                          Question {index + 1}
                          {question.question && `: ${question.question.substring(0, 40)}${question.question.length > 40 ? '...' : ''}`}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Chip 
                            label={`${question.points} pts`} 
                            size="small" 
                            color="primary"
                            variant="outlined"
                          />
                          <Chip 
                            label={question.quiz_type.replace('_', ' ')} 
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        </Stack>
                      </Box>
                    </StepLabel>
                    <StepContent>
                      <Card sx={{ p: 3, mt: 2, backgroundColor: '#fafafa', border: '1px solid #e0e0e0' }}>
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Question Text"
                              value={question.question}
                              onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                              required
                              multiline
                              rows={3}
                              placeholder="Enter your question here..."
                              variant="outlined"
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <InputLabel>Question Type</InputLabel>
                              <Select
                                value={question.quiz_type}
                                onChange={(e) => handleQuestionChange(index, 'quiz_type', e.target.value)}
                                label="Question Type"
                              >
                                <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                                <MenuItem value="true_false">True/False</MenuItem>
                                <MenuItem value="text">Text Answer</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Points"
                              type="number"
                              value={question.points}
                              onChange={(e) => handleQuestionChange(index, 'points', parseInt(e.target.value) || 0)}
                              inputProps={{ min: 1, max: 100 }}
                            />
                          </Grid>

                          {/* Question type specific inputs */}
                          {question.quiz_type === 'multiple_choice' && (
                            <Grid item xs={12}>
                              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Answer Options
                              </Typography>
                              <Stack spacing={2}>
                                {question.options.map((option, optIndex) => (
                                  <Box key={optIndex} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                      fullWidth
                                      label={`Option ${optIndex + 1}`}
                                      value={option}
                                      onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                                      sx={{ mr: 1 }}
                                      variant="outlined"
                                    />
                                    <IconButton
                                      onClick={() => removeOption(index, optIndex)}
                                      disabled={question.options.length <= 2}
                                      color="error"
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Box>
                                ))}
                              </Stack>
                              
                              {question.options.length < 6 && (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<AddIcon />}
                                  onClick={() => addOption(index)}
                                  sx={{ mt: 2 }}
                                >
                                  Add Option
                                </Button>
                              )}

                              <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel>Correct Answer</InputLabel>
                                <Select
                                  value={question.correct_answer}
                                  onChange={(e) => handleQuestionChange(index, 'correct_answer', e.target.value)}
                                  label="Correct Answer"
                                >
                                  {question.options.filter(opt => opt.trim()).map((option, optIndex) => (
                                    <MenuItem key={optIndex} value={option}>
                                      {option}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                          )}

                          {question.quiz_type === 'true_false' && (
                            <Grid item xs={12}>
                              <FormControl fullWidth>
                                <InputLabel>Correct Answer</InputLabel>
                                <Select
                                  value={question.correct_answer}
                                  onChange={(e) => handleQuestionChange(index, 'correct_answer', e.target.value)}
                                  label="Correct Answer"
                                >
                                  <MenuItem value="true">True</MenuItem>
                                  <MenuItem value="false">False</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                          )}

                          {question.quiz_type === 'text' && (
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Sample Answer (for grading reference)"
                                value={question.correct_answer}
                                onChange={(e) => handleQuestionChange(index, 'correct_answer', e.target.value)}
                                multiline
                                rows={3}
                                placeholder="Provide a sample answer or grading criteria..."
                              />
                            </Grid>
                          )}

                          {/* Question Actions */}
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 1, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                              <Button
                                size="small"
                                startIcon={<CopyIcon />}
                                onClick={() => duplicateQuestion(index)}
                                variant="outlined"
                              >
                                Duplicate
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => removeQuestion(index)}
                                disabled={questions.length <= 1}
                                variant="outlined"
                              >
                                Delete
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </Card>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CreateQuiz;