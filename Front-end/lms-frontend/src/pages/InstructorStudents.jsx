import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  LinearProgress,
  Box,
  Button,
  IconButton,
  Alert,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { apiGet } from '../services/api';

const InstructorStudents = () => {
  const { id } = useParams(); // course ID
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourseStudents();
  }, [id]);

  const fetchCourseStudents = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const courseResponse = await apiGet(`/courses/${id}`);
      if (courseResponse.success) {
        setCourse(courseResponse.data);
      }

      // Fetch enrolled students
      const studentsResponse = await apiGet(`/enrollments/course/${id}/students`);
      if (studentsResponse.success) {
        setStudents(studentsResponse.data.enrollments || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to load students data');
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'success';
    if (progress >= 60) return 'warning';
    return 'error';
  };

  const getProgressLabel = (progress) => {
    if (progress === 100) return 'Completed';
    if (progress >= 80) return 'Almost Done';
    if (progress >= 60) return 'In Progress';
    if (progress >= 20) return 'Started';
    return 'Not Started';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading students...</Typography>
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
            Students Enrolled
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {course?.title}
          </Typography>
        </Box>
      </Box>

      {/* Stats Summary */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
              {students.length}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Total Students
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="success.main" sx={{ fontWeight: 'bold' }}>
              {students.filter(s => s.progress === 100).length}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Completed
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="warning.main" sx={{ fontWeight: 'bold' }}>
              {students.length > 0 ? Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length) : 0}%
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Average Progress
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Students Table */}
      <Paper>
        {students.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <SchoolIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
              No students enrolled yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Students will appear here once they enroll in your course.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<PersonAddIcon />}
              onClick={() => {
                alert('Student invitation feature coming soon!');
              }}
            >
              Invite Students
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Enrolled Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.user_id || student.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={student.avatar} 
                          alt={student.name}
                          sx={{ mr: 2 }}
                        >
                          {student.name?.charAt(0) || 'S'}
                        </Avatar>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {student.name || 'Student'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{student.email || 'N/A'}</TableCell>
                    <TableCell>
                      <Box sx={{ width: 100 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={student.progress || 0} 
                          color={getProgressColor(student.progress || 0)}
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="caption">
                          {student.progress || 0}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getProgressLabel(student.progress || 0)}
                        color={getProgressColor(student.progress || 0)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {student.enrolled_at ? new Date(student.enrolled_at).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => {
                          if (student.email) {
                            window.location.href = `mailto:${student.email}`;
                          }
                        }}
                        title="Send Email"
                        disabled={!student.email}
                      >
                        <EmailIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default InstructorStudents;