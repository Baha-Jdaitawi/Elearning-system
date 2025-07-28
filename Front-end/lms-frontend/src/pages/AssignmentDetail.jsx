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
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ArrowBack,
  Assignment,
  CheckCircle,
  AccessTime,
  Grade,
  CloudUpload,
  Send,
  Warning,
  Info,
  FileDownload,
  Preview,
  School,
  ExpandMore,
  AttachFile,
  Link as LinkIcon,
  Code
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { apiGet, apiPost } from '../services/api';

function AssignmentDetail() {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [assignment, setAssignment] = useState(null);
  const [course, setCourse] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [submissionData, setSubmissionData] = useState({
    submission_text: '',
    submission_url: '',
    submission_file: null
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [fileError, setFileError] = useState(null);

  useEffect(() => {
    fetchAssignmentData();
  }, [assignmentId]);

  const fetchAssignmentData = async () => {
    try {
      setLoading(true);
      setError(null);

      
      const assignmentResponse = await apiGet(`/assignments/${assignmentId}`);
      if (assignmentResponse.success) {
        setAssignment(assignmentResponse.data);
        
        
        const courseResponse = await apiGet(`/courses/${courseId}`);
        if (courseResponse.success) {
          setCourse(courseResponse.data);
        }

        
        if (user?.role === 'student') {
          const submissionResponse = await apiGet(`/submissions/assignment/${assignmentId}/user/${user.id}`);
          if (submissionResponse.success && submissionResponse.data) {
            setSubmission(submissionResponse.data);
            setSubmissionData({
              submission_text: submissionResponse.data.submission_text || '',
              submission_url: submissionResponse.data.submission_url || '',
              submission_file: null 
            });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching assignment data:', error);
      setError('Failed to load assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubmissionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError(null);

    if (file) {
      
      const maxSizeMB = assignment.max_file_size || 10;
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      
      if (file.size > maxSizeBytes) {
        setFileError(`File size exceeds ${maxSizeMB}MB limit`);
        return;
      }

      
      if (assignment.allowed_file_types) {
        const allowedTypes = assignment.allowed_file_types.split(',').map(type => type.trim());
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.includes(fileExtension)) {
          setFileError(`File type not allowed. Allowed types: ${assignment.allowed_file_types}`);
          return;
        }
      }

      setSubmissionData(prev => ({
        ...prev,
        submission_file: file
      }));
    }
  };

  const isSubmissionValid = () => {
    switch (assignment.type) {
      case 'file_upload':
        return submission ? true : submissionData.submission_file;
      case 'text_submission':
        return submissionData.submission_text.trim() !== '';
      case 'url_submission':
        return submissionData.submission_url.trim() !== '';
      case 'code_submission':
        return submissionData.submission_text.trim() !== '';
      default:
        return false;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isLate = () => {
    return new Date() > new Date(assignment.due_date);
  };

  const getDaysUntilDue = () => {
    const dueDate = new Date(assignment.due_date);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append('assignment_id', assignmentId);
      
      switch (assignment.type) {
        case 'file_upload':
          if (submissionData.submission_file) {
            formData.append('file', submissionData.submission_file);
          }
          break;
        case 'text_submission':
        case 'code_submission':
          formData.append('submission_text', submissionData.submission_text);
          break;
        case 'url_submission':
          formData.append('submission_url', submissionData.submission_url);
          break;
      }

      const response = await apiPost('/submissions', formData, {
        'Content-Type': 'multipart/form-data'
      });

      if (response.success) {
        setSuccess(true);
        setConfirmDialog(false);
        
        await fetchAssignmentData();
      } else {
        setError(response.message || 'Failed to submit assignment');
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      setError('Failed to submit assignment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getSubmissionStatusChip = () => {
    if (!submission) {
      return <Chip label="Not Submitted" color="warning" />;
    }
    
    if (submission.grade !== null) {
      return <Chip label="Graded" color="success" icon={<Grade />} />;
    }
    
    return <Chip label="Submitted" color="info" icon={<CheckCircle />} />;
  };

  const getSubmissionTypeName = (type) => {
    switch (type) {
      case 'file_upload': return 'File Upload';
      case 'text_submission': return 'Text Submission';
      case 'url_submission': return 'URL Submission';
      case 'code_submission': return 'Code Submission';
      default: return type;
    }
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

  if (error || !assignment) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Assignment not found'}
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

  if (success) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 6, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white'
          }}
        >
          <School sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Assignment Submitted Successfully! 
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Your submission for "{assignment.title}" has been received.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
              }}
            >
              View Submission
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/courses/${courseId}`)}
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Back to Course
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          onClick={() => navigate(`/courses/${courseId}`)}
          startIcon={<ArrowBack />}
          sx={{ mb: 3 }}
        >
          Back to Course
        </Button>
        
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#0056d3' }}>
          {assignment.title}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {course?.title}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
       
        <Grid item xs={12} md={8}>
          
          <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#0056d3', mb: 3 }}>
              Assignment Details
            </Typography>

            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              {assignment.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#0056d3' }}>
              Instructions
            </Typography>
            <Typography variant="body1" paragraph sx={{ 
              whiteSpace: 'pre-wrap',
              lineHeight: 1.8,
              backgroundColor: 'grey.50',
              p: 3,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.200'
            }}>
              {assignment.instructions}
            </Typography>

            
            {assignment.requirements && assignment.requirements.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#0056d3' }}>
                  Requirements
                </Typography>
                <List>
                  {assignment.requirements.map((requirement, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={requirement} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

           
            {assignment.rubric_criteria && assignment.rubric_criteria.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0056d3' }}>
                      Grading Rubric ({assignment.max_points} points total)
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Criterion</strong></TableCell>
                          <TableCell><strong>Description</strong></TableCell>
                          <TableCell align="right"><strong>Points</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {assignment.rubric_criteria.map((criterion, index) => (
                          <TableRow key={index}>
                            <TableCell>{criterion.name}</TableCell>
                            <TableCell>{criterion.description}</TableCell>
                            <TableCell align="right">{criterion.points}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}
          </Paper>

         
          {user?.role === 'student' && (
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#0056d3', mb: 3 }}>
                {submission ? 'Your Submission' : 'Submit Assignment'}
              </Typography>

              {submission ? (
                
                <Box>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    You have already submitted this assignment on {new Date(submission.submitted_at).toLocaleString()}
                  </Alert>
                  
                  {submission.grade !== null && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                      <strong>Grade: {submission.grade}/{assignment.max_points}</strong>
                      {submission.feedback && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Feedback: {submission.feedback}
                        </Typography>
                      )}
                    </Alert>
                  )}

                  {assignment.type === 'text_submission' || assignment.type === 'code_submission' ? (
                    <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'grey.50' }}>
                      <Typography variant="subtitle2" gutterBottom>Submitted Text:</Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {submission.submission_text}
                      </Typography>
                    </Paper>
                  ) : assignment.type === 'url_submission' ? (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>Submitted URL:</Typography>
                      <Button
                        href={submission.submission_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<LinkIcon />}
                      >
                        {submission.submission_url}
                      </Button>
                    </Box>
                  ) : assignment.type === 'file_upload' && submission.file_path && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>Submitted File:</Typography>
                      <Button
                        href={submission.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<FileDownload />}
                      >
                        Download Submission
                      </Button>
                    </Box>
                  )}
                </Box>
              ) : (
                // Show submission form
                <Box>
                  {assignment.type === 'file_upload' && (
                    <Box sx={{ mb: 3 }}>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="file-upload"
                        accept={assignment.allowed_file_types}
                      />
                      <label htmlFor="file-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<CloudUpload />}
                          fullWidth
                          sx={{ mb: 2, py: 2 }}
                        >
                          {submissionData.submission_file ? 
                            `Selected: ${submissionData.submission_file.name}` : 
                            'Choose File to Upload'
                          }
                        </Button>
                      </label>
                      
                      {submissionData.submission_file && (
                        <Typography variant="body2" color="text.secondary">
                          File size: {formatFileSize(submissionData.submission_file.size)}
                        </Typography>
                      )}
                      
                      {fileError && (
                        <Alert severity="error" sx={{ mt: 1 }}>
                          {fileError}
                        </Alert>
                      )}
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Max file size: {assignment.max_file_size}MB | 
                        Allowed types: {assignment.allowed_file_types}
                      </Typography>
                    </Box>
                  )}

                  {(assignment.type === 'text_submission' || assignment.type === 'code_submission') && (
                    <TextField
                      fullWidth
                      label={assignment.type === 'code_submission' ? 'Code Submission' : 'Text Submission'}
                      name="submission_text"
                      value={submissionData.submission_text}
                      onChange={handleInputChange}
                      multiline
                      rows={assignment.type === 'code_submission' ? 15 : 8}
                      sx={{ mb: 3 }}
                      placeholder={assignment.type === 'code_submission' ? 
                        'Paste your code here...' : 
                        'Enter your submission text here...'
                      }
                      InputProps={{
                        startAdornment: assignment.type === 'code_submission' && (
                          <Code sx={{ mr: 1, color: 'primary.main' }} />
                        ),
                        sx: assignment.type === 'code_submission' ? {
                          fontFamily: 'monospace',
                          fontSize: '0.9rem'
                        } : {}
                      }}
                    />
                  )}

                  {assignment.type === 'url_submission' && (
                    <TextField
                      fullWidth
                      label="Submission URL"
                      name="submission_url"
                      value={submissionData.submission_url}
                      onChange={handleInputChange}
                      sx={{ mb: 3 }}
                      placeholder="https://..."
                      InputProps={{
                        startAdornment: <LinkIcon sx={{ mr: 1, color: 'primary.main' }} />
                      }}
                    />
                  )}

                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setConfirmDialog(true)}
                    disabled={!isSubmissionValid() || fileError}
                    startIcon={<Send />}
                    fullWidth
                  >
                    Submit Assignment
                  </Button>
                </Box>
              )}
            </Paper>
          )}
        </Grid>

        
        <Grid item xs={12} md={4}>
          
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Info sx={{ mr: 1 }} />
              Assignment Information
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Type
              </Typography>
              <Chip 
                label={getSubmissionTypeName(assignment.type)} 
                color="primary" 
                variant="outlined"
                size="small"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Points
              </Typography>
              <Typography variant="h6" color="primary.main">
                {assignment.max_points} points
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Due Date
              </Typography>
              <Typography variant="body1">
                {new Date(assignment.due_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Typography>
              
              {!isLate() ? (
                <Typography variant="body2" color="success.main">
                  {getDaysUntilDue() === 0 ? 'Due today' : 
                   getDaysUntilDue() === 1 ? 'Due tomorrow' :
                   `${getDaysUntilDue()} days remaining`}
                </Typography>
              ) : (
                <Typography variant="body2" color="error.main">
                  {assignment.allow_late_submissions ? 
                    `Late (${assignment.late_penalty}% penalty)` : 
                    'Late submissions not allowed'}
                </Typography>
              )}
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Format
              </Typography>
              <Typography variant="body1">
                {assignment.submission_format === 'individual' ? 'Individual' : 'Group Project'}
              </Typography>
            </Box>

            {user?.role === 'student' && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Submission Status
                </Typography>
                {getSubmissionStatusChip()}
              </Box>
            )}
          </Paper>

          
          {user?.role === 'student' && !submission && isLate() && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Warning sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Late Submission
                  </Typography>
                  <Typography variant="body2">
                    {assignment.allow_late_submissions ? 
                      `${assignment.late_penalty}% penalty will be applied` :
                      'Late submissions are not accepted'
                    }
                  </Typography>
                </Box>
              </Box>
            </Alert>
          )}
        </Grid>
      </Grid>

      
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit this assignment? You cannot change your submission after submitting.
          </Typography>
          {isLate() && assignment.allow_late_submissions && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This is a late submission. A {assignment.late_penalty}% penalty will be applied.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <Send />}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AssignmentDetail;