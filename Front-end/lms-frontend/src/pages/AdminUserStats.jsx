import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Button,
  Tooltip
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { userAPI } from '../services/api';
import { saveAs } from 'file-saver';

ChartJS.register(BarElement, CategoryScale, LinearScale, ChartTooltip, Legend);

const StatCard = ({ title, value }) => (
  <Card elevation={3} sx={{ height: '100%', p: 2 }}>
    <CardContent>
      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h5" fontWeight="bold">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const AdminUserStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await userAPI.getUserStats();
      setStats(res.data);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error('Error fetching stats:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!stats?.registrationTrends?.length) return;
    const headers = ['Date,Total,Students,Instructors'];
    const rows = stats.registrationTrends.map(item =>
      `${item.date},${item.registrations},${item.studentRegistrations},${item.instructorRegistrations}`
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'registration-trends.csv');
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!stats) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h6" color="error">
          Failed to load user statistics.
        </Typography>
      </Container>
    );
  }

  const { overview, registrationTrends } = stats;

  const chartData = {
    labels: registrationTrends.map(item => item.date),
    datasets: [
      {
        label: 'Total Registrations',
        data: registrationTrends.map(item => item.registrations),
        backgroundColor: '#1976d2',
        borderRadius: 6
      },
      {
        label: 'Students',
        data: registrationTrends.map(item => item.studentRegistrations),
        backgroundColor: '#4caf50',
        borderRadius: 6
      },
      {
        label: 'Instructors',
        data: registrationTrends.map(item => item.instructorRegistrations),
        backgroundColor: '#ff9800',
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h4">📊 User Statistics Dashboard</Typography>
        <Tooltip title="Download registration trends as CSV">
          <Button variant="outlined" onClick={exportCSV}>
            Export CSV
          </Button>
        </Tooltip>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Users" value={overview.totalUsers} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Students" value={overview.totalStudents} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Instructors" value={overview.totalInstructors} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Admins" value={overview.totalAdmins} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Verified Users" value={overview.verifiedUsers} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Google Users" value={overview.googleUsers} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active (7d)" value={overview.activeUsersThisWeek} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active (30d)" value={overview.activeUsersThisMonth} />
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Registration Trends (Last 30 Days)
        </Typography>
        <Bar data={chartData} options={chartOptions} />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Last updated: {lastUpdated}
        </Typography>
      </Paper>
    </Container>
  );
};

export default AdminUserStats;




