// Instructor Dashboard page styles
export const instructorDashboardStyles = {
  container: {
    mt: 4,
    mb: 4
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 4
  },

  title: {
    fontWeight: 'bold'
  },

  actionButtons: {
    display: 'flex',
    gap: 2
  },

  refreshButton: {
    textTransform: 'none',
    borderColor: '#0056d3',
    color: '#0056d3'
  },

  createButton: {
    backgroundColor: '#0056d3',
    '&:hover': { backgroundColor: '#004bb8' },
    textTransform: 'none',
    fontWeight: 'bold'
  },

  statsGrid: {
    mb: 4
  },

  statCard: {
    height: '100%',
    backgroundColor: '#f8f9fa'
  },

  statContent: {
    display: 'flex',
    alignItems: 'center'
  },

  statAvatar: {
    mr: 2
  },

  statValue: {
    fontWeight: 'bold'
  },

  statLabel: {
    color: 'text.secondary'
  },

  coursesTitle: {
    mb: 3,
    fontWeight: 'bold'
  },

  noCourses: {
    p: 4,
    textAlign: 'center'
  },

  courseCard: {
    height: '100%',
    '&:hover': { boxShadow: 6 },
    display: 'flex',
    flexDirection: 'column'
  },

  courseImage: {
    height: 160,
    objectFit: 'cover'
  },

  cardContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },

  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    mb: 2
  },

  courseTitle: {
    fontWeight: 'bold',
    flexGrow: 1
  },

  courseDescription: {
    color: 'text.secondary',
    mb: 2,
    flexGrow: 1
  },

  courseInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 2
  },

  coursePrice: {
    fontWeight: 'bold',
    color: '#0056d3'
  },

  courseStats: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 2
  },

  courseMeta: {
    color: 'text.secondary'
  },

  courseActions: {
    display: 'flex',
    gap: 1,
    mt: 'auto'
  },

  viewButton: {
    backgroundColor: '#0056d3',
    '&:hover': { backgroundColor: '#004bb8' },
    textTransform: 'none',
    flex: 1
  },

  manageButton: {
    textTransform: 'none',
    borderColor: '#0056d3',
    color: '#0056d3'
  }
};

