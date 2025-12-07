// Home page styles
export const homeStyles = {
  container: {
    py: 4
  },

  heroSection: {
    mb: 6
  },

  heroTitle: {
    fontWeight: 'bold',
    color: '#1a1a1a',
    mb: 2,
    fontSize: { xs: '2rem', md: '2.75rem' }
  },

  heroSubtitle: {
    color: '#666',
    mb: 4,
    fontWeight: 'normal',
    maxWidth: 600
  },

  heroButton: {
    backgroundColor: '#0056d3',
    px: 3,
    py: 1.5,
    fontSize: '1rem',
    fontWeight: 'bold'
  },

  coursesSection: {},

  coursesTitle: {
    fontWeight: 'bold',
    color: '#1a1a1a',
    mb: 3
  },

  loadingText: {
    color: '#666'
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

  viewAllButton: {
    mt: 4,
    color: '#0056d3',
    borderColor: '#0056d3',
    fontWeight: 'bold'
  }
};

// Not Found page styles
export const notFoundStyles = {
  container: {
    mt: 8,
    mb: 4
  },

  card: {
    textAlign: 'center',
    p: 6,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: 4
  },

  errorCode: {
    fontSize: '6rem',
    fontWeight: 'bold',
    mb: 2
  },

  errorTitle: {
    mb: 2,
    fontWeight: 'bold'
  },

  errorSubtitle: {
    opacity: 0.9,
    mb: 4
  },

  actionButtons: {
    display: 'flex',
    gap: 2,
    justifyContent: 'center',
    flexWrap: 'wrap'
  },

  homeButton: {
    backgroundColor: 'white',
    color: '#667eea',
    '&:hover': { backgroundColor: '#f5f5f5' }
  },

  backButton: {
    borderColor: 'white',
    color: 'white',
    '&:hover': { 
      borderColor: 'white', 
      backgroundColor: 'rgba(255,255,255,0.1)' 
    }
  }
};

// Learning Analytics page styles
export const learningAnalyticsStyles = {
  container: {
    mt: 4,
    mb: 4
  },

  header: {
    mb: 4
  },

  title: {
    fontWeight: 'bold',
    color: '#1976d2'
  },

  subtitle: {
    color: 'text.secondary'
  },

  warningAlert: {
    mb: 3
  },

  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px'
  },

  loadingText: {
    ml: 2
  },

  statsGrid: {
    mb: 4
  },

  statCard: {
    height: '100%',
    color: 'white'
  },

  statContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  statValue: {
    fontWeight: 'bold'
  },

  statLabel: {
    opacity: 0.9
  },

  statIcon: {
    fontSize: 40,
    opacity: 0.8
  },

  progressPaper: {
    p: 3,
    mb: 3
  },

  progressTitle: {
    display: 'flex',
    alignItems: 'center'
  },

  progressIcon: {
    mr: 1
  },

  progressOverview: {
    mb: 3
  },

  progressBar: {
    height: 8,
    borderRadius: 4
  },

  enrollmentsList: {},

  enrollmentItem: {
    px: 0,
    py: 2
  },

  enrollmentIcon: {},

  enrollmentContent: {
    flexGrow: 1
  },

  enrollmentTitle: {
    mb: 1
  },

  enrollmentProgress: {
    display: 'flex',
    alignItems: 'center',
    mb: 1
  },

  enrollmentProgressBar: {
    flexGrow: 1,
    mr: 2,
    height: 6,
    borderRadius: 3
  },

  enrollmentProgressText: {
    color: 'text.secondary'
  },

  completedChip: {
    color: 'success'
  },

  recommendationsPaper: {
    p: 3,
    mb: 3
  },

  recommendationsTitle: {
    display: 'flex',
    alignItems: 'center'
  },

  recommendationsIcon: {
    mr: 1
  },

  recommendationsStack: {
    spacing: 2
  },

  recommendationBox: {
    p: 2,
    border: '1px solid #e0e0e0',
    borderRadius: 2
  },

  recommendationTitle: {
    mb: 1
  },

  recommendationReason: {
    display: 'block',
    mb: 1
  },

  recommendationInstructor: {
    display: 'flex',
    alignItems: 'center'
  },

  starIcon: {
    fontSize: 16,
    color: '#ffa726',
    mr: 0.5
  },

  certificatesPaper: {
    p: 3
  },

  certificatesTitle: {
    display: 'flex',
    alignItems: 'center'
  },

  certificatesIcon: {
    mr: 1
  },

  certificatesBox: {
    textAlign: 'center',
    py: 2
  },

  certificatesValue: {
    fontWeight: 'bold',
    color: '#1976d2'
  },

  certificatesLabel: {
    color: 'text.secondary'
  },

  actionsPaper: {
    p: 3,
    mt: 3
  },

  actionsTitle: {
    gutterBottom: true
  },

  actionsGrid: {
    spacing: 2
  },

  actionButton: {
    textTransform: 'none',
    py: 1.5
  }
};

