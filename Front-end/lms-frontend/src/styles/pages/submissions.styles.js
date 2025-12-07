// Submission Dashboard page styles extracted from inline sx props
export const submissionDashboardStyles = {
  container: {
    py: 3
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 4
  },

  title: {
    fontWeight: 'bold'
  },

  refreshButton: {
    textTransform: 'none'
  },

  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh'
  },

  loadingText: {
    ml: 2
  },

  errorContainer: {
    mb: 3
  },

  noSubmissionsCard: {
    p: 6,
    textAlign: 'center'
  },

  noSubmissionsIcon: {
    fontSize: 80,
    color: 'text.secondary',
    mb: 2
  },

  noSubmissionsTitle: {
    color: 'text.secondary',
    mb: 2
  },

  noSubmissionsText: {
    color: 'text.secondary'
  },

  submissionCard: {
    mb: 3,
    borderRadius: 2
  },

  submissionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    mb: 2
  },

  submissionTitle: {
    fontWeight: 'bold',
    mb: 1
  },

  submissionMeta: {
    color: 'text.secondary',
    mb: 2
  },

  submissionContent: {
    mb: 2
  },

  submissionText: {
    whiteSpace: 'pre-wrap',
    backgroundColor: '#f5f5f5',
    p: 2,
    borderRadius: 1,
    border: '1px solid #e0e0e0'
  },

  fileAttachment: {
    display: 'flex',
    alignItems: 'center',
    mt: 2
  },

  fileIcon: {
    mr: 1,
    color: 'primary.main'
  },

  fileName: {
    textDecoration: 'none',
    color: 'primary.main',
    '&:hover': {
      textDecoration: 'underline'
    }
  },

  submissionFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  gradeContainer: {
    display: 'flex',
    alignItems: 'center'
  },

  gradeText: {
    fontWeight: 'bold',
    mr: 1
  },

  feedbackButton: {
    size: 'small',
    textTransform: 'none'
  }
};