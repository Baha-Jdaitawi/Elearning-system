// Quiz Taking page styles extracted from inline sx props
export const quizTakingStyles = {
  // Main container
  container: {
    py: 4,
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  },

  // Loading state
  loadingContainer: {
    py: 4,
    textAlign: 'center'
  },

  loadingSubtitle: {
    mt: 2
  },

  // Error container
  errorContainer: {
    py: 4
  },

  errorButtons: {
    display: 'flex',
    gap: 2,
    justifyContent: 'center'
  },

  // No quiz container
  noQuizPaper: {
    p: 6,
    textAlign: 'center'
  },

  noQuizIcon: {
    fontSize: 80,
    color: 'text.secondary',
    mb: 2
  },

  noQuizTitle: {
    mb: 2
  },

  noQuizSubtitle: {
    color: 'text.secondary',
    mb: 3
  },

  // Quiz start screen
  startPaper: {
    p: 6,
    textAlign: 'center'
  },

  startIcon: {
    fontSize: 100,
    color: 'primary.main',
    mb: 3
  },

  startTitle: {
    mb: 2,
    fontWeight: 'bold'
  },

  startSubtitle: {
    color: 'text.secondary',
    mb: 4
  },

  statsGrid: {
    mb: 4,
    maxWidth: 400,
    mx: 'auto'
  },

  statCard: {
    p: 2,
    textAlign: 'center'
  },

  instructionsAlert: {
    mb: 4,
    textAlign: 'left'
  },

  instructionsList: {
    mb: 1
  },

  startButton: {
    px: 4,
    py: 1.5,
    fontSize: '1.1rem'
  },

  // Header with progress
  headerPaper: {
    p: 3,
    mb: 3,
    borderRadius: 2,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },

  headerGrid: {
    alignItems: 'center'
  },

  headerInfo: {
    display: 'flex',
    alignItems: 'center'
  },

  headerIcon: {
    mr: 2,
    color: 'primary.main'
  },

  headerTitle: {
    fontWeight: 'bold'
  },

  headerSubtitle: {
    color: 'text.secondary'
  },

  timerContainer: {
    textAlign: 'center'
  },

  timerBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    mb: 1
  },

  timerIcon: {
    mr: 1
  },

  timerText: {
    fontWeight: 'bold'
  },

  progressBar: {
    height: 8,
    borderRadius: 4
  },

  statusContainer: {
    textAlign: 'right'
  },

  statusChip: {
    mr: 1
  },

  // Question navigation sidebar
  sidebarPaper: {
    p: 2
  },

  sidebarTitle: {
    mb: 2
  },

  stepButton: {
    textAlign: 'left'
  },

  stepContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },

  stepIcon: {
    color: 'success.main',
    fontSize: 18
  },

  bookmarkIcon: {
    color: 'warning.main',
    fontSize: 18
  },

  // Current question
  questionPaper: {
    p: 4,
    mb: 3
  },

  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 3
  },

  questionTitle: {
    fontWeight: 'bold'
  },

  questionActions: {
    display: 'flex',
    gap: 1
  },

  questionText: {
    mb: 4,
    lineHeight: 1.6
  },

  // Answer options
  optionCard: {
    mb: 2,
    border: '1px solid',
    borderColor: 'divider'
  },

  optionLabel: {
    margin: 0,
    width: '100%',
    '&:hover': {
      backgroundColor: 'action.hover'
    }
  },

  optionRadio: {
    ml: 2
  },

  optionText: {
    py: 2,
    pr: 2
  },

  // Text answer
  textAnswerCard: {
    p: 2
  },

  textArea: {
    placeholder: 'Type your answer here...'
  },

  // Navigation controls
  navigationPaper: {
    p: 3
  },

  navigationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  navigationCenter: {
    display: 'flex',
    gap: 2,
    alignItems: 'center'
  },

  submitButton: {
    px: 4
  },

  incompleteText: {
    color: 'text.secondary'
  },

  // Results screen
  resultsPaper: {
    p: 4
  },

  resultsHeader: {
    textAlign: 'center',
    mb: 4
  },

  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    mb: 3
  },

  scoreText: {
    fontWeight: 'bold'
  },

  resultsTitle: {
    mb: 1,
    fontWeight: 'bold'
  },

  resultsMessage: {
    color: 'text.secondary',
    mb: 3
  },

  statsGrid: {
    mb: 4
  },

  statCard: {
    textAlign: 'center',
    p: 2
  },

  statValue: {
    fontWeight: 'bold'
  },

  statLabel: {
    color: 'text.secondary'
  },

  reviewTitle: {
    mb: 2
  },

  reviewCard: {
    mb: 2
  },

  reviewHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    mb: 2
  },

  reviewIcon: {
    mr: 2,
    mt: 0.5
  },

  reviewContent: {
    flex: 1
  },

  reviewQuestion: {
    fontWeight: 'medium',
    mb: 1
  },

  reviewAnswer: {
    mb: 1
  },

  reviewCorrect: {
    color: 'success.main'
  },

  reviewActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: 2,
    mt: 4
  }
};

// Create Quiz page styles  
export const createQuizStyles = {
  container: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  },

  headerPaper: {
    p: 3,
    mb: 3,
    borderRadius: 2,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },

  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  headerInfo: {
    display: 'flex',
    alignItems: 'center'
  },

  backButton: {
    mr: 2,
    backgroundColor: '#f0f0f0'
  },

  headerTitle: {
    fontWeight: 'bold',
    color: '#1a73e8'
  },

  headerSubtitle: {
    color: 'text.secondary'
  },

  statsChips: {
    display: 'flex',
    gap: 2
  },

  progressBar: {
    mt: 2,
    height: 6,
    borderRadius: 3
  },

  settingsPaper: {
    p: 3,
    borderRadius: 2,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    height: 'fit-content'
  },

  settingsTitle: {
    display: 'flex',
    alignItems: 'center',
    mb: 3
  },

  settingsIcon: {
    mr: 1,
    color: 'primary.main'
  },

  summaryBox: {
    backgroundColor: '#f8f9fa',
    p: 2,
    borderRadius: 2,
    mb: 3
  },

  summaryTitle: {
    mb: 1,
    color: 'primary.main',
    fontWeight: 'bold'
  },

  summaryItem: {
    color: 'text.secondary',
    mb: 1
  },

  createButton: {
    py: 1.5,
    backgroundColor: '#1a73e8',
    '&:hover': {
      backgroundColor: '#1557b0'
    },
    borderRadius: 2
  },

  questionsPaper: {
    p: 3,
    borderRadius: 2,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },

  questionsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 3
  },

  questionsTitle: {
    fontWeight: 'bold'
  },

  addButton: {
    borderRadius: 2
  },

  questionCard: {
    p: 3,
    mt: 2,
    backgroundColor: '#fafafa',
    border: '1px solid #e0e0e0'
  },

  questionActions: {
    display: 'flex',
    gap: 1,
    pt: 2,
    borderTop: '1px solid #e0e0e0'
  },

  optionsSection: {
    mt: 2
  },

  optionContainer: {
    display: 'flex',
    alignItems: 'center'
  },

  optionInput: {
    mr: 1
  },

  removeOptionButton: {
    color: 'error'
  }
};