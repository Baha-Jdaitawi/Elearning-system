import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  Paper,
  InputLabel,
  Alert
} from '@mui/material';
import { assignmentAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const AssignmentUpload = () => {
  const [assignmentId, setAssignmentId] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [fileError, setFileError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFileError(null);

    if (!selectedFile) {
      return;
    }

    
    const maxSizeBytes = 10 * 1024 * 1024;
    if (selectedFile.size > maxSizeBytes) {
      setFileError('File size exceeds 10MB limit.');
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!assignmentId || !file) {
      toast.error('Please enter Assignment ID and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('assignment_id', assignmentId);
    formData.append('file', file);

    setSubmitting(true);
    try {
      await assignmentAPI.uploadSubmission(formData);
      toast.success('File uploaded successfully!');
      setAssignmentId('');
      setFile(null);
    } catch (error) {
      toast.error(error.message || 'Upload failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#0056d3' }}>
          Upload Assignment
        </Typography>

        <TextField
          fullWidth
          label="Assignment ID"
          variant="outlined"
          value={assignmentId}
          onChange={(e) => setAssignmentId(e.target.value)}
          sx={{ mb: 3 }}
        />

        <InputLabel sx={{ mb: 1 }}>Select File</InputLabel>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          style={{ marginBottom: '16px' }}
        />

        {fileError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {fileError}
          </Alert>
        )}

        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={submitting}
            fullWidth
          >
            {submitting ? 'Uploading...' : 'Upload'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AssignmentUpload;






