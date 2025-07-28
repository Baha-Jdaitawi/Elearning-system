import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  CircularProgress,
  Box,
  Button
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

const AdminUserActivity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchUserActivity();
  }, [id]);

  const fetchUserActivity = async () => {
    try {
      setLoading(true);
      const res = await userAPI.getUserActivity(id);
      setActivities(res?.data?.activity || []);
      setUserName(res?.data?.user?.name || 'User');
    } catch (err) {
      console.error('Failed to fetch user activity:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/admin/users'); 
  };

  if (loading) return <CircularProgress />;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Activity Log - {userName}</Typography>
        <Button variant="outlined" onClick={handleGoBack}>
          Back to Users
        </Button>
      </Box>

      {activities.length === 0 ? (
        <Typography>No activity records found.</Typography>
      ) : (
        <Paper elevation={3}>
          <List>
            {activities.map((log, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={log.action}
                  secondary={new Date(log.timestamp).toLocaleString()}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <Box mt={2}>
        <Typography variant="body2" color="textSecondary">
          Total actions: {activities.length}
        </Typography>
      </Box>
    </Container>
  );
};

export default AdminUserActivity;

