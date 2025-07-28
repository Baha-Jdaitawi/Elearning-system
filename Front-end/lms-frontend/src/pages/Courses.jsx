import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Pagination,
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { apiGet } from '../services/api';

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  });

  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category_id: searchParams.get('category') || '',
    level: searchParams.get('level') || '',
    page: parseInt(searchParams.get('page')) || 1
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiGet('/categories');
        if (response.success) {
          setCategories(response.data);
        }
      } catch {
        // Handle silently
      }
    };
    fetchCategories();
  }, []);

  // Fetch courses when filters change
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.category_id) params.append('category_id', filters.category_id);
        if (filters.level) params.append('level', filters.level);
        params.append('page', filters.page.toString());
        params.append('limit', '12');

        const response = await apiGet(`/courses?${params.toString()}`);
        if (response.success) {
          setCourses(response.data.courses);
          setPagination(response.data.meta);
        }
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [filters]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category_id) params.append('category', filters.category_id);
    if (filters.level) params.append('level', filters.level);
    if (filters.page > 1) params.append('page', filters.page.toString());
    
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset page when changing other filters
    }));
  };

  const handlePageChange = (event, page) => {
    handleFilterChange('page', page);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            color: '#1a1a1a',
            mb: 1
          }}
        >
          Courses
        </Typography>
        <Typography variant="body1" sx={{ color: '#666' }}>
          {pagination.totalCount} courses available
        </Typography>
      </Box>

     
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="What do you want to learn?"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#666' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8f9fa',
                  border: 'none',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0056d3',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0056d3',
                  }
                }
              }}
            />
          </Grid>
          
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category_id}
                onChange={(e) => handleFilterChange('category_id', e.target.value)}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Level</InputLabel>
              <Select
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                label="Level"
              >
                <MenuItem value="">All Levels</MenuItem>
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Course Grid */}
      {loading ? (
        <Typography sx={{ textAlign: 'center', py: 4, color: '#666' }}>
          Loading courses...
        </Typography>
      ) : courses.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
            No courses found
          </Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>
            Try adjusting your search or filters
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
                <Card 
                  component={Link}
                  to={`/courses/${course.id}`}
                  sx={{ 
                    textDecoration: 'none',
                    height: '100%',
                    transition: 'box-shadow 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                 
                  <Box
                    sx={{
                      height: 140,
                      backgroundColor: '#f0f4ff',
                      position: 'relative'
                    }}
                  />
                  
                  <CardContent sx={{ p: 2 }}>
                    <Typography 
                      variant="h6" 
                      component="h3"
                      sx={{ 
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: '#1a1a1a',
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.3
                      }}
                    >
                      {course.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ width: 20, height: 20, mr: 1 }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#666',
                          fontSize: '0.875rem'
                        }}
                      >
                        {course.instructor_name}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Chip 
                        label={course.level} 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#f8f9fa',
                          color: '#666',
                          fontSize: '0.75rem',
                          height: 24,
                          textTransform: 'capitalize'
                        }} 
                      />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#1a1a1a',
                          fontWeight: 'bold'
                        }}
                      >
                        {course.price > 0 ? `$${course.price}` : 'Free'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Courses;