// Layout component styles extracted from inline sx props
export const layoutStyles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#ffffff'
  },

  main: {
    flexGrow: 1,
    py: 3
  }
};

// Header component styles
export const headerStyles = {
  appBar: {
    backgroundColor: '#0056d3',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    width: '100vw',
    left: 0,
    right: 0
  },

  toolbar: {
    maxWidth: '1200px',
    width: '100%',
    mx: 'auto',
    px: 3
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    mr: 3
  },

  logoIcon: {
    mr: 1,
    fontSize: 28
  },

  logoText: {
    fontWeight: 'bold'
  },

  navLinks: {
    display: { xs: 'none', md: 'flex' },
    mr: 3
  },

  navButton: {
    mr: 2
  },

  search: {
    mr: 2,
    flexGrow: 1,
    maxWidth: 400
  },

  userMenu: {
    display: 'flex',
    alignItems: 'center'
  },

  dashboardButton: {
    mr: 1,
    display: { xs: 'none', sm: 'flex' }
  },

  avatar: {
    width: 32,
    height: 32
  },

  loginButton: {
    borderColor: 'white',
    '&:hover': {
      borderColor: 'white',
      backgroundColor: 'rgba(255, 255, 255, 0.1)'
    }
  },

  signupButton: {
    backgroundColor: 'white',
    color: '#0056d3',
    '&:hover': {
      backgroundColor: '#f0f0f0'
    }
  }
};

// Footer component styles
export const footerStyles = {
  footer: {
    backgroundColor: '#f8f9fa',
    py: 6,
    mt: 'auto',
    borderTop: '1px solid #e0e0e0'
  },

  title: {
    color: 'primary',
    gutterBottom: true
  },

  description: {
    color: 'text.secondary'
  },

  sectionTitle: {
    color: 'text.primary',
    gutterBottom: true
  },

  sectionContent: {
    color: 'text.secondary'
  },

  copyright: {
    mt: 5,
    textAlign: 'center',
    color: 'text.secondary'
  }
};