// Course Management page styles
export const courseManageStyles = {
  container: {
    py: 3
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

  headerActions: {
    display: 'flex',
    gap: 2
  },

  tabsPaper: {
    mb: 3
  },

  tabs: {
    borderBottom: 1,
    borderColor: 'divider'
  },

  quickActionsPaper: {
    p: 3,
    mb: 3
  },

  quickActionsTitle: {
    mb: 2
  },

  quickActionsGrid: {},

  quickActionButton: {
    py: 2
  },

  helperAlert: {
    mt: 2
  },

  structurePaper: {
    p: 3
  },

  structureTitle: {
    mb: 3
  },

  noModulesContainer: {
    textAlign: 'center',
    py: 6
  },

  noModulesIcon: {
    fontSize: 80,
    color: 'text.secondary',
    mb: 2
  },

  noModulesTitle: {
    color: 'text.secondary',
    mb: 2
  },

  noModulesText: {
    color: 'text.secondary',
    mb: 3
  },

  createModuleButton: {
    size: 'large'
  },

  moduleCard: {
    mb: 2
  },

  moduleHeader: {
    display: 'flex',
    alignItems: 'center',
    mb: 2
  },

  moduleIcon: {
    mr: 2,
    color: 'primary.main'
  },

  moduleInfo: {
    flex: 1
  },

  moduleTitle: {
    fontWeight: 'bold'
  },

  moduleMeta: {
    color: 'text.secondary'
  },

  moduleEditButton: {
    size: 'small'
  },

  moduleDescription: {
    mb: 2,
    ml: 4,
    color: 'text.secondary'
  },

  lessonsContainer: {
    ml: 4
  },

  lessonItem: {
    display: 'flex',
    alignItems: 'center',
    py: 1
  },

  lessonIcon: {
    mr: 2,
    color: 'text.secondary'
  },

  lessonInfo: {
    flex: 1
  },

  lessonTitle: {},

  draftLabel: {
    ml: 1,
    fontSize: '0.8rem',
    color: 'warning.main'
  },

  lessonMeta: {
    color: 'text.secondary'
  },

  lessonAction: {
    size: 'small',
    title: 'View Lesson'
  },

  noLessonsContainer: {
    ml: 4,
    py: 2,
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 1
  },

  noLessonsText: {
    color: 'text.secondary'
  },

  addLessonButton: {
    size: 'small',
    mt: 1
  },

  statsCard: {
    textAlign: 'center'
  }
};

// Lesson Management page styles
export const lessonManagementStyles = {
  container: {
    mt: 4,
    mb: 4
  },

  headerPaper: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    p: 4,
    mb: 4,
    borderRadius: 2
  },

  headerGrid: {
    alignItems: 'center'
  },

  headerTitle: {
    gutterBottom: true
  },

  headerSubtitle: {
    opacity: 0.9
  },

  headerChips: {
    mt: 2,
    display: 'flex',
    gap: 1,
    flexWrap: 'wrap'
  },

  headerChip: {
    bgcolor: 'rgba(255,255,255,0.2)',
    color: 'white'
  },

  headerActions: {
    textAlign: 'right'
  },

  headerButton: {
    mr: 1,
    mb: 1,
    bgcolor: 'rgba(255,255,255,0.2)'
  },

  headerOutlineButton: {
    mb: 1,
    borderColor: 'white',
    color: 'white'
  },

  analyticsGrid: {
    mb: 4
  },

  analyticsCard: {
    textAlign: 'center',
    p: 2
  },

  analyticsIcon: {
    fontSize: 40,
    mb: 1
  },

  analyticsValue: {
    color: 'primary'
  },

  analyticsLabel: {
    color: 'textSecondary'
  },

  tabsPaper: {
    borderRadius: 2
  },

  tabs: {
    borderBottom: 1,
    borderColor: 'divider'
  },

  tabContent: {
    p: 3
  },

  tabHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 3
  },

  videoPreview: {
    bgcolor: '#f5f5f5',
    height: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1,
    mb: 2
  },

  videoIcon: {
    fontSize: 60,
    color: '#757575'
  },

  quizCard: {
    mb: 2
  },

  quizHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    mb: 2
  },

  quizGrid: {
    mb: 2
  },

  noContentCard: {
    textAlign: 'center',
    p: 4
  },

  noContentIcon: {
    fontSize: 60,
    color: '#ccc',
    mb: 2
  },

  noContentTitle: {
    color: 'textSecondary',
    gutterBottom: true
  },

  noContentText: {
    color: 'textSecondary',
    paragraph: true
  },

  studentCard: {},

  studentHeader: {
    display: 'flex',
    alignItems: 'center',
    mb: 2
  },

  studentAvatar: {
    mr: 2,
    bgcolor: '#2196f3'
  },

  studentProgress: {
    mb: 2
  },

  studentProgressBar: {
    mb: 1
  },

  studentStats: {
    mb: 2
  }
};

// Instructor Students page styles
export const instructorStudentsStyles = {
  container: {
    py: 3
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

  statsContainer: {
    display: 'flex',
    gap: 2,
    mb: 4,
    flexWrap: 'wrap'
  },

  statCard: {
    flex: 1,
    minWidth: 200
  },

  statContent: {
    textAlign: 'center'
  },

  statValue: {
    fontWeight: 'bold'
  },

  statLabel: {
    color: 'text.secondary'
  },

  noStudentsContainer: {
    textAlign: 'center',
    py: 8
  },

  noStudentsIcon: {
    fontSize: 80,
    color: 'text.secondary',
    mb: 2
  },

  noStudentsTitle: {
    color: 'text.secondary',
    mb: 2
  },

  noStudentsText: {
    color: 'text.secondary',
    mb: 3
  },

  inviteButton: {},

  studentRow: {
    hover: true
  },

  studentInfo: {
    display: 'flex',
    alignItems: 'center'
  },

  studentAvatar: {
    mr: 2
  },

  studentName: {
    fontWeight: 'medium'
  },

  progressContainer: {
    width: 100
  },

  progressBar: {
    mb: 1
  },

  emailButton: {
    size: 'small',
    title: 'Send Email'
  }
};