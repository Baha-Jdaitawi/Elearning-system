// Create Module page styles extracted from inline sx props
export const createModuleStyles = {
  container: {
    py: 4
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

  headerContent: {
    flex: 1
  },

  headerTitle: {
    fontWeight: 'bold',
    color: '#0056d3'
  },

  headerSubtitle: {
    color: 'text.secondary'
  },

  paper: {
    p: 4,
    borderRadius: 3
  },

  sectionTitle: {
    mb: 3,
    fontWeight: 'bold',
    color: '#0056d3'
  },

  formInput: {
    mb: 3
  },

  descriptionInput: {
    mb: 3
  },

  divider: {
    my: 3
  },

  lessonsSection: {
    mb: 3
  },

  lessonsTitle: {
    mb: 2,
    display: 'flex',
    alignItems: 'center'
  },

  lessonsIcon: {
    mr: 1,
    color: 'primary.main'
  },

  lessonsList: {
    mb: 3
  },

  lessonItem: {
    mb: 2,
    p: 2,
    border: '1px solid #e0e0e0',
    borderRadius: 2,
    backgroundColor: '#fafafa'
  },

  lessonHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 1
  },

  lessonTitle: {
    fontWeight: 'medium'
  },

  lessonMeta: {
    color: 'text.secondary'
  },

  removeButton: {
    color: 'error.main'
  },

  addLessonButton: {
    textTransform: 'none',
    mb: 3
  },

  orderingSection: {
    mb: 3
  },

  orderingTitle: {
    mb: 2
  },

  orderingHelper: {
    color: 'text.secondary',
    mb: 2
  },

  orderingList: {
    backgroundColor: '#f8f9fa',
    p: 2,
    borderRadius: 2
  },

  orderingItem: {
    display: 'flex',
    alignItems: 'center',
    py: 1,
    px: 2,
    mb: 1,
    backgroundColor: 'white',
    borderRadius: 1,
    border: '1px solid #e0e0e0'
  },

  dragHandle: {
    mr: 2,
    color: 'text.secondary',
    cursor: 'grab'
  },

  itemText: {
    flex: 1
  },

  itemNumber: {
    color: 'text.secondary',
    fontWeight: 'bold'
  },

  actionButtons: {
    display: 'flex',
    gap: 2,
    flexWrap: 'wrap'
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

  previewButton: {
    textTransform: 'none',
    borderColor: '#0056d3',
    color: '#0056d3'
  },

  sidebarCard: {
    height: '100%'
  },

  guidelinesTitle: {
    mb: 2,
    display: 'flex',
    alignItems: 'center'
  },

  guidelinesIcon: {
    mr: 1
  },

  guideline: {
    color: 'text.secondary',
    mb: 1
  },

  tipsCard: {
    mt: 2
  },

  tipsTitle: {
    mb: 2,
    display: 'flex',
    alignItems: 'center'
  },

  tipsIcon: {
    mr: 1
  },

  tip: {
    color: 'text.secondary',
    mb: 1
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