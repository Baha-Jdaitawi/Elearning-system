// Login and Register page styles extracted from inline sx props
export const authStyles = {
  // Login page styles
  loginContainer: {
    minHeight: '100vh', 
    backgroundColor: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    py: 4
  },

  loginPaper: {
    p: 4,
    border: '1px solid #e5e5e5',
    borderRadius: 2
  },

  authHeader: {
    textAlign: 'center',
    mb: 4
  },

  authTitle: {
    fontWeight: 'bold',
    color: '#1a1a1a',
    mb: 1
  },

  authSubtitle: {
    color: '#666'
  },

  googleButton: {
    mb: 3,
    py: 1.5,
    borderColor: '#d1d5db',
    color: '#374151',
    textTransform: 'none',
    fontSize: '1rem',
    '&:hover': {
      borderColor: '#9ca3af',
      backgroundColor: '#f9fafb'
    }
  },

  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    mb: 3
  },

  dividerText: {
    px: 2,
    color: '#666',
    fontSize: '0.875rem'
  },

  authInput: {
    mb: 2
  },

  passwordInput: {
    mb: 3
  },

  passwordHelper: {
    mb: 2
  },

  roleSelect: {
    mb: 3
  },

  submitButton: {
    py: 1.5,
    backgroundColor: '#0056d3',
    fontSize: '1rem',
    textTransform: 'none',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#004bb8'
    }
  },

  authLinks: {
    textAlign: 'center',
    mt: 3
  },

  linkText: {
    color: '#666'
  },

  authLink: {
    color: '#0056d3',
    textDecoration: 'none',
    fontWeight: 'bold'
  },

  termsContainer: {
    textAlign: 'center',
    mt: 2
  },

  termsText: {
    color: '#999'
  },

  termsLink: {
    color: '#0056d3'
  }
};