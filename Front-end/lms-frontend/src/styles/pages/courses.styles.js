// Courses page styles extracted from inline sx props
export const coursesStyles = {
  // Main courses page
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

  filtersContainer: {
    mb: 4
  },

  searchInput: {
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
    height: 140,
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

  priceText: {
    color: '#1a1a1a',
    fontWeight: 'bold'
  },

  noResultsContainer: {
    textAlign: 'center',
    py: 8
  },

  noResultsTitle: {
    color: '#666',
    mb: 1
  },

  noResultsSubtitle: {
    color: '#999'
  },

  pagination: {
    display: 'flex',
    justifyContent: 'center',
    mt: 4
  }
};

// Course Detail page styles
export const courseDetailStyles = {
  container: {
    py: 3
  },

  headerCard: {
    mb: 3
  },

  headerImage: {
    height: 200,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative'
  },

  headerContent: {
    p: 4
  },

  courseTitle: {
    fontWeight: 'bold',
    mb: 2
  },

  instructorContainer: {
    display: 'flex',
    alignItems: 'center',
    mb: 3
  },

  instructorAvatar: {
    width: 40,
    height: 40,
    mr: 2
  },

  instructorName: {
    color: '#666'
  },

  description: {
    mb: 3,
    color: '#666'
  },

  chipsContainer: {
    display: 'flex',
    gap: 1,
    mb: 3
  },

  progressContainer: {
    mb: 3
  },

  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#0056d3',
      borderRadius: 4
    }
  },

  actionButtons: {
    display: 'flex',
    gap: 2
  },

  enrollButton: {
    px: 4,
    backgroundColor: '#0056d3',
    '&:hover': {
      backgroundColor: '#004bb8'
    }
  }
};

// Create Course page styles
export const createCourseStyles = {
  container: {
    mt: 4,
    mb: 4
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    mb: 4
  },

  backButton: {
    mr: 2,
    backgroundColor: '#f5f5f5',
    '&:hover': {
      backgroundColor: '#e0e0e0'
    }
  },

  title: {
    fontWeight: 'bold',
    color: '#0056d3'
  },

  paper: {
    p: 4,
    borderRadius: 3
  },

  thumbnailContainer: {
    mb: 3
  },

  thumbnailBox: {
    width: '100%',
    maxWidth: '300px',
    height: '200px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textAlign: 'center',
    border: '2px solid #e0e0e0',
    position: 'relative',
    overflow: 'hidden'
  },

  thumbnailIcon: {
    fontSize: '3rem',
    mb: 1,
    opacity: 0.9
  },

  thumbnailTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    px: 2,
    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
  },

  thumbnailLevel: {
    fontSize: '0.8rem',
    opacity: 0.8,
    mt: 0.5
  },

  refreshButton: {
    mt: 1,
    textTransform: 'none'
  },

  sectionTitle: {
    mb: 2,
    fontWeight: 'bold',
    color: '#0056d3'
  },

  arrayFieldContainer: {
    display: 'flex',
    mb: 2,
    alignItems: 'center'
  },

  removeButton: {
    ml: 1,
    color: '#f44336'
  },

  addButton: {
    mb: 4,
    textTransform: 'none'
  },

  submitContainer: {
    textAlign: 'center',
    mt: 4
  },

  submitButton: {
    backgroundColor: '#0056d3',
    '&:hover': {
      backgroundColor: '#004bb8'
    },
    textTransform: 'none',
    px: 6,
    py: 1.5,
    fontSize: '1.1rem',
    fontWeight: 'bold',
    borderRadius: 2
  },

  successCard: {
    textAlign: 'center',
    p: 6,
    color: 'white',
    borderRadius: 4
  },

  successIcon: {
    fontSize: 80,
    mb: 2
  },

  successTitle: {
    mb: 2,
    fontWeight: 'bold'
  },

  successSubtitle: {
    opacity: 0.9
  }
};