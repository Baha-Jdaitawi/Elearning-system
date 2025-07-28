import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
  Chip,
  Tooltip,
  IconButton,
  Alert,
} from '@mui/material';
import {
  CheckCircle,
  HourglassTop,
  Grade,
  Visibility,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet } from '../services/api';

const SubmissionDashboard = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await apiGet(`/submissions/assignment/${assignmentId}`);
        if (response.success) {
          setSubmissions(response.data.submissions || []);
          setAssignmentTitle(response.data.assignmentTitle || 'Assignment');
        } else {
          setError(response.message || 'Failed to load submissions.');
        }
      } catch (err) {
        console.error('Failed to load submissions:', err);
        setError('Something went wrong while fetching submissions.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assignmentId]);

  const getStatusChip = (submission) => {
    if (submission.grade !== null) {
      return <Chip label="Graded" color="success" icon={<Grade />} />;
    }
    if (submission.submitted_at) {
      return <Chip label="Submitted" color="info" icon={<CheckCircle />} />;
    }
    return <Chip label="Pending" color="warning" icon={<HourglassTop />} />;
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#0056d3' }}>
        Submissions for: {assignmentTitle}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {submissions.length === 0 ? (
        <Alert severity="info">No submissions found for this assignment yet.</Alert>
      ) : (
        <Grid container spacing={3}>
          {submissions.map((submission) => (
            <Grid item xs={12} md={6} lg={4} key={submission.id}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {submission.student_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Submitted At:{' '}
                  {submission.submitted_at
                    ? new Date(submission.submitted_at).toLocaleString()
                    : 'N/A'}
                </Typography>

                <Box sx={{ my: 1 }}>{getStatusChip(submission)}</Box>

                <Tooltip title="View Submission">
                  <IconButton
                    color="primary"
                    onClick={() =>
                      navigate(`/courses/${submission.course_id}/assignments/${assignmentId}`)
                    }
                  >
                    <Visibility />
                  </IconButton>
                </Tooltip>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SubmissionDashboard;



