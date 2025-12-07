// Dashboard page styles
export const dashboardStyles = {
  container: {
    py: 3
  },

  header: {
    mb: 4
  },

  title: {
    fontWeight: 'bold',
    color: '#1a1a1a',
    mb: 1
  },

  subtitle: {
    color: '#666'
  },

  coursesSection: {},

  coursesTitle: {
    fontWeight: 'bold',
    color: '#1a1a1a',
    mb: 3
  },

  noCoursesCard: {
    p: 4,
    textAlign: 'center',
    backgroundColor: '#f8f9fa'
  },

  noCoursesTitle: {
    color: '#666',
    mb: 2
  },

  noCoursesText: {
    color: '#999',
    mb: 3
  },

  noCoursesLink: {
    color: '#0056d3',
    textDecoration: 'none',
    fontWeight: 'bold'
  },

  courseCard: {
    textDecoration: 'none',
    height: '100%',
    transition: 'box-shadow 0.2s',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }
  },

  courseImage: {
    height: 120,
    backgroundColor: '#f0f4ff',
    position: 'relative'
  },

  cardContent: {
    p: 2
  },

  courseTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#1a1a1a',
    mb: 1,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: 1.3
  },

  instructorContainer: {
    display: 'flex',
    alignItems: 'center',
    mb: 2
  },

  instructorAvatar: {
    width: 20,
    height: 20,
    mr: 1
  },

  instructorName: {
    color: '#666',
    fontSize: '0.875rem'
  },

  progressContainer: {
    mb: 2
  },

  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    mb: 1
  },

  progressText: {
    color: '#666'
  },

  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f0f0f0',
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#0056d3',
      borderRadius: 3
    }
  },

  courseFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  levelChip: {
    backgroundColor: '#f8f9fa',
    color: '#666',
    fontSize: '0.75rem',
    height: 24,
    textTransform: 'capitalize'
  },

  completedChip: {
    backgroundColor: '#e8f5e8',
    color: '#2e7d32',
    fontSize: '0.75rem',
    height: 24
  }
};

// Dashboard Redirect page styles
export const dashboardRedirectStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    mt: 8
  },

  loader: {}
};