// User Preferences page styles
export const userPreferencesStyles = {
  container: {
    py: 4
  },

  header: {
    mb: 4
  },

  title: {
    fontWeight: 600,
    mb: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 2
  },

  titleIcon: {
    color: 'primary',
    fontSize: 40
  },

  subtitle: {
    color: 'text.secondary'
  },

  successAlert: {
    mb: 3
  },

  errorAlert: {
    mb: 3
  },

  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400
  },

  sectionCard: {
    elevation: 1,
    borderRadius: 3
  },

  sectionContent: {
    p: 3
  },

  sectionTitle: {
    fontWeight: 600,
    mb: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 1
  },

  sectionIcon: {
    color: 'primary'
  },

  sectionDescription: {
    color: 'text.secondary',
    mb: 3
  },

  chipsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 1
  },

  chip: {
    borderRadius: 2,
    '&:hover': { transform: 'translateY(-1px)' },
    transition: 'all 0.2s ease'
  },

  formControl: {
    mb: 3,
    borderRadius: 2
  },

  sliderContainer: {
    px: 2
  },

  tipBox: {
    mt: 3,
    p: 2,
    bgcolor: 'grey.50',
    borderRadius: 2
  },

  tipText: {
    color: 'text.secondary'
  },

  saveButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    pt: 2
  },

  saveButton: {
    borderRadius: 3,
    px: 4,
    py: 1.5,
    textTransform: 'none',
    fontWeight: 600,
    minWidth: 200
  },

  aiInfoPaper: {
    elevation: 0,
    p: 3,
    borderRadius: 3,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  },

  aiInfoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    mb: 2
  },

  aiInfoIcon: {
    fontSize: 30
  },

  aiInfoTitle: {
    fontWeight: 600
  },

  aiInfoText: {
    opacity: 0.9
  }
};

// Recommendations Widget page styles  
export const recommendationsWidgetStyles = {
  container: {
    py: 4
  },

  headerContainer: {
    mb: 4
  },

  headerBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 2
  },

  title: {
    fontWeight: 600,
    color: 'text.primary'
  },

  refreshButton: {
    bgcolor: 'primary.main',
    color: 'white',
    '&:hover': { bgcolor: 'primary.dark' }
  },

  subtitle: {
    color: 'text.secondary'
  },

  noRecommendationsPaper: {
    p: 6,
    textAlign: 'center',
    borderRadius: 3
  },

  noRecommendationsIcon: {
    fontSize: 80,
    color: 'text.disabled',
    mb: 2
  },

  noRecommendationsTitle: {
    fontWeight: 500
  },

  noRecommendationsText: {
    color: 'text.secondary'
  },

  browseButton: {
    mt: 2
  },

  recommendationCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    borderRadius: 3,
    border: '1px solid',
    borderColor: 'divider',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
      borderColor: 'primary.main'
    }
  },

  cardImageContainer: {
    position: 'relative',
    height: 180,
    bgcolor: 'grey.100'
  },

  cardImage: {
    objectFit: 'cover'
  },

  cardImagePlaceholder: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  },

  cardImageIcon: {
    fontSize: 60
  },

  recommendationBadge: {
    position: 'absolute',
    top: 12,
    left: 12
  },

  badgeChip: {
    bgcolor: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(10px)',
    fontWeight: 500,
    fontSize: '0.75rem'
  },

  bookmarkButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    bgcolor: 'rgba(255,255,255,0.9)',
    '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
  },

  cardContent: {
    flexGrow: 1,
    p: 3
  },

  cardTitle: {
    fontWeight: 600,
    lineHeight: 1.3,
    mb: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    minHeight: '2.6em'
  },

  instructorInfo: {
    mb: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    color: 'text.secondary'
  },

  instructorIcon: {
    fontSize: 16
  },

  statsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    mb: 2
  },

  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5
  },

  ratingIcon: {
    fontSize: 16,
    color: '#ffa726'
  },

  ratingValue: {
    fontWeight: 500
  },

  enrollmentCount: {
    color: 'text.secondary'
  },

  courseMetaContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mb: 3
  },

  metaChip: {
    fontSize: '0.75rem'
  },

  durationContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5
  },

  durationIcon: {
    fontSize: 14,
    color: 'text.secondary'
  },

  durationText: {
    color: 'text.secondary'
  },

  cardActions: {
    display: 'flex',
    gap: 1
  },

  viewButton: {
    flexGrow: 1,
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 600
  },

  priceButton: {
    borderRadius: 2,
    textTransform: 'none',
    minWidth: 'auto',
    px: 2
  },

  loadMoreContainer: {
    textAlign: 'center',
    mt: 6
  },

  loadMoreButton: {
    borderRadius: 3,
    px: 4,
    py: 1.5,
    textTransform: 'none',
    fontWeight: 600
  }
};