// Admin User List page styles
export const adminUserListStyles = {
  container: {},

  title: {
    gutterBottom: true
  },

  filtersContainer: {
    display: 'flex',
    gap: 2,
    my: 2,
    flexWrap: 'wrap'
  },

  filterInput: {},

  filterSelect: {
    minWidth: 150
  },

  resetButton: {},

  loadingContainer: {},

  tableContainer: {},

  tableHead: {},

  tableRow: {},

  tableCell: {},

  actionsContainer: {
    justifyContent: 'center'
  },

  actionButton: {
    size: 'small'
  },

  promoteButton: {
    size: 'small',
    color: 'success'
  },

  demoteButton: {
    size: 'small',
    color: 'warning'
  }
};

// Admin User Activity page styles
export const adminUserActivityStyles = {
  container: {},

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 2
  },

  title: {},

  backButton: {},

  activityPaper: {
    elevation: 3
  },

  activityList: {},

  activityItem: {
    divider: true
  },

  activityText: {},

  statsContainer: {
    mt: 2
  },

  statsText: {
    color: 'textSecondary'
  }
};

// Admin User Stats page styles
export const adminUserStatsStyles = {
  container: {
    py: 4
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 3,
    flexWrap: 'wrap',
    gap: 2
  },

  title: {},

  exportButton: {},

  statsGrid: {
    mb: 4
  },

  statCard: {
    height: '100%',
    p: 2
  },

  statContent: {
    textAlign: 'center'
  },

  statTitle: {
    mb: 1,
    color: 'textSecondary',
    gutterBottom: true
  },

  statValue: {
    fontWeight: 'bold'
  },

  chartPaper: {
    p: 3
  },

  chartTitle: {
    gutterBottom: true
  },

  chartCaption: {
    mt: 2,
    display: 'block',
    color: 'text.secondary'
  },

  loadingContainer: {
    textAlign: 'center',
    py: 4
  },

  errorContainer: {
    py: 4
  },

  errorTitle: {
    color: 'error'
  }
};