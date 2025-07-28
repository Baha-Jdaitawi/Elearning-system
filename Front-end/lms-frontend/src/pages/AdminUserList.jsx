import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Button,
  Stack
} from '@mui/material';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let res;

      if (search.trim()) {
        const encodedSearch = encodeURIComponent(search.trim());
        res = await userAPI.searchUsers(encodedSearch);
      } else if (roleFilter) {
        res = await userAPI.getUsersByRole(roleFilter);
      } else {
        res = await userAPI.getAllUsers();
      }

      setUsers(Array.isArray(res?.data?.users) ? res.data.users : res?.data || []);
    } catch {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (id) => {
    try {
      await userAPI.promoteToInstructor(id);
      toast.success('User promoted to instructor');
      fetchUsers();
    } catch {
      toast.error('Promotion failed');
    }
  };

  const handleDemote = async (id) => {
    try {
      await userAPI.demoteToStudent(id);
      toast.success('User demoted to student');
      fetchUsers();
    } catch {
      toast.error('Demotion failed');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        All Users
      </Typography>

      <Box display="flex" gap={2} my={2} flexWrap="wrap">
        <TextField
          label="Search by name or email"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <FormControl variant="outlined" sx={{ minWidth: 150 }}>
          <InputLabel>Filter by Role</InputLabel>
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            label="Filter by Role"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="instructor">Instructor</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>

        <Button variant="outlined" onClick={() => { setSearch(''); setRoleFilter(''); }}>
          Reset
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      {user.role === 'student' && (
                        <Button size="small" color="success" onClick={() => handlePromote(user.id)}>
                          Promote
                        </Button>
                      )}
                      {user.role === 'instructor' && (
                        <Button size="small" color="warning" onClick={() => handleDemote(user.id)}>
                          Demote
                        </Button>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default AdminUserList;











