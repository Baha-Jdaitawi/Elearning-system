// Assignment Detail page styles extracted from inline sx props
export const assignmentDetailStyles = {
  container: {
    py: 4
  },

  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh'
  },

  errorContainer: {
    mb: 3
  },

  backButton: {
    mb: 3
  },

  successPaper: {
    p: 6,
    textAlign: 'center',
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    color: 'white'
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
    mb: 3,
    opacity: 0.9
  },

  successActions: {
    display: 'flex',
    gap: 2,
    justifyContent: 'center',
    mt: 4
  },

  successButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.3)'
    }
  },

  successOutlineButton: {
    borderColor: 'white',
    color: 'white',
    '&:hover': {
      borderColor: 'white',
      backgroundColor: 'rgba(255,255,255,0.1)'
    }
  },

  headerTitle: {
    fontWeight: 'bold',
    color: '#0056d3'
  },

  headerSubtitle: {
    color: 'text.secondary'
  },

  detailsPaper: {
    p: 4,
    mb: 3
  },

  detailsTitle: {
    fontWeight: 'bold',
    color: '#0056d3',
    mb: 3
  },

  description: {
    lineHeight: 1.8
  },

  divider: {
    my: 3
  },

  instructionsTitle: {
    fontWeight: 'bold',
    color: '#0056d3'
  },

  instructionsText: {
    whiteSpace: 'pre-wrap',
    lineHeight: 1.8,
    backgroundColor: 'grey.50',
    p: 3,
    borderRadius: 1,
    border: '1px solid',
    borderColor: 'grey.200'
  },

  requirementsTitle: {
    fontWeight: 'bold',
    color: '#0056d3'
  },

  requirementsList: {
    px: 0
  },

  requirementIcon: {
    color: 'primary'
  },

  rubricAccordion: {
    mt: 3
  },

  rubricTitle: {
    fontWeight: 'bold',
    color: '#0056d3'
  },

  rubricTable: {},

  rubricCell: {
    fontWeight: 'bold'
  },

  submissionPaper: {
    p: 4
  },

  submissionTitle: {
    fontWeight: 'bold',
    color: '#0056d3',
    mb: 3
  },

  submissionAlert: {
    mb: 3
  },

  submissionContent: {
    backgroundColor: 'grey.50'
  },

  submissionText: {
    whiteSpace: 'pre-wrap'
  },

  fileUploadContainer: {
    mb: 3
  },

  fileUploadButton: {
    mb: 2,
    py: 2
  },

  fileInfo: {
    color: 'text.secondary',
    mt: 1
  },

  submitButton: {
    minWidth: 200
  },

  sidebarCard: {
    mb: 3
  },

  sidebarTitle: {
    display: 'flex',
    alignItems: 'center'
  },

  sidebarIcon: {
    mr: 1
  },

  infoBox: {
    mb: 2
  },

  infoLabel: {
    color: 'text.secondary'
  },

  warningAlert: {
    mb: 3
  },

  warningContainer: {
    display: 'flex',
    alignItems: 'center'
  },

  warningIcon: {
    mr: 1
  },

  warningTitle: {
    fontWeight: 'bold'
  },

  warningText: {
    color: 'text.secondary'
  }
};

// Create Assignment page styles
export const createAssignmentStyles = {
  container: {
    py: 4
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    mb: 4
  },

  backButton: {
    mr: 2
  },

  headerContent: {
    flex: 1
  },

  headerTitle: {
    fontWeight: 'bold'
  },

  headerSubtitle: {
    color: 'text.secondary'
  },

  paper: {
    p: 4
  },

  sectionTitle: {
    mb: 3
  },

  formInput: {
    mb: 3
  },

  instructionsTitle: {
    mb: 2
  },

  instructionsInput: {
    mb: 3
  },

  instructionsHelper: {
    mb: 3
  },

  divider: {
    my: 3
  },

  settingsTitle: {
    mb: 2
  },

  settingsGrid: {
    mb: 3
  },

  switchContainer: {
    mb: 3
  },

  actionButtons: {
    display: 'flex',
    gap: 2,
    flexWrap: 'wrap'
  },

  submitButton: {
    minWidth: 120
  },

  sidebarCard: {
    height: '100%'
  },

  guidelinesTitle: {
    display: 'flex',
    alignItems: 'center'
  },

  guidelinesIcon: {
    mr: 1
  },

  guideline: {
    color: 'text.secondary'
  },

  tipsCard: {
    mt: 2
  },

  tipsTitle: {
    display: 'flex',
    alignItems: 'center'
  },

  tipsIcon: {
    mr: 1
  },

  tip: {
    color: 'text.secondary'
  },

  infoCard: {
    mt: 2
  },

  infoTitle: {
    mb: 2
  },

  infoItem: {
    color: 'text.secondary'
  }
};

// Assignment Upload page styles
export const assignmentUploadStyles = {
  container: {
    mt: 8
  },

  paper: {
    p: 4
  },

  title: {
    fontWeight: 'bold',
    color: '#0056d3'
  },

  input: {
    mb: 3
  },

  fileLabel: {
    mb: 1
  },

  fileInput: {
    marginBottom: '16px'
  },

  errorAlert: {
    mt: 2
  },

  submitButton: {
    mt: 2
  }
};